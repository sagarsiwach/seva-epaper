# Development Guide - E-Paper Viewer

## 🏗️ Architecture Decisions

### Why Next.js?
- **File-based routing** - Automatic route creation
- **API routes** - Backend in same codebase
- **Image optimization** - Built-in next/image
- **SSR/SSG** - Server-side rendering when needed
- **Performance** - Automatic code splitting

### Why Zustand for State?
- **Lightweight** - No boilerplate
- **Simple API** - Easy to learn
- **Performance** - Only re-renders affected components
- **Middleware** - Built-in persistence support
- **DevTools** - Easy debugging

### Why page-flip Library?
- **Realistic animations** - Physics-based transitions
- **Touch support** - Mobile gestures
- **Lightweight** - Small bundle size
- **Active maintenance** - Regular updates
- **Cross-browser** - Works everywhere

## 📝 Code Style

### TypeScript Conventions
```typescript
// ✅ Good
interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: number;
}

const updatePreferences = (prefs: UserPreferences): void => {
  // ...
};

// ❌ Bad
const updatePreferences = (prefs: any) => {
  // ...
};
```

### Component Structure
```typescript
'use client'; // If client component

import { useState } from 'react';
import styles from './Component.module.css';

interface ComponentProps {
  title: string;
  onAction?: () => void;
}

export function Component({ title, onAction }: ComponentProps) {
  const [state, setState] = useState(false);

  return (
    <div className={styles.container}>
      {title}
    </div>
  );
}
```

### File Naming
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Hooks: `useNamedHook.ts`
- Styles: `Component.module.css`
- Types: `entity.ts`

## 🚀 Development Workflow

### Adding a New Feature

1. **Create the component**
```bash
src/components/feature/NewFeature.tsx
src/components/feature/NewFeature.module.css
```

2. **Define types**
```bash
src/types/feature.ts
```

3. **Add to store if needed**
```typescript
// Update src/stores/viewer-store.ts
featureEnabled: boolean;
setFeatureEnabled: (enabled: boolean) => void;
```

4. **Create page or update existing**
```bash
src/app/feature/page.tsx
src/app/feature/page.module.css
```

5. **Add API route if needed**
```bash
src/app/api/feature/route.ts
```

6. **Test and commit**

### Example: Adding Dark Mode Toggle

1. **Update store** (already done in this project!)
2. **Create button component**:
```typescript
export function ThemeToggle() {
  const { theme, setTheme } = useViewerStore();

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

3. **Add to header**:
```typescript
<ThemeToggle />
```

4. **Test in browser**

## 🧪 Testing Strategy

### Unit Testing (Future)
```typescript
// Example test structure
import { render, screen } from '@testing-library/react';
import { PageNavigator } from './PageNavigator';

