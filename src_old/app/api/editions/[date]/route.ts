import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await params

    // Parse the date parameter
    const targetDate = new Date(date)

    if (isNaN(targetDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 })
    }

    // Get the start and end of the day
    const startOfDay = new Date(targetDate)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(targetDate)
    endOfDay.setHours(23, 59, 59, 999)

    // Find edition by date
    const edition = await prisma.edition.findFirst({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        sections: {
          include: {
            pages: true,
          },
        },
      },
    })

    if (!edition) {
      return NextResponse.json({ error: "Edition not found" }, { status: 404 })
    }

    return NextResponse.json(edition)
  } catch (error) {
    console.error("Error fetching edition:", error)
    return NextResponse.json(
      { error: "Failed to fetch edition" },
      { status: 500 }
    )
  }
}
