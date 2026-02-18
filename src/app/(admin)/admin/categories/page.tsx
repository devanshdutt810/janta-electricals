"use client";

import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  // Fetch categories on load
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();

      if (res.ok) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Failed to fetch categories");
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategory }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add category");
        setLoading(false);
        return;
      }

      setNewCategory("");
      await fetchCategories();
    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete category");
        return;
      }

      await fetchCategories();
    } catch (err) {
      setError("Something went wrong");
    }
  };

  const updateCategory = async (id: string) => {
    if (!editingName.trim()) return;

    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name: editingName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update category");
        return;
      }

      setEditingId(null);
      setEditingName("");
      await fetchCategories();
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Categories</h1>

      {/* Add Category */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Add New Category
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <button
            onClick={addCategory}
            disabled={loading}
            className="bg-slate-900 text-white px-4 py-3 rounded-xl active:scale-[0.98] transition disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      {/* Category List */}
      <div className="space-y-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between"
          >
            {editingId === category.id ? (
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <button
                  onClick={() => updateCategory(category.id)}
                  className="text-sm text-green-600 font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditingName("");
                  }}
                  className="text-sm text-slate-500 font-medium"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span className="font-medium">{category.name}</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setEditingId(category.id);
                      setEditingName(category.name);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {categories.length === 0 && (
          <p className="text-sm text-slate-500">No categories found.</p>
        )}
      </div>
    </div>
  );
}