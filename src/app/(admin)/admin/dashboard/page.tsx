"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/admin/logout", {
      method: "POST",
    });
    router.replace("/");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="space-y-4">
        <Link
          href="/admin/categories"
          className="block bg-white border border-slate-200 rounded-xl p-6 shadow-sm active:scale-[0.98] transition"
        >
          <h2 className="text-lg font-medium">Manage Categories</h2>
          <p className="text-sm text-slate-600 mt-1">
            Add or update product categories
          </p>
        </Link>

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
          href="/admin/change-password"
          className="block bg-white border border-slate-200 rounded-xl p-6 shadow-sm active:scale-[0.98] transition"
        >
          <h2 className="text-lg font-medium">Change Password</h2>
          <p className="text-sm text-slate-600 mt-1">
            Update your admin password
          </p>
        </Link>

        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full bg-red-50 border border-red-200 rounded-xl p-6 text-left shadow-sm active:scale-[0.98] transition disabled:opacity-60"
        >
          <h2 className="text-lg font-medium text-red-600">Logout</h2>
          <p className="text-sm text-red-500 mt-1">
            Exit admin panel
          </p>
        </button>
      </div>
    </div>
  );
}