"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AddProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    description: "",
    price: "",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

// Cleanup preview URLs
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();

      if (res.ok) {
        setCategories(data.categories || []);
        if (data.categories?.length > 0) {
          setFormData((prev) => ({
            ...prev,
            categoryId: data.categories[0].id,
          }));
        }
      }
    } catch (err) {
      console.error("Failed to fetch categories");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    setImageFiles(fileArray);
    setImagePreviews(fileArray.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (loading) return; // prevent double submit

    if (!formData.name.trim()) {
      setError("Product name is required.");
      return;
    }

    setUploadProgress(0);

    if (!formData.categoryId) {
      setError("Please select a category.");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create product
      const productRes = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          categoryId: formData.categoryId,
        }),
      });

      const productData = await productRes.json();

      if (!productRes.ok) {
        throw new Error(productData.error || "Failed to create product");
      }

      const productId = productData.product.id;

      // 2️⃣ Upload images (if any)
      let completed = 0;

      for (const file of imageFiles) {
        const form = new FormData();
        form.append("file", file);

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: form,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) continue;

        await fetch("/api/admin/products/images", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            imageUrl: uploadData.url,
          }),
        });

        completed++;
        setUploadProgress(Math.round((completed / imageFiles.length) * 100));
      }

      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <fieldset disabled={loading} className={loading ? "opacity-70" : ""}>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Product Images
          </label>

          <label className="mt-2 inline-block">
            <span className="inline-block bg-slate-900 text-white px-4 py-2 rounded-lg text-sm cursor-pointer active:scale-[0.98] transition">
              Choose Images
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={loading}
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {imagePreviews.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt="Preview"
                  className="w-full h-40 object-cover border border-slate-200 rounded-xl"
                />
              ))}
            </div>
          )}
          {loading && (
            <div className="mt-4">
              <div className="h-2 bg-slate-200 rounded">
                <div
                  className="h-2 bg-slate-900 rounded transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Uploading images... {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-medium active:scale-[0.98] transition disabled:opacity-60"
          >
            {loading
              ? imageFiles.length > 0
                ? `Uploading ${uploadProgress}%`
                : "Saving..."
              : "Save Product"}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => router.back()}
            className="flex-1 border border-slate-300 py-3 rounded-xl font-medium active:scale-[0.98] transition disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
        </fieldset>
      </form>
    </div>
  );
}