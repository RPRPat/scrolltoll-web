"use client";
import { useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface CountUpProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
}

export default function CountUp({ end, prefix = "", suffix = "", duration = 2, decimals = 0 }: CountUpProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, end, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => {
        setDisplay(`${prefix}${v.toFixed(decimals)}${suffix}`);
      },
    });
    return controls.stop;
  }, [isInView, end, prefix, suffix, duration, decimals]);

  return <span ref={ref}>{display}</span>;
}
