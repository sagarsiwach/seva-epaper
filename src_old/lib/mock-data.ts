import { Edition, Section, Page, Article } from '@/types/edition';

// Generate placeholder image URL
const getPlaceholderImage = (width: number, height: number, pageNum: number) => {
  return `https://via.placeholder.com/${width}x${height}?text=Page+${pageNum}`;
};

// Generate mock articles for a page
const generateArticles = (pageId: string, pageNum: number): Article[] => {
  const articles: Article[] = [];
  const articleCount = Math.floor(Math.random() * 3) + 1;

  for (let i = 0; i < articleCount; i++) {
    articles.push({
      id: `article-${pageId}-${i}`,
      pageId,
      title: `Article ${i + 1} on Page ${pageNum}`,
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
      author: `Author ${i + 1}`,
      coordinates: {
        x: (i % 2) * 50,
        y: Math.floor(i / 2) * 40,
        width: 45,
        height: 35,
      },
      createdAt: new Date().toISOString(),
    });
  }

  return articles;
};

// Generate mock pages for a section
const generatePages = (sectionId: string, pageCount: number = 8): Page[] => {
  return Array.from({ length: pageCount }, (_, i) => {
    const pageNum = i + 1;
    const pageId = `page-${sectionId}-${pageNum}`;

    return {
      id: pageId,
      sectionId,
      pageNumber: pageNum,
      imageUrl: getPlaceholderImage(1280, 1920, pageNum),
      thumbnailUrl: getPlaceholderImage(200, 300, pageNum),
      width: 1280,
      height: 1920,
      articles: generateArticles(pageId, pageNum),
      createdAt: new Date().toISOString(),
    };
  });
};

// Generate mock sections for an edition
const generateSections = (editionId: string): Section[] => {
  const sectionNames = [
    { name: 'primera', displayName: 'Primera Plana' },
    { name: 'nacional', displayName: 'Nacional' },
    { name: 'negocios', displayName: 'Negocios' },
    { name: 'deportes', displayName: 'Deportes' },
    { name: 'cultura', displayName: 'Cultura' },
    { name: 'opinion', displayName: 'Opinión' },
  ];

  return sectionNames.map((section, index) => ({
    id: `section-${editionId}-${section.name}`,
    editionId,
    name: section.name,
    displayName: section.displayName,
    order: index,
    coverImage: getPlaceholderImage(300, 400, index + 1),
    pages: generatePages(`section-${editionId}-${section.name}`, 8),
    createdAt: new Date().toISOString(),
  }));
};

// Generate mock editions for different dates
export const generateEditions = (daysBack: number = 30): Edition[] => {
  const editions: Edition[] = [];

  for (let i = 0; i < daysBack; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Only generate for weekdays (skip weekends for newspaper)
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const dateStr = date.toISOString().split('T')[0];
    const editionId = `edition-${dateStr}`;

    editions.push({
      id: editionId,
      date: dateStr,
      publication: 'reforma',
      sections: generateSections(editionId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return editions;
};

// Get today's edition
export const getTodayEdition = (): Edition => {
  const today = new Date().toISOString().split('T')[0];
  const editionId = `edition-${today}`;

  return {
    id: editionId,
    date: today,
    publication: 'reforma',
    sections: generateSections(editionId),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Get edition by date
export const getEditionByDate = (date: string): Edition | null => {
  const editionId = `edition-${date}`;
  const dateObj = new Date(date);

  // Check if date is valid and not a weekend
  if (isNaN(dateObj.getTime())) return null;
  if (dateObj.getDay() === 0 || dateObj.getDay() === 6) return null;

  return {
    id: editionId,
    date,
    publication: 'reforma',
    sections: generateSections(editionId),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Get section from edition
export const getSectionFromEdition = (edition: Edition, sectionName: string): Section | null => {
  return edition.sections.find((s) => s.name === sectionName) || null;
};
