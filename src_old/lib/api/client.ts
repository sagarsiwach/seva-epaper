import { Edition, Section, Page, Article } from '@/types/edition';

const API_BASE = '/api';

export async function getEditions(
  publication?: string,
  limit?: number,
  offset?: number
): Promise<Edition[]> {
  const params = new URLSearchParams();
  if (publication) params.append('publication', publication);
  if (limit) params.append('limit', limit.toString());
  if (offset) params.append('offset', offset.toString());

  const response = await fetch(
    `${API_BASE}/editions?${params.toString()}`
  );
  if (!response.ok) throw new Error('Failed to fetch editions');
  return response.json();
}

export async function getEdition(date: string): Promise<Edition> {
  const response = await fetch(`${API_BASE}/editions/${date}`);
  if (!response.ok) throw new Error('Failed to fetch edition');
  return response.json();
}

export async function getSection(
  editionId: string,
  sectionId: string
): Promise<Section> {
  const response = await fetch(
    `${API_BASE}/editions/${editionId}/sections/${sectionId}`
  );
  if (!response.ok) throw new Error('Failed to fetch section');
  return response.json();
}

export async function getSections(editionId: string): Promise<Section[]> {
  const response = await fetch(`${API_BASE}/editions/${editionId}/sections`);
  if (!response.ok) throw new Error('Failed to fetch sections');
  return response.json();
}

export async function getPage(
  sectionId: string,
  pageNumber: number
): Promise<Page> {
  const response = await fetch(
    `${API_BASE}/sections/${sectionId}/pages/${pageNumber}`
  );
  if (!response.ok) throw new Error('Failed to fetch page');
  return response.json();
}

export async function getPages(sectionId: string): Promise<Page[]> {
  const response = await fetch(`${API_BASE}/sections/${sectionId}/pages`);
  if (!response.ok) throw new Error('Failed to fetch pages');
  return response.json();
}

export async function getArticle(articleId: string): Promise<Article> {
  const response = await fetch(`${API_BASE}/articles/${articleId}`);
  if (!response.ok) throw new Error('Failed to fetch article');
  return response.json();
}

export async function trackPageView(
  pageId: string,
  duration: number
): Promise<void> {
  const response = await fetch(`${API_BASE}/tracking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pageId, duration, action: 'view' }),
  });
  if (!response.ok) throw new Error('Failed to track page view');
}

export async function bookmarkPage(
  userId: string,
  pageId: string,
  articleId?: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/bookmarks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, pageId, articleId }),
  });
  if (!response.ok) throw new Error('Failed to bookmark page');
}

export async function getBookmarks(userId: string) {
  const response = await fetch(`${API_BASE}/bookmarks?userId=${userId}`);
  if (!response.ok) throw new Error('Failed to fetch bookmarks');
  return response.json();
}
