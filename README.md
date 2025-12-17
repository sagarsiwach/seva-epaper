# E-Paper Viewer

A modern, fully-featured digital newspaper reading application built with Next.js, React, and TypeScript. Experience newspaper reading with realistic page-flip animations and intuitive navigation.

## 🎯 Features

### Reading Experience
- **Page Flip Animation**: Realistic 3D page-flip transitions using page-flip library
- **Zoom Controls**: Pinch and zoom support with adjustable zoom levels (50% - 400%)
- **Page Navigation**: Navigate between pages using keyboard shortcuts, buttons, or direct page input
- **Thumbnails Sidebar**: Quick access to page thumbnails with smart scrolling
- **Dark Mode**: Full dark mode support with persistent preferences

### Navigation & Discovery
- **Date-based Archive**: Calendar view to browse past editions
- **Section Navigation**: Easy switching between newspaper sections
- **Multiple View Modes**: Flip, single page, and mosaic (grid) viewing modes
- **Smart Routing**: URL-based navigation for shareable links

### User Preferences
- **Theme Selection**: Light/Dark mode toggle
- **Auto-flip**: Automatic page advancement with customizable speed
- **Customizable Animations**: Adjustable page flip duration
- **Persistent Settings**: All preferences saved to localStorage

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `→` / `Space` | Next page |
| `←` / `Backspace` | Previous page |
| `Home` | First page |
| `End` | Last page |
| `T` | Toggle thumbnails |
| `S` | Toggle section rail |
| `D` | Toggle dark mode |
| `Esc` | Close overlays |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
cd epaper-viewer

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
epaper-viewer/
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── api/                      # API routes
│   │   │   └── editions/             # Edition endpoints
│   │   ├── [date]/[section]/         # Section viewer page
│   │   ├── archive/                  # Archive/calendar page
│   │   ├── settings/                 # Settings page
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── layout/                   # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Header.module.css
│   │   └── viewer/                   # Reader components
│   │       ├── PageFlipViewer.tsx    # Main flip book
│   │       ├── PageNavigator.tsx     # Navigation controls
│   │       ├── PageThumbnails.tsx    # Thumbnail sidebar
│   │       └── ZoomControls.tsx      # Zoom controls
│   ├── hooks/
│   │   └── useKeyboardShortcuts.ts   # Keyboard handling
│   ├── lib/
│   │   ├── api/                      # API client
│   │   └── mock-data.ts              # Mock data generator
│   ├── stores/
│   │   └── viewer-store.ts           # Zustand state management
│   └── types/
│       ├── edition.ts                # Type definitions
│       └── page-flip.d.ts            # page-flip types
└── package.json
```

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with built-in optimization
- **React 18** - UI library
- **TypeScript** - Type safety
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Page Flip
- **page-flip** - Realistic page flip animations

### Development
- **Node.js** - JavaScript runtime
- **npm** - Package manager

## 📊 State Management

### Zustand Store (viewer-store.ts)
Manages:
- Current edition and section
- Current page and zoom level
- View mode (flip, single, mosaic)
- User preferences (theme, autoflip, flipSpeed)
- UI state (thumbnails visibility, overlay visibility)

## 🎨 Customization

### Theming
Edit colors in CSS modules:
- Primary: `#667eea`
- Secondary: `#764ba2`
- Dark background: `#1a1a1a`

### Page Flip Settings
Customize in `PageFlipViewer.tsx`:
```typescript
const pageFlip = new PageFlip(bookRef.current, {
  width: 550,        // Page width
  height: 733,       // Page height
  flippingTime: 1000, // Animation duration
  // ... other options
});
```

## 📱 Responsive Design
- **Desktop**: Full feature set with sidebar thumbnails
- **Tablet**: Optimized controls, responsive layout
- **Mobile**: Touch gestures, hidden thumbnails by default

## 🔌 API Routes

### Editions
- `GET /api/editions` - List editions with pagination
- `GET /api/editions/[date]` - Get specific edition
- `GET /api/editions/[date]/sections` - Get sections in edition
- `GET /api/editions/[date]/sections/[section]` - Get section details

All routes currently use mock data from `lib/mock-data.ts`.

## 🚀 Future Enhancements

- [ ] Real database integration (PostgreSQL + Prisma)
- [ ] User authentication (NextAuth.js)
- [ ] Article text overlay with search
- [ ] Bookmarking and reading history
- [ ] Social sharing functionality
- [ ] PDF/Image export
- [ ] Advanced search and filtering
- [ ] Three.js 3D page curl effects
- [ ] Analytics and tracking
- [ ] Subscription/paywall integration

## 📝 Environment Variables

Create `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/epaper"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# API
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

## 🐛 Troubleshooting

### Build Errors
- Ensure Node.js 18+ is installed: `node --version`
- Clear cache: `rm -rf .next node_modules && npm install`
- Check TypeScript errors: `npm run build`

### Page Flip Not Working
- Verify page-flip library is installed: `npm list page-flip`
- Check browser console for errors
- Ensure pages have correct dimensions

### Performance Issues
- Enable image optimization in next.config.js
- Use lazy loading for page images
- Monitor bundle size: `npm run build`

## 📄 License

MIT License - feel free to use this project!

## 👥 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Happy Reading! 📰**
