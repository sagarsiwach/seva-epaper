import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Your editions mapping with correct dates and image files
const editionsData = [
  {
    editionNumber: 1,
    date: new Date("2024-06-17"), // Monday
    publication: "seva-goa",
    folder: "Edition 01",
    imageCount: 2,
  },
  {
    editionNumber: 14,
    date: new Date("2024-09-16"), // Monday
    publication: "seva-goa",
    folder: "Edition 14",
    imageCount: 6,
  },
  {
    editionNumber: 22,
    date: new Date("2024-11-11"), // Monday
    publication: "seva-goa",
    folder: "Edition 22",
    imageCount: 9,
  },
  {
    editionNumber: 23,
    date: new Date("2024-11-18"), // Monday
    publication: "seva-goa",
    folder: "Edition 23",
    imageCount: 8,
  },
  {
    editionNumber: 25,
    date: new Date("2024-12-02"), // Monday
    publication: "seva-goa",
    folder: "Edition 25",
    imageCount: 6,
  },
  {
    editionNumber: 26,
    date: new Date("2024-12-09"), // Monday
    publication: "seva-goa",
    folder: "Edition 26",
    imageCount: 6,
  },
];

async function main() {
  console.log("🌱 Seeding database...\n");

  // Clear existing data
  await prisma.article.deleteMany();
  await prisma.page.deleteMany();
  await prisma.editionImage.deleteMany();
  await prisma.section.deleteMany();
  await prisma.edition.deleteMany();

  const editionsDir = path.join(process.cwd(), "public", "editions");

  for (const editionData of editionsData) {
    console.log(`📰 Creating Edition ${editionData.editionNumber}...`);

    // Create edition
    const edition = await prisma.edition.create({
      data: {
        editionNumber: editionData.editionNumber,
        date: editionData.date,
        publication: editionData.publication,
        title: `${editionData.publication.toUpperCase()} - Edition ${editionData.editionNumber}`,
        description: `Edition ${editionData.editionNumber} - ${editionData.date.toLocaleDateString()}`,
      },
    });

    // Get images from folder
    const editionPath = path.join(editionsDir, editionData.folder);
    let imageFiles: string[] = [];

    if (fs.existsSync(editionPath)) {
      const files = fs.readdirSync(editionPath);
      imageFiles = files
        .filter((f) => f.toLowerCase().endsWith(".jpg") || f.toLowerCase().endsWith(".png"))
        .sort();
    }

    // Create section
    const section = await prisma.section.create({
      data: {
        editionId: edition.id,
        name: "fullpaper",
        displayName: "Full Edition",
        order: 0,
      },
    });

    // Create pages from images
    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i];
      const directPath = `/editions/${editionData.folder}/${imageFile}`;
      // Use API route for serving images (handles spaces in filenames)
      const imageUrl = `/api/image?path=${encodeURIComponent(directPath)}`;

      const page = await prisma.page.create({
        data: {
          sectionId: section.id,
          pageNumber: i + 1,
          imageUrl,
          title: `Page ${i + 1}`,
        },
      });

      // Store image reference
      await prisma.editionImage.create({
        data: {
          editionId: edition.id,
          filename: imageFile,
          imageUrl,
          pageNumber: i + 1,
        },
      });

      console.log(`   ✓ Page ${i + 1}: ${imageFile}`);
    }

    console.log(`   ✓ Edition ${editionData.editionNumber} created\n`);
  }

  console.log("✅ Database seeded successfully!\n");

  // Show summary
  const totalEditions = await prisma.edition.count();
  const totalPages = await prisma.page.count();
  const totalImages = await prisma.editionImage.count();

  console.log("📊 Summary:");
  console.log(`   Editions: ${totalEditions}`);
  console.log(`   Sections: ${await prisma.section.count()}`);
  console.log(`   Pages: ${totalPages}`);
  console.log(`   Images: ${totalImages}\n`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
