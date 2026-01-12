export interface Edition {
  id: string;
  date: string;
  publication: "reforma" | "elnorte" | "mural" | "seva-goa" | string;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  editionId: string;
  name: string;
  displayName: string;
  order: number;
  coverImage: string;
  pages: Page[];
  createdAt: string;
}

export interface Page {
  id: string;
  sectionId: string;
  pageNumber: number;
  imageUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  articles: Article[];
  createdAt: string;
}

export interface Article {
  id: string;
  pageId: string;
  title: string;
  content: string;
  author?: string;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  subscription: "free" | "basic" | "premium";
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: "light" | "dark" | "auto";
  fontSize: "small" | "medium" | "large";
  autoFlip: boolean;
  flipSpeed: number;
}

export interface Bookmark {
  id: string;
  userId: string;
  pageId: string;
  articleId?: string;
  createdAt: string;
}

export interface ReadHistory {
  id: string;
  userId: string;
  pageId: string;
  duration: number;
  createdAt: string;
}
