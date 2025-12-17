import { NextResponse } from "next/server"
import { getEditionByDate } from "@/lib/mock-data"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await params
    const edition = getEditionByDate(date)

    if (!edition) {
      return NextResponse.json({ error: "Edition not found" }, { status: 404 })
    }

    return NextResponse.json(edition.sections)
  } catch (error) {
    console.error("Error fetching sections:", error)
    return NextResponse.json(
      { error: "Failed to fetch sections" },
      { status: 500 }
    )
  }
}
