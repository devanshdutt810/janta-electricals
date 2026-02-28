export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    let path = searchParams.get("path");

    if (!path) {
      return new NextResponse("Missing image path", { status: 400 });
    }

    // If full Supabase URL is passed, extract storage path
    if (path.includes("/storage/v1/object/public/")) {
      const parts = path.split("/storage/v1/object/public/");
      if (parts[1]) {
        // parts[1] looks like: bucket-name/filename
        const [, ...rest] = parts[1].split("/");
        path = rest.join("/");
      }
    }

    // IMPORTANT: Use correct bucket name
    const { data, error } = await supabase.storage
      .from("product-images") // your actual bucket
      .download(path);

    if (error || !data) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const buffer = await data.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": data.type || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    return new NextResponse("Server error", { status: 500 });
  }
}