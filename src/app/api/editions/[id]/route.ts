import { NextResponse } from "next/server"
import { getEdition } from "@/lib/editions"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const edition = getEdition(id)

    if (!edition) {
      return NextResponse.json(
        { error: "Edition not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ edition })
  } catch (error) {
    console.error("Error fetching edition:", error)
    return NextResponse.json(
      { error: "Failed to fetch edition" },
      { status: 500 }
    )
  }
}
