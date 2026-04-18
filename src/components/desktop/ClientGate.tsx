"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useIsMobile } from "@/hooks/useIsMobile";
import BootSequence from "@/components/boot/BootSequence";

const AquaDesktop = dynamic(() => import("./AquaDesktop"), { ssr: false });
const PhoneHome = dynamic(() => import("@/components/phone/PhoneHome"), { ssr: false });
const DebugOverlay = dynamic(() => import("@/components/phone/DebugOverlay"), { ssr: false });

interface Props {
  initialMobileHint: boolean;
  writings: {
    slug: string;
    title: string;
    tag: string;
    date: string;
    excerpt: string;
  }[];
}

export default function ClientGate({ initialMobileHint, writings }: Props) {
  const viewportMobile = useIsMobile(640);
  const [mobile, setMobile] = useState(initialMobileHint);

  useEffect(() => {
    setMobile(viewportMobile);
  }, [viewportMobile]);

  return (
    <>
      {mobile ? <PhoneHome writings={writings} /> : <AquaDesktop writings={writings} />}
      <BootSequence isMobile={mobile} />
      <DebugOverlay />
    </>
  );
}
