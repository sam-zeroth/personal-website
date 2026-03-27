"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/store/useStore";
import {
  brainRegions,
  FISSURE_GAP,
  REGION_INDEX,
  type EllipsoidDef,
} from "@/data/brainData";

// --- Config ---
const CONNECTION_DISTANCE = 0.5;
const MAX_CONNECTIONS_PER_NEURON = 12;
const LONG_RANGE_COUNT = 60;
const INTERIOR_RATIO = 0.2; // 20% of points are interior

// --- Seeded PRNG ---
function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// --- Fibonacci sphere: uniform points on unit sphere ---
function fibonacciSphere(count: number): [number, number, number][] {
  const points: [number, number, number][] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (2 * (i + 0.5)) / count;
    const radius = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;

    points.push([radius * Math.cos(theta), y, radius * Math.sin(theta)]);
  }

  return points;
}

// --- Generate neuron positions from brain region ellipsoids ---
interface Neuron {
  pos: THREE.Vector3;
  regionIndex: number;
}

function generateBrainNeurons(): Neuron[] {
  const neurons: Neuron[] = [];

  for (const region of brainRegions) {
    const regionIdx = REGION_INDEX[region.id!];

    for (const shape of region.shapes) {
      const surfaceCount = Math.round(shape.pointCount * (1 - INTERIOR_RATIO));
      const interiorCount = shape.pointCount - surfaceCount;

      // Surface points via fibonacci sphere
      const surfacePoints = fibonacciSphere(surfaceCount);
      for (const [sx, sy, sz] of surfacePoints) {
        const x = shape.center[0] + sx * shape.scale[0];
        const y = shape.center[1] + sy * shape.scale[1];
        const z = shape.center[2] + sz * shape.scale[2];

        // Reject points inside the central fissure
        if (Math.abs(x) < FISSURE_GAP) continue;

        // Add slight organic noise
        const seed = x * 127 + y * 311 + z * 523;
        const noise = seededRandom(seed) * 0.03 - 0.015;

        neurons.push({
          pos: new THREE.Vector3(x + noise, y + noise * 0.7, z + noise * 0.9),
          regionIndex: regionIdx,
        });
      }

      // Interior points (random within ellipsoid)
      for (let i = 0; i < interiorCount; i++) {
        const seed = regionIdx * 1000 + i * 13.37 + shape.center[0] * 100;
        const r = 0.3 + seededRandom(seed) * 0.5; // 30-80% of radius
        const pt = fibonacciSphere(1)[0]; // random direction
        // Use seeded random direction instead
        const theta = seededRandom(seed + 1) * Math.PI * 2;
        const phi = Math.acos(2 * seededRandom(seed + 2) - 1);

        const x = shape.center[0] + Math.sin(phi) * Math.cos(theta) * shape.scale[0] * r;
        const y = shape.center[1] + Math.cos(phi) * shape.scale[1] * r;
        const z = shape.center[2] + Math.sin(phi) * Math.sin(theta) * shape.scale[2] * r;

        if (Math.abs(x) < FISSURE_GAP) continue;

        neurons.push({
          pos: new THREE.Vector3(x, y, z),
          regionIndex: regionIdx,
        });
      }
    }
  }

  return neurons;
}

// --- Spatial hash for O(n) connection building ---
class SpatialHash {
  private cellSize: number;
  private grid = new Map<string, number[]>();

  constructor(cellSize: number) {
    this.cellSize = cellSize;
  }

