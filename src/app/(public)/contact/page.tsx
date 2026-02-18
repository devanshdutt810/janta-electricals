"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    category: "coolers",
    message: "",
  });

  const [categories, setCategories] = useState<
    { id: string; name: string; slug: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (res.ok) {
        setLoading(false);
        setCategories(data.categories || []);
        // Set default category if available
        if (data.categories?.length > 0) {
          setFormData((prev) => ({
            ...prev,
            category: data.categories[0].slug,
          }));
        }
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.error("Failed to fetch categories");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const message = `Hello, I would like to request a bulk quote.%0A%0A
Name: ${formData.name}%0A
Company: ${formData.company || "N/A"}%0A
Phone: ${formData.phone}%0A
Email: ${formData.email}%0A
Category: ${formData.category}%0A
Message: ${formData.message}`;

    const whatsappUrl = `https://wa.me/918586836646?text=${message}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="px-6 pt-32 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-300 via-blue-300 to-slate-300 bg-clip-text text-transparent">
            Request a Bulk Quote
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            Connect with our sales team for wholesale pricing, distribution
            partnerships, and product specifications.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-10">
            <div>
              <h3 className="text-xl font-semibold text-slate-300">
                Business Information
              </h3>
              <p className="mt-4 text-slate-300 leading-relaxed">
                Janta Electricals
                <br />
                Mfg. & Supplier : Cooler, Spare Parts & All Kinds of Spare
                <br />
                Shop No. 140-141, Kamla Market, New Delhi-110002
                <br />                <br />
                Phone:
                <br />                <br />
                <a href="tel:9811007048" className="text-white-700 hover:underline">
                  9811007048
                </a>                <br />
                
                <a href="tel:7838266437" className="text-white-700 hover:underline">
                  7838266437
                </a>                <br />
                
                <a href="tel:8586836646" className="text-white-700 hover:underline">
                  8586836646
                </a>
                {/* <br />
                Email: sales@jantaelectricals.com */}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-300">
                Working Hours
              </h3>
              <p className="mt-4 text-slate-300">
                Monday – Saturday
                <br />
                9:00 AM – 6:00 PM
              </p>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="relative p-10 text-white bg-black/20 backdrop-blur-sm border border-white/50 rounded-lg shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-white/30 bg-white/5 backdrop-blur-sm text-white focus:outline-none focus:ring-0 focus:border-cyan-300/80 focus:shadow-[0_0_20px_rgba(0,255,255,0.9),0_0_40px_rgba(0,255,255,0.4)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-white/30 bg-white/5 backdrop-blur-sm text-white focus:outline-none focus:ring-0 focus:border-cyan-300/80 focus:shadow-[0_0_20px_rgba(0,255,255,0.9),0_0_40px_rgba(0,255,255,0.4)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-white/30 bg-white/5 backdrop-blur-sm text-white focus:outline-none focus:ring-0 focus:border-cyan-300/80 focus:shadow-[0_0_20px_rgba(0,255,255,0.9),0_0_40px_rgba(0,255,255,0.4)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    // required
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-white/30 bg-white/5 backdrop-blur-sm text-white focus:outline-none focus:ring-0 focus:border-cyan-300/80 focus:shadow-[0_0_20px_rgba(0,255,255,0.9),0_0_40px_rgba(0,255,255,0.4)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Product Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={loading}
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-white/30 bg-white/5 backdrop-blur-sm text-white focus:outline-none focus:ring-0 focus:border-cyan-300/80 focus:shadow-[0_0_20px_rgba(0,255,255,0.9),0_0_40px_rgba(0,255,255,0.4)] disabled:opacity-50"
                >
                  {loading ? (
                    <option>Loading categories...</option>
                  ) : (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Message / Requirements
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-white/30 bg-white/5 backdrop-blur-sm text-white focus:outline-none focus:ring-0 focus:border-cyan-300/80 focus:shadow-[0_0_20px_rgba(0,255,255,0.9),0_0_40px_rgba(0,255,255,0.4)]"
                />
              </div>

              <button
                type="submit"
                className="relative w-full inline-flex items-center justify-center px-6 py-4 text-white text-sm font-medium rounded-lg bg-cyan-400/20 border border-cyan-300/80 backdrop-blur-sm shadow-[0_0_30px_rgba(0,255,255,0.9),0_0_60px_rgba(0,255,255,0.4)] hover:bg-cyan-400/30 hover:shadow-[0_0_40px_rgba(0,255,255,1),0_0_80px_rgba(0,255,255,0.5)] transition-all duration-300 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none"
              >
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}