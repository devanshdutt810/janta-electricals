"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Menu as MenuIcon } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "HOME", href: "/" },
    { name: "PRODUCTS", href: "/products" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <header className="w-full fixed top-0 left-0 z-50 backdrop-blur-md bg-white/40 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-slate-100"
        >
          Janta Electricals
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-slate-100 underline"
                    : "text-slate-100 hover:underline"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className="px-6 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-xl hover:scale-[1.03] hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
          >
            Request Quote
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-lg bg-white/30 backdrop-blur-md border">
                <MenuIcon className="h-5 w-5 text-slate-600" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-48 glass-strong brounded-lg bg-white/30 backdrop-blur-md border text-slate-200 bold"
            >
              {navItems.map((item, index) => (
                <div key={item.name}>
                  <DropdownMenuItem asChild>
                    <Link href={item.href}>{item.name}</Link>
                  </DropdownMenuItem>
                  {index !== navItems.length - 1 && (
                    <DropdownMenuSeparator />
                  )}
                </div>
              ))}

              {/* <DropdownMenuItem asChild>
                <Link href="/contact">Request Quote</Link>
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}