describe('PageNavigator', () => {
  it('displays current page number', () => {
    render(<PageNavigator currentPage={5} totalPages={10} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
```

### Manual Testing Checklist
- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Test on tablet (iPad, Android)
- [ ] Test on mobile (iPhone, Android)
- [ ] Test dark mode
- [ ] Test all keyboard shortcuts
- [ ] Test page flip animation
- [ ] Test zoom functionality
- [ ] Test thumbnail scrolling
- [ ] Test responsive breakpoints
- [ ] Test archive calendar

### Performance Testing
```bash
# Build and analyze
npm run build

# Check bundle size
npm run build
# Look at .next/static folder

# Check runtime performance
# Open DevTools > Performance tab
# Record and analyze frame rates
```

## 🔧 Common Tasks

### Adding a New Page
```typescript
// src/app/newpage/page.tsx
'use client';

import { Header } from '@/components/layout/Header';
import styles from './newpage.module.css';

export default function NewPage() {
  return (
    <div className={styles.container}>
      <Header date={new Date().toISOString().split('T')[0]} publication="Reforma" />
      {/* Your content */}
    </div>
  );
}
```

### Adding API Endpoint
```typescript
// src/app/api/resource/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = { /* your data */ };
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch' },
      { status: 500 }
    );
  }
}
```

### Adding Styles
```css
/* Use CSS modules for component isolation */
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Use CSS custom properties for theming */
@media (prefers-color-scheme: dark) {
  .container {
    background: var(--dark-bg);
    color: var(--dark-text);
  }
}
```

### Using Store in Component
```typescript
'use client';

import { useViewerStore } from '@/stores/viewer-store';

export function MyComponent() {
  const { currentPage, setCurrentPage, theme } = useViewerStore();

  return (
    <div>
      Current: {currentPage}
      <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
    </div>
  );
}
```

## 🐛 Debugging Tips

### Browser DevTools
```javascript
// In console
// Access store
import { useViewerStore } from '@/stores/viewer-store';
const store = useViewerStore.getState();
console.log(store);

// Change values
store.setTheme('dark');

// Subscribe to changes
useViewerStore.subscribe(console.log);
```

### Common Issues

**Issue**: Page not updating after state change
```typescript
// ❌ Wrong
const state = useViewerStore(); // Getting entire state

// ✅ Right
const { currentPage, setCurrentPage } = useViewerStore(); // Selective
```

**Issue**: Component re-rendering too much
```typescript
// Use selector to avoid unnecessary re-renders
const currentPage = useViewerStore(state => state.currentPage);
```

**Issue**: TypeScript errors on components
```typescript
// ✅ Always define props interface
interface ComponentProps {
  title: string;
  children?: React.ReactNode;
}

export function Component({ title, children }: ComponentProps) {
  // ...
}
```

## 📚 Project Structure Deep Dive

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API endpoints
│   ├── [date]/[section]/         # Dynamic routes
│   ├── archive/                  # Static routes
│   ├── settings/
│   ├── layout.tsx                # Root wrapper
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
│
├── components/                   # React Components
│   ├── layout/                   # Layout wrappers
│   │   └── Header.tsx
│   └── viewer/                   # Feature components
│       ├── PageFlipViewer.tsx
│       ├── PageNavigator.tsx
│       ├── PageThumbnails.tsx
│       └── ZoomControls.tsx
│
├── hooks/                        # Custom hooks
│   └── useKeyboardShortcuts.ts   # Reusable logic
│
├── lib/                          # Utilities
│   ├── api/                      # API client
│   │   └── client.ts
│   └── mock-data.ts              # Sample data
│
├── stores/                       # State management
│   └── viewer-store.ts           # Zustand store
│
└── types/                        # TypeScript types
    ├── edition.ts                # Domain types
    └── page-flip.d.ts            # Third-party types
```

## 🎯 Performance Optimization

### Image Optimization
```typescript
import Image from 'next/image';

// ✅ Use Next.js Image
<Image
  src="/page.jpg"
  alt="Page"
  width={1280}
  height={1920}
  priority // Load immediately
  quality={85} // Balance quality/size
/>

// ❌ Avoid native img
<img src="/page.jpg" />
```

### Code Splitting
```typescript
import dynamic from 'next/dynamic';

// Load component only when needed
const PageFlipViewer = dynamic(() => import('@/components/viewer/PageFlipViewer'), {
  loading: () => <Spinner />,
  ssr: false // Don't render on server
});
```

### Bundle Analysis
```bash
npm install --save-dev @next/bundle-analyzer

# Add to next.config.js:
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

## 🚀 Deployment Checklist

- [ ] All tests passing
- [ ] No console errors
- [ ] TypeScript strict mode enabled
- [ ] Environment variables configured
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] SEO meta tags added
- [ ] Performance budget met
- [ ] Analytics integrated
- [ ] Error tracking setup
- [ ] Security headers configured
- [ ] Database backups scheduled

## 📖 Learning Resources

### Next.js
- [Official Docs](https://nextjs.org/docs)
- [API Reference](https://nextjs.org/docs/app/api-reference)
- [Examples](https://github.com/vercel/next.js/tree/canary/examples)

### React
- [React Docs](https://react.dev)
- [Hooks Documentation](https://react.dev/reference/react)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Cheatsheet](https://www.typescriptlang.org/cheatsheets)

### Zustand
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [API Documentation](https://github.com/pmndrs/zustand#api)

## �� Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Follow code style guide
3. Write tests if possible
4. Update documentation
5. Create pull request

---

**Happy coding!** 🎉

For questions or issues, check existing GitHub issues or create a new one.
