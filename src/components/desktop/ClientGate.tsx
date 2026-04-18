"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useIsMobile } from "@/hooks/useIsMobile";

const AquaDesktop = dynamic(() => import("./AquaDesktop"), { ssr: false });
const PhoneHome = dynamic(() => import("@/components/phone/PhoneHome"), { ssr: false });

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

  if (mobile) {
    return <PhoneHome writings={writings} />;
  }
  return <AquaDesktop writings={writings} />;
}
