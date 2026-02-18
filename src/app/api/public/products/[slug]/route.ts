import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// GET: Fetch product by slug
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const slug = segments[segments.length - 1];

    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        slug,
        description,
        price,
        categories ( name, slug ),
        product_images ( id, image_url )
      `)
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const formatted = {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      category: data.categories,
      product_images: data.product_images || [],
    };

    return NextResponse.json({ product: formatted });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}