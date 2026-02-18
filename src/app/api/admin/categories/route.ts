

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// GET: Fetch all categories
export async function GET() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }

  return NextResponse.json({ categories: data });
}

// POST: Add new category
export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const slug = generateSlug(name);

    const { data, error } = await supabase
      .from("categories")
      .insert({
        name: name.trim(),
        slug,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Category already exists or failed to insert" },
        { status: 400 }
      );
    }

    return NextResponse.json({ category: data });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// DELETE: Remove category by id
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Category id is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete category" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// PUT: Update category name
export async function PUT(req: Request) {
  try {
    const { id, name } = await req.json();

    if (!id || !name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Valid id and category name are required" },
        { status: 400 }
      );
    }

    const slug = generateSlug(name);

    const { error } = await supabase
      .from("categories")
      .update({
        name: name.trim(),
        slug,
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to update category (maybe duplicate name)" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}