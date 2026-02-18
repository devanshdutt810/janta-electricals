"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loader from "@/components/Loader";

interface ProductImage {
  id: string;
  image_url: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: {
    name: string;
    slug: string;
  };
  product_images: ProductImage[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (slug) fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/public/products/${slug}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Product not found");
        setLoading(false);
        return;
      }

      setProduct(data.product);
      if (data.product.product_images?.length > 0) {
        setActiveImage(data.product.product_images[0].image_url);
      }
    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  if (loading) return <Loader />;

  if (!product)
    return (
      <div className="pt-32 px-6 text-center">
        <h1 className="text-3xl font-semibold text-slate-300">
          {error || "Product not found"}
        </h1>
        <Link
          href="/products"
          className="mt-6 inline-block text-slate-300 underline"
        >
          Products
        </Link>
      </div>
    );

  return (
    <div className="px-6 pt-16 pb-24">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/products"
          className="relative inline-flex items-center gap-2 px-5 py-2 text-white text-sm font-medium rounded-lg bg-black/20 border border-white/50 backdrop-blur-sm shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] hover:bg-white/30 hover:shadow-[0_0_25px_rgba(0,255,255,0.7)] transition-all duration-300 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none"
        >
          <span className="text-lg">←</span>
          Products
        </Link>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div>
            <div className="relative p-6 bg-black/20 backdrop-blur-sm border border-white/50 rounded-lg shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-96 object-contain bg-white rounded-xl"
                />
              ) : (
                <div className="h-96 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                  No Image
                </div>
              )}
            </div>

            {product.product_images?.length > 1 && (
              <div className="mt-6 flex gap-4 flex-wrap">
                {product.product_images.map((img) => (
                  <img
                    key={img.id}
                    src={img.image_url}
                    onClick={() => setActiveImage(img.image_url)}
                    className={`w-24 h-24 object-cover rounded-lg cursor-pointer border ${
                      activeImage === img.image_url
                        ? "border-slate-900"
                        : "border-slate-200"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="relative max-w-6xl mx-auto p-10 text-white bg-black/20 backdrop-blur-sm border border-white/50 rounded-lg shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-300 to-slate-300 bg-clip-text text-transparent">
              {product.name}
            </h1>

            <p className="mt-4 text-lg font-semibold text-slate-300">
              ₹ {product.price}
            </p>

            <p className="mt-4 text-slate-300 capitalize">
              Product Type: {product.category?.name}
            </p>

            <p className="mt-8 text-lg text-slate-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>

            <div className="mt-12 flex gap-6 flex-wrap">
              <a
                href={`https://wa.me/918586836646?text=${encodeURIComponent(
                  `I would like to Buy ${product.name}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center justify-center px-8 py-4 text-white text-sm font-medium rounded-lg bg-cyan-400/20 border border-cyan-300/80 backdrop-blur-sm shadow-[0_0_30px_rgba(0,255,255,0.9),0_0_60px_rgba(0,255,255,0.4)] hover:bg-cyan-400/30 hover:shadow-[0_0_40px_rgba(0,255,255,1),0_0_80px_rgba(0,255,255,0.5)] transition-all duration-300 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none"
              >
                Request Quote
              </a>
              <Link
                href={`/products?category=${product.category?.slug}`}
                className="relative inline-flex items-center justify-center px-8 py-4 text-white text-sm font-medium rounded-lg bg-black/20 border border-white/50 backdrop-blur-sm shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] hover:bg-white/30 hover:shadow-[0_0_25px_rgba(0,255,255,0.7)] transition-all duration-300 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none"
              >
                View Similar Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}