import fs from 'fs';
import path from 'path';
import { Edition, Section, Page } from '@/types/edition';

// Get the public editions directory
const editionsDir = path.join(process.cwd(), 'public', 'editions');

// Parse edition folder and extract date
function parseEditionFolder(folderName: string): string | null {
  const match = folderName.match(/Edition (\d+)/);
  if (match) {
    const editionNum = parseInt(match[1]);
    // Convert edition number to date (starting from June 22, 2024)
    const startDate = new Date('2024-06-22');
    startDate.setDate(startDate.getDate() + (editionNum - 1) * 7); // 1 edition per week
    return startDate.toISOString().split('T')[0];
  }
  return null;
}

// Get all JPG files from an edition folder
function getEditionPages(editionPath: string): string[] {
  try {
    const files = fs.readdirSync(editionPath);
    return files
      .filter((file) => file.toLowerCase().endsWith('.jpg'))
      .sort()
      .map((file) => `/editions/${path.basename(editionPath)}/${file}`);
  } catch (error) {
    console.error(`Error reading edition folder ${editionPath}:`, error);
    return [];
  }
}

// Generate sections from pages (group by 2-3 pages)
function generateSections(pages: string[]): Section[] {
  const sections: Section[] = [];
  const sectionNames = [
    { name: 'portada', displayName: 'Portada' },
    { name: 'interior', displayName: 'Interior' },
  ];

  // Simple grouping: first page(s) as main, rest as additional
  const pagesPerSection = Math.ceil(pages.length / Math.min(2, sectionNames.length));

  for (let i = 0; i < sectionNames.length; i++) {
    const startIdx = i * pagesPerSection;
    const endIdx = Math.min(startIdx + pagesPerSection, pages.length);

    if (startIdx < pages.length) {
      const sectionPages: Page[] = pages.slice(startIdx, endIdx).map((pageUrl, idx) => ({
        id: `page-${i}-${idx}`,
        sectionId: `section-${i}`,
        pageNumber: startIdx + idx + 1,
        imageUrl: pageUrl,
        thumbnailUrl: pageUrl, // Same image for thumbnail
        width: 1280,
        height: 1920,
        articles: [],
        createdAt: new Date().toISOString(),
      }));

      sections.push({
        id: `section-${i}`,
        editionId: `edition-${i}`,
        name: sectionNames[i].name,
        displayName: sectionNames[i].displayName,
        order: i,
        coverImage: sectionPages[0]?.imageUrl || '',
        pages: sectionPages,
        createdAt: new Date().toISOString(),
      });
    }
  }

  return sections;
}

// Load real editions from filesystem
export function loadRealEditions(): Edition[] {
  const editions: Edition[] = [];

  try {
    if (!fs.existsSync(editionsDir)) {
      console.warn(`Editions directory not found: ${editionsDir}`);
      return editions;
    }

    const editionFolders = fs.readdirSync(editionsDir)
      .filter((name) => {
        const fullPath = path.join(editionsDir, name);
        return fs.statSync(fullPath).isDirectory() && name.startsWith('Edition');
      })
      .sort();

    for (const folder of editionFolders) {
      const editionPath = path.join(editionsDir, folder);
      const pages = getEditionPages(editionPath);

      if (pages.length > 0) {
        const date = parseEditionFolder(folder);
        if (date) {
          const edition: Edition = {
            id: `edition-${folder}`,
            date,
            publication: 'seva-goa',
            sections: generateSections(pages),
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
    console.error('Error loading real editions:', error);
  }

  return editions;
}

// Get edition by date
export function getRealEditionByDate(date: string): Edition | null {
  const editions = loadRealEditions();
  return editions.find((e) => e.date === date) || null;
}

// Get all available dates
export function getAvailableDates(): string[] {
  const editions = loadRealEditions();
  return editions.map((e) => e.date);
}

// Get latest edition
export function getLatestEdition(): Edition | null {
  const editions = loadRealEditions();
  return editions[0] || null;
}
