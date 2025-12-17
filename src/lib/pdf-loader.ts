import fs from "fs";
import path from "path";
import { Edition, Page } from "@/types/edition";

// Get the public editions directory
const editionsDir = path.join(process.cwd(), "public", "editions");

// Parse edition folder and extract date - ONLY MONDAYS starting from Edition 02
function parseEditionFolder(folderName: string): string | null {
  const match = folderName.match(/Edition (\d+)/);
  if (match) {
    const editionNum = parseInt(match[1]);

    // Edition 02 = June 24, 2024 (first Monday)
    // Each edition is 1 week apart (7 days)
    const startDate = new Date("2024-06-24"); // First Monday
    startDate.setDate(startDate.getDate() + (editionNum - 2) * 7); // Edition 02 = 0 offset

    return startDate.toISOString().split("T")[0];
  }
  return null;
}

// Get JPG/PNG images from edition folder
function getEditionImages(editionPath: string): string[] {
  try {
    const files = fs.readdirSync(editionPath);
    return files
      .filter((file) => {
        const lower = file.toLowerCase();
        return lower.endsWith(".jpg") || lower.endsWith(".png") || lower.endsWith(".jpeg");
      })
      .sort()
      .map((file) => `/editions/${path.basename(editionPath)}/${file}`);
  } catch (error) {
    console.error(`Error reading edition folder ${editionPath}:`, error);
    return [];
  }
}

// Generate pages from images
function generatePagesFromImages(imageUrls: string[]): Page[] {
  const pages: Page[] = [];

  imageUrls.forEach((imageUrl, idx) => {
    pages.push({
      id: `page-${idx}`,
      sectionId: "fullpaper",
      pageNumber: idx + 1,
      imageUrl, // Direct image URL
      thumbnailUrl: imageUrl, // Same image for thumbnail
      width: 1280,
      height: 1920,
      articles: [],
      createdAt: new Date().toISOString(),
    });
  });

  return pages;
}

// Load real editions from filesystem
export function loadRealEditionsFromPdf(): Edition[] {
  const editions: Edition[] = [];

  try {
    if (!fs.existsSync(editionsDir)) {
      console.warn(`Editions directory not found: ${editionsDir}`);
      return editions;
    }

    const editionFolders = fs
      .readdirSync(editionsDir)
      .filter((name) => {
        const fullPath = path.join(editionsDir, name);
        try {
          return fs.statSync(fullPath).isDirectory() && name.startsWith("Edition");
        } catch {
          return false;
        }
      })
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || "0");
        const numB = parseInt(b.match(/\d+/)?.[0] || "0");
        return numB - numA; // Descending order (newest first)
      });

    for (const folder of editionFolders) {
      const editionPath = path.join(editionsDir, folder);
      const imageUrls = getEditionImages(editionPath);

      // Only include editions that have images
      if (imageUrls.length > 0) {
        const date = parseEditionFolder(folder);
        if (date) {
          const pages = generatePagesFromImages(imageUrls);

          const edition: Edition = {
            id: `edition-${folder}`,
            date,
            publication: "seva-goa",
            sections: [
              {
                id: "fullpaper",
                editionId: `edition-${folder}`,
                name: "fullpaper",
                displayName: "Full Edition",
                order: 0,
                coverImage: imageUrls[0] || "",
                pages,
                createdAt: new Date().toISOString(),
              },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          editions.push(edition);
        }
      }
    }

    // Sort by date descending (newest first)
    editions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    console.log(`Loaded ${editions.length} real editions from ${editionsDir}`);
  } catch (error) {
    console.error("Error loading real editions:", error);
  }

  return editions;
}

// Get edition by date
export function getRealEditionByDateFromPdf(date: string): Edition | null {
  const editions = loadRealEditionsFromPdf();
  return editions.find((e) => e.date === date) || null;
}

// Get all available dates
export function getAvailableDatesFromPdf(): string[] {
  const editions = loadRealEditionsFromPdf();
  return editions
    .map((e) => e.date)
    .sort()
    .reverse();
}

// Get latest edition
export function getLatestEditionFromPdf(): Edition | null {
  const editions = loadRealEditionsFromPdf();
  return editions[0] || null;
}

// Get all editions with pagination
export function getAllRealEditionsFromPdf(limit: number = 30, offset: number = 0): Edition[] {
  const editions = loadRealEditionsFromPdf();
  return editions.slice(offset, offset + limit);
}
