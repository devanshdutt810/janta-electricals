"use client";

import GlassSection from "@/components/GlassSection";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

export default function HomePage() {
  const [categories, setCategories] = useState<
    { id: string; name: string; slug: string; imageUrl?: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/categories");
      const data = await res.json();

      if (!res.ok) return;

      const baseCategories = data.categories || [];

      const enriched = await Promise.all(
        baseCategories.map(async (cat: any) => {
          try {
            const prodRes = await fetch(
              `/api/public/products?category=${cat.slug}`
            );
            const prodData = await prodRes.json();

            return {
              ...cat,
              imageUrl: prodData.products?.[0]?.imageUrl || null,
            };
          } catch {
            return { ...cat };
          }
        })
      );

      setCategories(enriched);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Failed to fetch categories");
    }
  };

  return (
    <div className="w-full">
      <section className="pt-40 pb-32 px-6 text-center relative">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-6 py-3 mb-8 text-sm font-medium rounded-full glass text-slate-300">
            Trusted Leaders Since 2010
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] bg-gradient-to-r from-slate-300 via-blue-300 to-slate-300 bg-clip-text text-transparent">
            Industrial-Grade Air Coolers & Genuine Spare Parts
          </h1>

          <p className="mt-8 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Engineered for performance, durability and reliable bulk supply —
            built for distributors, retailers and industrial clients.
          </p>

          <div className="mt-12 flex justify-center gap-6 flex-wrap">
            <Link href="/contact" className="inline-block">
              <button className="hero-button">
                <div className="blob1"></div>
                <div className="inner">Request Bulk Quote</div>
              </button>
            </Link>

            <Link href="/products" className="inline-block">
              <button className="hero-button">
                <div className="blob1"></div>
                <div className="inner">Explore Products</div>
              </button>
            </Link>
          </div>
        </div>
      </section>

      <GlassSection>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent text-center">
            Our Product Categories
          </h2>

          <div className="mt-16">
            {loading ? (
              <Loader />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="glass group p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.03] block"
                  >
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="h-40 w-full object-cover rounded-lg mb-6 transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-40 bg-slate-100 rounded-lg mb-6 flex items-center justify-center text-slate-400 text-sm">
                        No Image
                      </div>
                    )}

                    <h3 className="text-lg font-semibold text-slate-900">
                      {category.name}
                    </h3>

                    <p className="mt-3 text-sm text-slate-600">
                      Premium quality {category.name.toLowerCase()} built for durability and performance.
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </GlassSection>

      <GlassSection>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent text-center">
            Why Choose Janta Electricals
          </h2>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              "Bulk Manufacturing Capability",
              "Strict Quality Control",
              "Reliable Distribution Network",
            ].map((item) => (
              <div
                key={item}
                className="glass-strong p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {item}
                </h3>
                <p className="mt-3 text-sm text-slate-600">
                  Built to support large-scale supply with consistency and long-term reliability.
                </p>
              </div>
            ))}
          </div>
        </div>
      </GlassSection>

      <GlassSection>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent">
            Reach Us
          </h2>

          <p className="mt-6 text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Mfg. & Supplier : Cooler, Spare Parts & All Kinds of Spare
            <br />
            Shop No. 140-141, Kamla Market, New Delhi-110002
          </p>

          <div className="mt-12 rounded-2xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3500.3027153523394!2d77.19766307550256!3d28.680589975638526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjjCsDQwJzUwLjEiTiA3N8KwMTInMDAuOSJF!5e0!3m2!1sen!2sin!4v1771069636107!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="mt-8">
            <a
              href="https://maps.app.goo.gl/9SVupmQUAkoiTvLcA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
            >
              Open in Maps
            </a>
          </div>
        </div>
      </GlassSection>
    </div>
  );
}