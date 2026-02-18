

import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar />
      <main className="pt-24 min-h-screen relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}