  private key(x: number, y: number, z: number) {
    return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)},${Math.floor(z / this.cellSize)}`;
  }

  insert(i: number, p: THREE.Vector3) {
    const k = this.key(p.x, p.y, p.z);
    if (!this.grid.has(k)) this.grid.set(k, []);
    this.grid.get(k)!.push(i);
  }

  neighbors(p: THREE.Vector3): number[] {
    const result: number[] = [];
    const cx = Math.floor(p.x / this.cellSize);
    const cy = Math.floor(p.y / this.cellSize);
    const cz = Math.floor(p.z / this.cellSize);
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++)
        for (let dz = -1; dz <= 1; dz++) {
          const cell = this.grid.get(`${cx + dx},${cy + dy},${cz + dz}`);
          if (cell) result.push(...cell);
        }
    return result;
  }
}

interface ConnectionData {
  positions: Float32Array;
  alphas: Float32Array;
  regionIds: Float32Array;
}

function buildConnections(neurons: Neuron[]): ConnectionData {
  const hash = new SpatialHash(CONNECTION_DISTANCE);
  for (let i = 0; i < neurons.length; i++) hash.insert(i, neurons[i].pos);

  const counts = new Int32Array(neurons.length);
  const lines: number[] = [];
  const lineAlphas: number[] = [];
  const lineRegions: number[] = [];
  const added = new Set<number>();

  for (let i = 0; i < neurons.length; i++) {
    if (counts[i] >= MAX_CONNECTIONS_PER_NEURON) continue;
    const nbrs = hash.neighbors(neurons[i].pos);

    const candidates: [number, number][] = [];
    for (const j of nbrs) {
      if (j <= i) continue;
      const d = neurons[i].pos.distanceTo(neurons[j].pos);
      if (d < CONNECTION_DISTANCE && d > 0.01) candidates.push([j, d]);
    }
    candidates.sort((a, b) => a[1] - b[1]);

    for (const [j, dist] of candidates) {
      if (counts[i] >= MAX_CONNECTIONS_PER_NEURON) break;
      if (counts[j] >= MAX_CONNECTIONS_PER_NEURON) continue;
      const key = i * neurons.length + j;
      if (added.has(key)) continue;
      added.add(key);

      const pi = neurons[i].pos;
      const pj = neurons[j].pos;

      lines.push(pi.x, pi.y, pi.z, pj.x, pj.y, pj.z);

      // Alpha based on depth and distance from center
      const di = pi.length();
      const dj = pj.length();
      const ai = Math.max(0.06, Math.min(0.3, 0.32 - di * 0.08));
      const aj = Math.max(0.06, Math.min(0.3, 0.32 - dj * 0.08));
      lineAlphas.push(ai, aj);

      lineRegions.push(neurons[i].regionIndex, neurons[j].regionIndex);

      counts[i]++;
      counts[j]++;
    }
  }

  // Long-range connections
  for (let k = 0; k < LONG_RANGE_COUNT; k++) {
    const seed = k * 17.31 + 777;
    const i = Math.floor(seededRandom(seed) * neurons.length);
    const j = Math.floor(seededRandom(seed + 1) * neurons.length);
    if (i === j) continue;

    const pi = neurons[i].pos;
    const pj = neurons[j].pos;
    lines.push(pi.x, pi.y, pi.z, pj.x, pj.y, pj.z);
    lineAlphas.push(0.03, 0.03);
    lineRegions.push(neurons[i].regionIndex, neurons[j].regionIndex);
  }

  return {
    positions: new Float32Array(lines),
    alphas: new Float32Array(lineAlphas),
    regionIds: new Float32Array(lineRegions),
  };
}

// --- Shaders ---

// Light pastel mix: blend region color with white at ~80% white
// On hover: saturate to full color. Others fade to very light grey.
const dotVertexShader = `
  attribute float regionId;
  uniform float uPixelRatio;
  varying float vRegionId;

  void main() {
    vRegionId = regionId;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = max(1.5, 4.0 * uPixelRatio * (10.0 / -mvPos.z));
    gl_Position = projectionMatrix * mvPos;
  }
`;

const dotFragmentShader = `
  uniform float uHoveredRegion;
  uniform float uActiveRegion;
  uniform vec3 uColors[4];
  uniform float uOpacity;
  uniform float uTime;

  varying float vRegionId;

  void main() {
    // Circular point with soft edge
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;

    int idx = int(vRegionId + 0.5);
    vec3 regionColor = uColors[idx];

    // Light pastel: 75% white + 25% region color
    vec3 pastel = mix(regionColor, vec3(1.0), 0.72);
    // Dark version for hover: darker than the pure color
    vec3 dark = regionColor * 0.7;

    vec3 color;
    float a;

    if (uActiveRegion >= 0.0) {
      if (abs(vRegionId - uActiveRegion) < 0.5) {
        // Active lobe: darken to saturated color
        color = dark;
        a = 0.95;
      } else {
        // Other lobes: keep light pastel
        color = pastel;
        a = 0.55;
      }
    } else if (uHoveredRegion >= 0.0) {
      if (abs(vRegionId - uHoveredRegion) < 0.5) {
        // Hovered lobe: darken to saturated color
        color = dark;
        a = 0.92;
      } else {
        // Other lobes: keep light pastel
        color = pastel;
        a = 0.5;
      }
    } else {
      // Default: light pastel tint per region
      color = pastel;
      a = 0.85;
    }

    gl_FragColor = vec4(color, a * uOpacity);
  }
