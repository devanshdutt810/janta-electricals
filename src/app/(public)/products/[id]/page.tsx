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
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-white/30 backdrop-blur-md shadow-md text-slate-300 font-medium hover:bg-slate-200 hover:text-black transition"
        >
          <span className="text-lg">←</span>
          Products
        </Link>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div>
            <div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-md p-6">
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
          <div className="max-w-6xl mx-auto glass p-10 rounded-2xl">
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
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
              >
                Request Quote
              </a>
              <Link
                href={`/products?category=${product.category?.slug}`}
                className="px-8 py-4 rounded-xl bg-white/20 backdrop-blur-xl border border-white/40 text-slate-300 font-medium hover:bg-white/30 hover:shadow-xl transition-all duration-300"
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