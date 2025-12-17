# shadcn/ui + Tailwind CSS + Next.js Setup Guide

> **Last Updated**: December 2024  
> **Official Docs**: [ui.shadcn.com](https://ui.shadcn.com)  
> **Create Tool**: [ui.shadcn.com/create](https://ui.shadcn.com/create)

---

## 📋 Table of Contents

1. [Quick Start](#-quick-start)
2. [🆕 shadcn create (New Tool!)](#-shadcn-create-new-tool)
3. [Tailwind CSS v4 Setup](#-tailwind-css-v4-setup)
4. [shadcn/ui Installation](#-shadcnui-installation)
5. [CLI Commands Reference](#-cli-commands-reference)
6. [Dark Mode Setup](#-dark-mode-setup)
7. [Theming & CSS Variables](#-theming--css-variables)
8. [Available Components](#-available-components)
9. [Project-Specific Setup (E-Paper Viewer)](#-project-specific-setup)
10. [Best Practices](#-best-practices)

---

## 🚀 Quick Start

### For New Next.js Projects

```bash
# Create new Next.js project with TypeScript
npx create-next-app@latest my-project --typescript --eslint --app
cd my-project

# Initialize shadcn/ui (this also sets up Tailwind CSS)
npx shadcn@latest init

# Add your first components
npx shadcn@latest add button card dialog
```

### For Existing Next.js Projects (like epaper-viewer)

```bash
# Initialize shadcn/ui in existing project
npx shadcn@latest init

# Follow the prompts:
# - TypeScript: Yes
# - Style: default/new-york
# - Base color: neutral/zinc/slate/stone/gray
# - Global CSS: src/app/globals.css
# - CSS variables: Yes
# - Tailwind config: tailwind.config.js (or auto-detect)
# - Components alias: @/components
# - Utils alias: @/lib/utils
```

---

## 🆕 shadcn create (New Tool!)

> **NEW in December 2024**: A powerful way to create your **own customized version** of shadcn/ui!

### What is `shadcn create`?

The new `npx shadcn create` command allows you to build a completely customized shadcn/ui setup. Unlike regular theming, this tool **rewrites the actual component code** to match your chosen configuration!

### Web Interface

Visit **[ui.shadcn.com/create](https://ui.shadcn.com/create)** to:
- Preview all components with different styles
- Test Radix vs Base UI components
- View demo pages (Home, Elevenlabs, GitHub, Vercel, ChatGPT themes)
- Generate your custom configuration

### CLI Command

```bash
npx shadcn create
```

### Customization Options

| Option | Choices |
|--------|---------|
| **Component Library** | Radix UI, Base UI |
| **Visual Style** | Vega, Nova, Maia, Lyra, Mira |
| **Icons** | Lucide, Phosphor, etc. |
| **Base Color** | Neutral, Zinc, Slate, Stone, Gray |
| **Fonts** | Custom font selection |
| **Theme** | Light/Dark configuration |

### Visual Styles Explained

| Style | Description | Best For |
|-------|-------------|----------|
| **Vega** | Classic shadcn/ui look | General purpose, familiar feel |
| **Nova** | Compact with reduced padding/margins | Dense layouts, data tables |
| **Maia** | Soft and rounded, generous spacing | Friendly UIs, consumer apps |
| **Lyra** | Boxy and sharp edges | Monospace fonts, developer tools |
| **Mira** | Ultra-compact, dense interfaces | Admin dashboards, complex UIs |

### Component Library Choice

#### Radix UI (Default)
- Battle-tested, widely adopted
- Excellent accessibility
- Large community
- More documentation available

#### Base UI (New!)
- Created by same team behind Radix
- Lighter weight
- Modern approach
- Alternative accessibility patterns

### Example Usage

```bash
# Interactive mode - choose all options
npx shadcn create

# This will:
# 1. Ask for your component library preference
# 2. Let you choose a visual style
# 3. Pick icons, colors, fonts
# 4. Rewrite ALL component code to match your choices
```

### Key Difference from `init`

| Feature | `npx shadcn init` | `npx shadcn create` |
|---------|-------------------|---------------------|
| **Customization** | Basic theming (colors) | Complete code rewrite |
| **Component Library** | Radix only | Radix OR Base UI |
| **Visual Styles** | Default only | 5 predefined styles |
| **Code Changes** | CSS variables only | Fonts, spacing, structure |
| **Use Case** | Add to existing project | Create new custom setup |

### Preview Before Creating

Visit the preview pages to see components in action:

- [Home Preview](https://ui.shadcn.com/preview/radix/preview)
- [Elevenlabs Theme](https://ui.shadcn.com/preview/radix/elevenlabs)
- [GitHub Theme](https://ui.shadcn.com/preview/radix/github)
- [Vercel Theme](https://ui.shadcn.com/preview/radix/vercel)
- [ChatGPT Theme](https://ui.shadcn.com/preview/radix/chatgpt)

### New Components Available

These new components were introduced with the create tool:

| Component | Description |
|-----------|-------------|
| **Spinner** | Loading indicator |
| **Kbd** | Keyboard key display |
| **Button Group** | Grouped buttons |
| **Input Group** | Grouped inputs |
| **Field** | Form field wrapper |
| **Item** | List item component |
| **Empty** | Empty state displays |
| **Native Select** | Browser-native select |
| **Sidebar variants** | Icon, Inset, Floating |

---

## 🎨 Tailwind CSS v4 Setup

> **Note**: Tailwind CSS v4 uses a new installation method with `@tailwindcss/postcss`.

### Installation

```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

### Configure PostCSS

Create `postcss.config.mjs` in project root:

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

### Import Tailwind CSS

In `src/app/globals.css`:

```css
@import "tailwindcss";
```

### Verify Setup

```bash
npm run dev
```

Test with:

```tsx
export default function Home() {
  return (
    <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
  );
}
```

---

## 📦 shadcn/ui Installation

### Step 1: Initialize

```bash
# Using pnpm (recommended)
pnpm dlx shadcn@latest init

# Using npm
npx shadcn@latest init

# Using yarn
yarn dlx shadcn@latest init

# Using bun
bunx shadcn@latest init
```

### Step 2: Configure (Interactive Prompts)

The CLI will ask:
- **Template**: Next.js or Monorepo
- **Base color**: neutral, gray, zinc, stone, slate
- **CSS variables**: Yes (recommended)
- **Source directory**: Use `src/` (default: true)
- **Components location**: `@/components`

### Step 3: Generated Files

After initialization, you'll have:

```
project/
├── components.json          # shadcn configuration
├── lib/
│   └── utils.ts             # cn() utility function
├── src/app/
│   └── globals.css          # Updated with CSS variables
└── components/
    └── ui/                  # Components will be added here
```

### `components.json` Example

```json
{
  "style": "new-york",
  "rsc": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

---

## 🔧 CLI Commands Reference

### `init` - Initialize Project

```bash
npx shadcn@latest init [options] [components...]

# Options:
# -t, --template <template>     Template: next, next-monorepo
# -b, --base-color <color>      Base color: neutral, gray, zinc, stone, slate
# -y, --yes                     Skip confirmation (default: true)
# -f, --force                   Force overwrite existing config
# -c, --cwd <cwd>               Working directory
# -s, --silent                  Mute output
# --src-dir                     Use src directory
# --css-variables               Use CSS variables (default: true)
# --no-base-style               Skip base shadcn style

# Examples:
npx shadcn@latest init -y                          # Quick init with defaults
npx shadcn@latest init -b zinc                     # Init with zinc base color
npx shadcn@latest init button card dialog          # Init + add components
```

### `add` - Add Components

```bash
npx shadcn@latest add [component]

# Options:
# -y, --yes         Skip confirmation
# -o, --overwrite   Overwrite existing files
# -a, --all         Add all available components
# -p, --path        Custom path for component
# -s, --silent      Mute output

# Examples:
npx shadcn@latest add button                       # Single component
npx shadcn@latest add button card dialog           # Multiple components
npx shadcn@latest add -a                           # ALL components
npx shadcn@latest add button -o                    # Overwrite existing
```

### `view` - Preview Before Installing

```bash
npx shadcn@latest view [item]

# Examples:
npx shadcn@latest view button                      # View button source
npx shadcn@latest view button card dialog          # View multiple
npx shadcn@latest view @acme/auth                  # View from registry
```

### `search` / `list` - Find Components

```bash
npx shadcn@latest search [registry]

# Options:
# -q, --query <query>     Search query
# -l, --limit <number>    Max items (default: 100)
# -o, --offset <number>   Skip items

# Examples:
npx shadcn@latest search @shadcn                   # Search official
npx shadcn@latest search @shadcn -q "button"       # Search with query
npx shadcn@latest list @shadcn                     # List all items
```

### `build` - Build Registry

```bash
npx shadcn@latest build

# Options:
# -o, --output <path>     Output directory (default: ./public/r)

# Example:
npx shadcn@latest build --output ./public/registry
```

---

## 🌙 Dark Mode Setup

### Step 1: Install next-themes

```bash
pnpm add next-themes
# or
npm install next-themes
```

### Step 2: Create Theme Provider

Create `src/components/theme-provider.tsx`:

```tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

### Step 3: Wrap Root Layout

Update `src/app/layout.tsx`:

```tsx
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Step 4: Add Mode Toggle

Create `src/components/mode-toggle.tsx`:

```tsx
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## 🎨 Theming & CSS Variables

### CSS Variable Convention

shadcn/ui uses `background` and `foreground` convention:

```css
/* Background color of component */
.bg-primary   /* Uses --primary */

/* Text color of component */
.text-primary-foreground   /* Uses --primary-foreground */
```

### Complete CSS Variables List

Add to `src/app/globals.css`:

```css
@import "tailwindcss";

:root {
  --radius: 0.625rem;
  
  /* Main colors */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  
  /* Card */
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  
  /* Popover */
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  
  /* Primary */
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  
  /* Secondary */
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  
  /* Muted */
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  
  /* Accent */
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  
  /* Destructive */
  --destructive: oklch(0.577 0.245 27.325);
  
  /* Borders & Inputs */
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  
  /* Charts */
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  
  /* Sidebar */
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  
  --popover: oklch(0.269 0 0);
  --popover-foreground: oklch(0.985 0 0);
  
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  
  --accent: oklch(0.371 0 0);
  --accent-foreground: oklch(0.985 0 0);
  
  --destructive: oklch(0.704 0.191 22.216);
  
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.439 0 0);
}
```

### Adding Custom Colors

```css
:root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}

.dark {
  --warning: oklch(0.41 0.11 46);
  --warning-foreground: oklch(0.99 0.02 95);
}

@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

Usage:
```tsx
<div className="bg-warning text-warning-foreground">Warning!</div>
```

---

## 📚 Available Components

### Core Components (60+)

| Category | Components |
|----------|------------|
| **Layout** | Accordion, Aspect Ratio, Card, Collapsible, Resizable, Separator, Sidebar |
| **Navigation** | Breadcrumb, Navigation Menu, Pagination, Tabs |
| **Forms** | Button, Button Group, Checkbox, Field, Form, Input, Input Group, Input OTP, Label, Native Select, Radio Group, Select, Slider, Switch, Textarea |
| **Feedback** | Alert, Alert Dialog, Dialog, Drawer, Progress, Sheet, Skeleton, Sonner, Spinner, Toast, Tooltip |
| **Data Display** | Avatar, Badge, Calendar, Carousel, Chart, Data Table, Date Picker, Empty, Hover Card, Item, Kbd, Popover, Scroll Area, Table, Typography |
| **Overlay** | Command, Combobox, Context Menu, Dropdown Menu, Menubar, Toggle, Toggle Group |

### Quick Add (Common Components)

```bash
# Essential UI
npx shadcn@latest add button card dialog dropdown-menu

# Forms
npx shadcn@latest add form input label select checkbox

# Navigation
npx shadcn@latest add tabs navigation-menu breadcrumb sidebar

# Feedback
npx shadcn@latest add toast alert progress skeleton spinner

# Data Display
npx shadcn@latest add table calendar avatar badge

# ALL components
npx shadcn@latest add -a
```

---

## 🗂️ Project-Specific Setup

### For E-Paper Viewer

Since your project already has:
- ✅ Next.js 14
- ✅ TypeScript
- ✅ Zustand (state management)
- ❌ No Tailwind CSS (using CSS Modules)

**Recommended Migration Path:**

```bash
# Step 1: Install Tailwind CSS v4
npm install tailwindcss @tailwindcss/postcss postcss

# Step 2: Create postcss.config.mjs
# (see Tailwind CSS v4 Setup section above)

# Step 3: Update globals.css
# Add: @import "tailwindcss"; at the top

# Step 4: Initialize shadcn/ui
npx shadcn@latest init

# Step 5: Add components for your needs
npx shadcn@latest add button slider calendar dialog dropdown-menu tabs tooltip sidebar card progress skeleton

# Step 6: Add dark mode support
npm install next-themes
# Create theme-provider.tsx (see Dark Mode section)
```

### Components Perfect for E-Paper Viewer

| Component | Use Case |
|-----------|----------|
| `Button` | Navigation controls, zoom buttons |
| `Slider` | Zoom level, flip speed controls |
| `Calendar` | Archive date picker |
| `Dialog` | Settings modal |
| `Dropdown Menu` | Edition/section selector |
| `Tabs` | Section navigation |
| `Tooltip` | Keyboard shortcut hints |
| `Sidebar` | Thumbnails panel |
| `Card` | Edition cards in archive |
| `Progress` | Page loading indicator |
| `Skeleton` | Loading states |
| `Kbd` | Display keyboard shortcuts |

---

## ✅ Best Practices

### 1. Component Organization

```
src/
├── components/
│   ├── ui/              # shadcn components (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── layout/          # Your custom layout components
│   │   └── header.tsx
│   └── viewer/          # Feature-specific components
│       └── page-flip.tsx
```

### 2. Using the `cn()` Utility

```tsx
import { cn } from "@/lib/utils"

// Merge classes conditionally
<Button className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "ghost" && "ghost-classes"
)}>
  Click me
</Button>
```

### 3. Customizing Components

Since components are copied to your project, you can:

```tsx
// components/ui/button.tsx
// Edit directly to customize variants, sizes, etc.

const buttonVariants = cva(
  "base-styles...",
  {
    variants: {
      variant: {
        default: "...",
        custom: "your-custom-variant-styles", // Add custom variants
      },
      size: {
        xl: "h-14 px-8 text-lg", // Add custom sizes
      }
    }
  }
)
```

### 4. Keeping Components Updated

```bash
# Check for updates
npx shadcn@latest add button -o  # Overwrite with latest

# Or manually check:
# 1. View latest: npx shadcn@latest view button
# 2. Compare with your version
# 3. Merge changes manually
```

---

## 🔗 Resources

- **Official Docs**: [ui.shadcn.com/docs](https://ui.shadcn.com/docs)
- **Component Examples**: [ui.shadcn.com/examples](https://ui.shadcn.com/examples)
- **GitHub**: [github.com/shadcn-ui/ui](https://github.com/shadcn-ui/ui)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Happy Building! 🚀**