`;

const lineVertexShader = `
  attribute float alpha;
  attribute float regionId;
  varying float vAlpha;
  varying float vRegionId;

  void main() {
    vAlpha = alpha;
    vRegionId = regionId;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const lineFragmentShader = `
  uniform float uHoveredRegion;
  uniform float uActiveRegion;
  uniform vec3 uColors[4];
  uniform float uOpacity;

  varying float vAlpha;
  varying float vRegionId;

  void main() {
    int idx = int(vRegionId + 0.5);
    vec3 regionColor = uColors[idx];

    // Light pastel line color
    vec3 pastel = mix(regionColor, vec3(1.0), 0.7);
    vec3 dark = regionColor * 0.55;

    vec3 color;
    float a;

    if (uActiveRegion >= 0.0) {
      if (abs(vRegionId - uActiveRegion) < 0.5) {
        color = dark;
        a = vAlpha * 2.0;
      } else {
        // Keep pastel lines, just softer
        color = pastel;
        a = vAlpha * 0.4;
      }
    } else if (uHoveredRegion >= 0.0) {
      if (abs(vRegionId - uHoveredRegion) < 0.5) {
        color = dark;
        a = vAlpha * 2.5;
      } else {
        // Keep pastel lines, softer
        color = pastel;
        a = vAlpha * 0.35;
      }
    } else {
      // Default: light pastel tinted lines
      color = pastel;
      a = vAlpha * 0.8;
    }

    gl_FragColor = vec4(color, a * uOpacity);
  }
`;

// --- Component ---
export default function NeuronCloud() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { isZoomed, hoveredRegion, activeRegion } = useStore();

  // Region colors as vec3 array for shaders
  const regionColors = useMemo(
    () => brainRegions.map((r) => new THREE.Vector3(...r.colorVec)),
    []
  );

  // Generate all geometry
  const { pointsGeo, dotMat, connData } = useMemo(() => {
    const neurons = generateBrainNeurons();

    // Points
    const positions = new Float32Array(neurons.length * 3);
    const regionIds = new Float32Array(neurons.length);

    for (let i = 0; i < neurons.length; i++) {
      positions[i * 3] = neurons[i].pos.x;
      positions[i * 3 + 1] = neurons[i].pos.y;
      positions[i * 3 + 2] = neurons[i].pos.z;
      regionIds[i] = neurons[i].regionIndex;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("regionId", new THREE.BufferAttribute(regionIds, 1));

    // Dot material
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexShader: dotVertexShader,
      fragmentShader: dotFragmentShader,
      uniforms: {
        uHoveredRegion: { value: -1.0 },
        uActiveRegion: { value: -1.0 },
        uColors: { value: brainRegions.map((r) => new THREE.Vector3(...r.colorVec)) },
        uOpacity: { value: 1.0 },
        uTime: { value: 0.0 },
        uPixelRatio: { value: 1.0 },
      },
    });

    // Connections
    const connections = buildConnections(neurons);

    return { pointsGeo: geo, dotMat: mat, connData: connections };
  }, []);

  // Line geometry + material
  const { lineGeo, lineMat } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(connData.positions, 3));
    geo.setAttribute("alpha", new THREE.BufferAttribute(connData.alphas, 1));
    geo.setAttribute("regionId", new THREE.BufferAttribute(connData.regionIds, 1));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexShader: lineVertexShader,
      fragmentShader: lineFragmentShader,
      uniforms: {
        uHoveredRegion: { value: -1.0 },
        uActiveRegion: { value: -1.0 },
        uColors: { value: brainRegions.map((r) => new THREE.Vector3(...r.colorVec)) },
        uOpacity: { value: 1.0 },
      },
    });

    return { lineGeo: geo, lineMat: mat };
  }, [connData]);

  // Add line segments to group
  useEffect(() => {
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    linesRef.current = lines;
    groupRef.current?.add(lines);

    return () => {
      groupRef.current?.remove(lines);
      lineGeo.dispose();
      lineMat.dispose();
    };
  }, [lineGeo, lineMat]);

  // Animate uniforms
  useFrame((state) => {
    const hovIdx = hoveredRegion ? REGION_INDEX[hoveredRegion] : -1;
    const actIdx = activeRegion ? REGION_INDEX[activeRegion] : -1;
    const targetOpacity = isZoomed ? 0.6 : 1.0;

    // Dots
    if (dotMat) {
      dotMat.uniforms.uHoveredRegion.value = hovIdx;
      dotMat.uniforms.uActiveRegion.value = actIdx;
      dotMat.uniforms.uTime.value = performance.now() / 1000;
      dotMat.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
      dotMat.uniforms.uOpacity.value +=
        (targetOpacity - dotMat.uniforms.uOpacity.value) * 0.08;
    }

    // Lines
    if (lineMat) {
      lineMat.uniforms.uHoveredRegion.value = hovIdx;
      lineMat.uniforms.uActiveRegion.value = actIdx;
      lineMat.uniforms.uOpacity.value +=
        (targetOpacity - lineMat.uniforms.uOpacity.value) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={pointsGeo} material={dotMat} />
    </group>
  );
}
