// Edition types for the e-paper viewer

export interface Edition {
  id: string
  title: string
  date: string
  editionNumber: number
  coverImage: string
  pageCount: number
  pages: Page[]
  createdAt: string
}

export interface Page {
  id: string
  pageNumber: number
  imageUrl: string
  thumbnailUrl?: string
  width?: number
  height?: number
}

// API response types
export interface EditionsResponse {
  editions: Edition[]
  total: number
}

export interface EditionResponse {
  edition: Edition
}

// Viewer state types
export type ViewMode = "flip" | "single" | "scroll"

export interface ViewerPreferences {
  theme: "light" | "dark" | "system"
  autoFlip: boolean
  flipDuration: number // milliseconds
  showPageNumbers: boolean
}
