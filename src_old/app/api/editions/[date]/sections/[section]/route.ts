import { NextResponse } from "next/server"
import { getEditionByDate, getSectionFromEdition } from "@/lib/mock-data"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ date: string; section: string }> }
) {
  try {
    const { date, section } = await params
    const edition = getEditionByDate(date)

    if (!edition) {
      return NextResponse.json({ error: "Edition not found" }, { status: 404 })
    }

    const sectionData = getSectionFromEdition(edition, section)

    if (!sectionData) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 })
    }

    return NextResponse.json(sectionData)
  } catch (error) {
    console.error("Error fetching section:", error)
    return NextResponse.json(
      { error: "Failed to fetch section" },
      { status: 500 }
    )
  }
}
