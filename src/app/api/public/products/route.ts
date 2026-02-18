

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY! // public safe key
);

// GET: Fetch products (optional ?category=slug)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");

    let categoryId: string | null = null;

    if (categorySlug) {
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();

      categoryId = categoryData?.id || null;
    }

    let query = supabase
      .from("products")
      .select(`
        id,
        name,
        slug,
        description,
        price,
        categories ( id, name, slug ),
        product_images ( image_url )
      `)
      .order("created_at", { ascending: false });

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    const formatted = data.map((product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      category: product.categories,
      imageUrl: product.product_images?.[0]?.image_url || null,
    }));

    return NextResponse.json({ products: formatted });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}