export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12 text-sm text-slate-300 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} Janta Electricals. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="/products" className="hover:text-slate-300 transition">
            Products
          </a>
          <a href="/contact" className="hover:text-slate-300 transition">
            Contact
          </a>
          <a href="/admin/login" className="hover:text-slate-300 transition">
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}