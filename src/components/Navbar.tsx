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
    <header className="w-full fixed top-0 left-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/50 shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-40 before:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-30 after:pointer-events-none">
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
            className="relative inline-flex items-center justify-center px-6 py-2.5 text-white text-sm font-medium rounded-lg bg-cyan-400/20 border border-cyan-300/80 backdrop-blur-sm shadow-[0_0_30px_rgba(0,255,255,0.9),0_0_60px_rgba(0,255,255,0.4)] hover:bg-cyan-400/30 hover:shadow-[0_0_40px_rgba(0,255,255,1),0_0_80px_rgba(0,255,255,0.5)] transition-all duration-300 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none"
          >
            Request Quote
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 rounded-lg bg-black/20 backdrop-blur-sm border border-white/50 shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] hover:bg-white/30 transition-all duration-300 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none">
                <MenuIcon className="h-5 w-5 text-slate-300" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="relative w-48 rounded-lg bg-black/20 backdrop-blur-sm border border-white/50 text-white shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none"
            >
              {navItems.map((item, index) => (
                <div key={item.name}>
                  <DropdownMenuItem asChild>
                    <Link
                      href={item.href}
                      // className="relative flex items-center px-4 py-3 rounded-lg bg-white/5 border border-white/30 backdrop-blur-sm text-white hover:bg-white/10 hover:border-cyan-300/80 hover:shadow-[0_0_20px_rgba(0,255,255,0.9),0_0_40px_rgba(0,255,255,0.4)] transition-all duration-300 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-50 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-40 after:pointer-events-none"
                    >
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                  {index !== navItems.length - 1 && (
                    <DropdownMenuSeparator />
                  )}
                </div>
              ))}

              {/* <DropdownMenuSeparator /> */}

              {/* <DropdownMenuItem asChild>
                <Link
                  href="/contact"
                  className="relative flex items-center justify-center px-4 py-3 mt-2 rounded-lg bg-cyan-400/20 border border-cyan-300/80 backdrop-blur-sm text-white shadow-[0_0_30px_rgba(0,255,255,0.9),0_0_60px_rgba(0,255,255,0.4)] hover:bg-cyan-400/30 hover:shadow-[0_0_40px_rgba(0,255,255,1),0_0_80px_rgba(0,255,255,0.5)] transition-all duration-300 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none"
                >
                  Request Quote
                </Link>
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}