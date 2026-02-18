"use client";

import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const vantaRef = useRef<HTMLDivElement | null>(null);
  const effectRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const initVanta = async () => {
      const THREE = await import("three");
      // @ts-ignore - Vanta has no official TypeScript types
      const VANTA = (await import("vanta/dist/vanta.fog.min")).default;

      if (!mounted || !vantaRef.current) return;

      effectRef.current = VANTA({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  highlightColor: 0xe1ff,
  midtoneColor: 0x5a8c,
  baseColor: 0x0,
  blurFactor: 0.88,
  speed: 1.00,
  zoom: 0.50
      });
    };

    initVanta();

    return () => {
      mounted = false;
      if (effectRef.current) {
        effectRef.current.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="absolute top-0 left-0 w-full min-h-screen h-[100vh] -z-10"
      style={{ minHeight: "100vh" }}
    />
  );
}
