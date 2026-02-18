"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  imageUrl: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories || []);
      }
    } catch (err) {}
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const url = selectedCategory
        ? `/api/public/products?category=${selectedCategory}`
        : "/api/public/products";

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to fetch products");
        setLoading(false);
        return;
      }

      setProducts(data.products || []);
    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="px-6 pt-24 pb-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-300 to-slate-300 bg-clip-text text-transparent text-center">
          Our Products
        </h1>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/products"
            className={`relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg border border-white/50 backdrop-blur-sm shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] transition-all duration-300 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none ${
              !selectedCategory
                ? "bg-green-600/50 text-white shadow-[0_0_30px_rgba(0,255,255,0.9),0_0_60px_rgba(0,255,255,0.4)] ring-1 ring-cyan-300/80"
                : "bg-white/10 text-slate-300 hover:bg-cyan-400/10 hover:shadow-[0_0_25px_rgba(0,255,255,0.7)]"
            }`}
          >
            All
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg border border-white/50 backdrop-blur-sm shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] transition-all duration-300 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none ${
                selectedCategory === cat.slug
                  ? "bg-green-600/50 text-white shadow-[0_0_30px_rgba(0,255,255,0.9),0_0_60px_rgba(0,255,255,0.4)] ring-1 ring-cyan-300/80"
                  : "bg-white/10 text-slate-300 hover:bg-cyan-400/10 hover:shadow-[0_0_25px_rgba(0,255,255,0.7)]"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {error && (
          <p className="mt-6 text-center text-red-600 text-sm">{error}</p>
        )}

        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <p className="mt-8 text-center text-slate-900">
            No products found.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="relative p-8 text-white bg-black/20 backdrop-blur-sm border border-white/50 rounded-lg shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] hover:bg-white/30 hover:-translate-y-1 transition-all duration-300 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none block"
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-40 w-full object-cover rounded-lg mb-6"
                  />
                ) : (
                  <div className="h-40 bg-slate-100 rounded-lg mb-6 flex items-center justify-center text-slate-400">
                    No Image
                  </div>
                )}

                <h3 className="text-lg font-semibold">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm opacity-90">
                  ₹ {product.price}
                </p>
                <p className="mt-1 text-sm opacity-70">
                  {product.category?.name}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}