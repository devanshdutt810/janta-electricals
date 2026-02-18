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
    <div className="px-6 pt-32 pb-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-300 to-slate-400 bg-clip-text text-transparent text-center">
          Our Products
        </h1>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/products"
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              !selectedCategory
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-2xl hover:scale-[1.03]"
                : "bg-white/20 backdrop-blur-xl border border-white/40 text-slate-300 hover:bg-white/30"
            }`}
          >
            All
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                selectedCategory === cat.slug
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-2xl hover:scale-[1.03]"
                  : "bg-white/20 backdrop-blur-xl border border-white/40 text-slate-300 hover:bg-white/30"
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
          <p className="mt-12 text-center text-slate-900">
            No products found.
          </p>
        ) : (
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="p-8 rounded-2xl bg-white/70 backdrop-blur-md shadow-md hover:shadow-xl transition"
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

                <h3 className="text-lg font-semibold text-slate-900">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  ₹ {product.price}
                </p>
                <p className="mt-1 text-sm text-slate-500">
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