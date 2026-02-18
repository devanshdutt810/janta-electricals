"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="space-y-4">
        <Link
          href="/admin/products"
          className="block bg-white border border-slate-200 rounded-xl p-6 shadow-sm active:scale-[0.98] transition"
        >
          <h2 className="text-lg font-medium">Manage Products</h2>
          <p className="text-sm text-slate-600 mt-1">
            Add, edit or remove products
          </p>
        </Link>

        <Link
          href="/admin/categories"
          className="block bg-white border border-slate-200 rounded-xl p-6 shadow-sm active:scale-[0.98] transition"
        >
          <h2 className="text-lg font-medium">Manage Categories</h2>
          <p className="text-sm text-slate-600 mt-1">
            Add or update product categories
          </p>
        </Link>

        <button
          onClick={() => router.push("/")}
          className="w-full bg-red-50 border border-red-200 rounded-xl p-6 text-left shadow-sm active:scale-[0.98] transition"
        >
          <h2 className="text-lg font-medium text-red-600">Logout</h2>
          <p className="text-sm text-red-500 mt-1">
            Sign out of admin panel
          </p>
        </button>
      </div>
    </div>
  );
}