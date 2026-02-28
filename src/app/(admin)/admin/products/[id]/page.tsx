"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

interface ProductImage {
  id: string;
  image_url: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  product_images: ProductImage[];
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
  });

  const [newImages, setNewImages] = useState<File[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productRes, categoryRes] = await Promise.all([
        fetch(`/api/admin/products/${productId}`),
        fetch("/api/admin/categories"),
      ]);

      const productData = await productRes.json();
      const categoryData = await categoryRes.json();

      if (!productRes.ok) {
        setError(productData.error || "Failed to load product");
        setLoading(false);
        return;
      }

      setProduct(productData.product);
      setCategories(categoryData.categories || []);

      setFormData({
        name: productData.product.name,
        description: productData.product.description,
        price: String(productData.product.price),
        categoryId: productData.product.category_id,
      });
    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setNewImages(Array.from(files));
  };

  const deleteImage = async (imageId: string) => {
    if (!confirm("Delete this image?")) return;

    await fetch(`/api/admin/products/images?id=${imageId}`, {
      method: "DELETE",
    });

    fetchData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return; // prevent re-submit
    setError("");
    setSaving(true);
    setUploadProgress(0);

    try {
      const updateRes = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
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

      const updateData = await updateRes.json();

      if (!updateRes.ok) {
        setError(updateData.error || "Failed to update product");
        return;
      }

      // Upload new images
      let completed = 0;

      for (const file of newImages) {
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
        setUploadProgress(Math.round((completed / newImages.length) * 100));
      }

      router.push("/admin/products");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!product)
    return (
      <div>
        <p className="text-red-600">Product not found</p>
        <button
          onClick={() => router.push("/admin/products")}
          className="mt-4 bg-slate-900 text-white px-4 py-2 rounded-lg"
        >
          Back
        </button>
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <fieldset disabled={saving} className={saving ? "opacity-70" : ""}>
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-2 w-full px-4 py-3 border rounded-xl"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="mt-2 w-full px-4 py-3 border rounded-xl"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-2 w-full px-4 py-3 border rounded-xl"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-2 w-full px-4 py-3 border rounded-xl"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Existing Images</label>
          <div className="grid grid-cols-2 gap-4 mt-3">
            {product.product_images.map((img) => (
              <div key={img.id} className="relative">
                <img
                  src={`/api/public/image?path=${encodeURIComponent(img.image_url)}`}
                  className="w-full h-40 object-cover rounded-xl border"
                />
                <button
                  type="button"
                  onClick={() => deleteImage(img.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Add New Images</label>

          <label className="mt-2 inline-block">
            <span className="inline-block bg-slate-900 text-white px-4 py-2 rounded-lg text-sm cursor-pointer active:scale-[0.98] transition">
              Choose Images
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              disabled={saving}
              onChange={handleNewImages}
              className="hidden"
            />
          </label>

          {newImages.length > 0 && (
            <p className="text-sm text-slate-500 mt-2">
              {newImages.length} file(s) selected
            </p>
          )}

          {saving && newImages.length > 0 && (
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

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-slate-900 text-white py-3 rounded-xl disabled:opacity-60"
          >
            {saving
              ? newImages.length > 0
                ? `Uploading ${uploadProgress}%`
                : "Updating..."
              : "Update"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => router.back()}
            className="flex-1 border py-3 rounded-xl disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
        </fieldset>
      </form>
    </div>
  );
}