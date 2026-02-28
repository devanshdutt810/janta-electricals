

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");

    if (!path) {
      return new NextResponse("Missing image path", { status: 400 });
    }

    // Download image from Supabase Storage (server-side)
    const { data, error } = await supabase.storage
      .from("products") // your bucket name
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