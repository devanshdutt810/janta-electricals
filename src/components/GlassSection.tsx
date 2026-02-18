import { ReactNode } from "react";

export default function GlassSection({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section className="px-6 py-24">
      <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-lg border border-white/40 p-12">
        {children}
      </div>
    </section>
  );
}