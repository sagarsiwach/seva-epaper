import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all editions
export async function GET() {
  try {
    const editions = await prisma.edition.findMany({
      include: {
        sections: {
          include: {
            pages: true,
          },
        },
        images: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(editions);
  } catch (error) {
    console.error('Error fetching editions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch editions' },
      { status: 500 }
    );
  }
}

// POST create new edition
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, editionNumber, title, description, publication } = body;

    if (!date || editionNumber === undefined) {
      return NextResponse.json(
        { error: 'Date and editionNumber are required' },
        { status: 400 }
      );
    }

    const edition = await prisma.edition.create({
      data: {
        date: new Date(date),
        editionNumber: parseInt(editionNumber),
        title,
        description,
        publication: publication || 'seva-goa',
      },
    });

    return NextResponse.json(edition, { status: 201 });
  } catch (error) {
    console.error('Error creating edition:', error);
    return NextResponse.json(
      { error: 'Failed to create edition' },
      { status: 500 }
    );
  }
}
