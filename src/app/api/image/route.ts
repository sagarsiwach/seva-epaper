import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imagePath = searchParams.get("path");

    if (!imagePath) {
      return NextResponse.json(
        { error: "Image path is required" },
        { status: 400 }
      );
    }

    // Remove leading slash and construct file path
    const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
    const filePath = join(process.cwd(), "public", cleanPath);

    // Security: ensure the path is within public directory
    const publicDir = join(process.cwd(), "public");
    if (!filePath.startsWith(publicDir)) {
      return NextResponse.json(
        { error: "Invalid image path" },
        { status: 403 }
      );
    }

    const imageData = await readFile(filePath);

    // Determine MIME type
    let mimeType = "image/jpeg";
    if (imagePath.endsWith(".png")) {
      mimeType = "image/png";
    } else if (imagePath.endsWith(".webp")) {
      mimeType = "image/webp";
    }

    return new NextResponse(imageData, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return NextResponse.json(
      { error: "Failed to serve image" },
      { status: 500 }
    );
  }
}
