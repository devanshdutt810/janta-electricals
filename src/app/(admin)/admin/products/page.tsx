

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  categoryName: string;
  imageUrl: string | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
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

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to delete product");
        return;
      }

      await fetchProducts();
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm active:scale-[0.98] transition"
        >
          + Add
        </Link>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-slate-500">No products found.</p>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  {product.imageUrl ? (
                    <img
                      src={`/api/public/image?path=${encodeURIComponent(product.imageUrl)}`}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-slate-100 rounded-lg" />
                  )}

                  <div>
                    <h2 className="text-lg font-medium">{product.name}</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      {product.categoryName}
                    </p>
                    <p className="text-sm font-semibold mt-1">
                      ₹ {product.price}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-sm px-3 py-1.5 border border-slate-300 rounded-md active:scale-[0.98] transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-sm px-3 py-1.5 border border-red-200 text-red-600 rounded-md active:scale-[0.98] transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}