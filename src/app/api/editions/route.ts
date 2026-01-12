import { NextResponse } from "next/server"
import { getEditions } from "@/lib/editions"

export async function GET() {
  try {
    const editions = getEditions()

    return NextResponse.json({
      editions: editions.map((e) => ({
        ...e,
        pages: undefined, // Don't include pages in list view
      })),
      total: editions.length,
    })
  } catch (error) {
    console.error("Error fetching editions:", error)
    return NextResponse.json(
      { error: "Failed to fetch editions" },
      { status: 500 }
    )
  }
}
