# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start development server at localhost:3000

# Build & Production
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database (Prisma with SQLite)
npm run prisma:generate   # Generate Prisma client
npm run prisma:push       # Push schema changes to database
npm run prisma:seed       # Seed database with initial data
npm run db:setup          # Full setup: push schema + seed
```

## Architecture

### Tech Stack
- **Next.js 16** with App Router
- **React 19** with TypeScript
- **Tailwind CSS v4** (uses `@tailwindcss/postcss`)
- **Zustand** for client-side state management
- **Prisma** with SQLite database
- **shadcn/ui** component library (Radix primitives)
- **page-flip** library for realistic page turn animations

### Core Data Flow
1. Edition PDFs/JPGs stored in `public/editions/Edition XX/`
2. API routes (`src/app/api/editions/`) query Prisma for edition metadata
3. Section page (`src/app/[date]/[section]/page.tsx`) fetches edition data and renders `PageFlipViewer`
4. `PageFlipViewer` handles page-flip library initialization and keyboard navigation
5. `viewer-store.ts` manages all viewer state (page, zoom, thumbnails) with localStorage persistence

### Key Components
- `PageFlipViewer` (`src/components/viewer/PageFlipViewer.tsx`): Main viewer with page-flip initialization, image preloading, and keyboard shortcuts
- `viewer-store` (`src/stores/viewer-store.ts`): Zustand store managing currentPage, zoomLevel, showThumbnails, preferences (persisted: autoFlip, flipSpeed)

### Database Schema (Prisma)
Models: `Edition` → `Section` → `Page` → `Article`
- Edition has date and editionNumber (both unique)
- Sections have order for display sequence
- Pages store imageUrl paths to files in public/editions/

### URL Routing
- `/` - Home (redirects to latest edition)
- `/archive` - Calendar view of all editions
- `/[date]/[section]` - Section viewer (e.g., `/2024-06-22/fullpaper`)
- `/settings` - User preferences

### API Endpoints
- `GET /api/editions` - List editions with pagination
- `GET /api/editions/[date]` - Get edition with sections and pages
- `GET /api/editions/[date]/sections` - Get sections for an edition
- `GET /api/editions/[date]/sections/[section]` - Get specific section

## Important Patterns

### Viewer State
The viewer store uses Zustand's `persist` middleware to save user preferences (autoFlip, flipSpeed, showThumbnails) to localStorage under key `epaper-viewer-store`.

### Page Flip Integration
PageFlip is initialized from DOM elements with class `page-item`. Pages use `data-density="hard"` for covers and `data-density="soft"` for content pages. The library is destroyed on component unmount.

### Image Loading
Priority loading for first 3 pages, lazy loading for remainder. 3-second timeout fallback ensures viewer becomes ready even if images fail to load.
