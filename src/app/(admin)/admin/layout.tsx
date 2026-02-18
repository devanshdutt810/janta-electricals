"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isRoot = pathname === "/admin/dashboard";
  const isLoginPage = pathname === "/admin/login";

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="w-full px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isRoot && (
              <button
                onClick={() => router.back()}
                className="text-sm px-3 py-1.5 border border-slate-300 rounded-md active:scale-[0.98] transition"
              >
                ← Back
              </button>
            )}

            <Link
              href="/admin/dashboard"
              className="text-lg font-semibold text-slate-900"
            >
              Admin Panel
            </Link>
          </div>

          {!isLoginPage && (
            <Link
              href="/admin/dashboard"
              className="text-sm px-4 py-2 bg-slate-900 text-white rounded-lg active:scale-[0.98] transition"
            >
              Home
            </Link>
          )}
        </div>
      </header>

      <main className="w-full px-4 py-6">
        {children}
      </main>
    </div>
  );
}