import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "30");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Get editions from database
    const editions = await prisma.edition.findMany({
      include: {
        sections: {
          include: {
            pages: true,
          },
        },
      },
      orderBy: {
        date: "desc", // Newest first
      },
      skip: offset,
      take: limit,
    });

    return NextResponse.json(editions);
  } catch (error) {
    console.error("Error fetching editions:", error);
    return NextResponse.json({ error: "Failed to fetch editions" }, { status: 500 });
  }
}
