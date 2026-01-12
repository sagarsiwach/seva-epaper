# E-Paper Viewer Rebuild

## Overview
Complete rebuild of the e-paper viewer with improved architecture.

## Architecture Decision

### Frontend: Next.js 16 + react-pageflip
- **react-pageflip** instead of page-flip (better React integration)
- Mobile-first design with touch gestures
- Zustand for state management
- Tailwind v4 + shadcn/ui

### Backend: Laravel + Filament (Phase 2)
- Admin panel using Filament
- PDF upload with automatic image extraction
- REST API for Next.js frontend
- MySQL/PostgreSQL database

## Project Structure

```
src/
├── app/
│   ├── (viewer)/
│   │   ├── [editionId]/
│   │   │   └── page.tsx          # Edition viewer
│   │   └── layout.tsx            # Viewer layout
│   ├── archive/
│   │   └── page.tsx              # Browse editions
│   ├── api/
│   │   └── editions/
│   │       └── route.ts          # Editions API
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home (redirect to latest)
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── viewer/
│   │   ├── FlipBook.tsx          # Main react-pageflip wrapper
│   │   ├── PageView.tsx          # Single page component
│   │   ├── Controls.tsx          # Zoom, nav controls
│   │   ├── Thumbnails.tsx        # Page thumbnails sidebar
│   │   └── MobileControls.tsx    # Touch-optimized controls
│   └── layout/
│       └── Header.tsx
├── lib/
│   ├── editions.ts               # Edition data fetching
│   └── utils.ts
├── stores/
│   └── viewer.ts                 # Zustand store
└── types/
    └── index.ts                  # TypeScript types
```

## Data Flow

```
1. Edition files in public/editions/Edition XX/
   └── JPG images for each page

2. API Route reads filesystem
   └── GET /api/editions → List editions
   └── GET /api/editions/[id] → Edition details with pages

3. Viewer fetches and displays
   └── FlipBook component with react-pageflip
   └── Zustand manages current page, zoom, preferences
```

## Key Decisions

### Why react-pageflip over page-flip?
- React component lifecycle management
- No manual DOM manipulation
- Built-in event handlers as props
- Better TypeScript support

### Why mobile-first?
- Most users read on phones/tablets
- Touch gestures are primary interaction
- Desktop gets enhanced controls, not the other way around

### Why Laravel + Filament for admin?
- Robust, battle-tested admin framework
- Built-in auth, media library, CRUD
- Familiar Eloquent ORM
- Easy PDF processing with PHP libraries

## Progress Log

### Session 1 - 2026-01-12
- [x] Backed up old src to src_old
- [x] Created fresh project structure
- [x] Installed react-pageflip
- [x] Built FlipBook component with react-pageflip
- [x] Built Viewer, Controls, Thumbnails components
- [x] Built Zustand store for viewer state
- [x] Created API routes for editions (filesystem-based)
- [x] Built archive page for browsing editions
- [x] Tested with existing editions - 6 editions detected
- [x] Improved flip animation to be Apple Books-like:
  - Slower flip duration (1200ms)
  - Subtle layered shadows
  - Paper texture effects
  - Spine shadow for depth
  - Reduced shadow opacity (0.15)
  - Elegant cover design with stone gradients
- [x] Added corner peel vs side peel detection:
  - Drag from corner = corner peel effect
  - Drag from edge = side peel effect
  - Click corner to flip
  - Subtle corner hints (40% opacity, 70% on hover)

### Next Steps
- [ ] Test page-flip functionality in browser
- [ ] Fine-tune mobile touch gestures
- [ ] Add Header component with navigation
- [ ] Phase 2: Set up Laravel + Filament backend

## API Contract (for Laravel backend)

```typescript
// GET /api/editions
interface EditionsResponse {
  data: Edition[]
  meta: { total: number, page: number, perPage: number }
}

// GET /api/editions/:id
interface Edition {
  id: string
  title: string
  date: string
  coverImage: string
  pages: Page[]
}

interface Page {
  id: string
  pageNumber: number
  imageUrl: string
  thumbnailUrl: string
}
```

## Environment Variables

```env
# For development (file-based)
NEXT_PUBLIC_API_URL=/api

# For production (Laravel backend)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```
