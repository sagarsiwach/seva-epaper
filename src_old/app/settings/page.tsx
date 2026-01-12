"use client"

import { Header } from "@/components/layout/Header"
import { useViewerStore } from "@/stores/viewer-store"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTheme } from "next-themes"
import {
  Sun,
  Moon,
  Monitor,
  Keyboard,
  Info,
  ExternalLink,
  RotateCcw,
} from "lucide-react"
import Link from "next/link"

// =============================================
// SETTINGS PAGE - Updated for new store
// =============================================

const shortcuts = [
  { key: "→", description: "Next page" },
  { key: "←", description: "Previous page" },
  { key: "Home", description: "First page" },
  { key: "End", description: "Last page" },
  { key: "T", description: "Toggle thumbnails" },
  { key: "Esc", description: "Close panels" },
  { key: "Space", description: "Next page" },
]

export default function SettingsPage() {
  const { autoFlip, setAutoFlip, flipSpeed, setFlipSpeed, showThumbnails, setShowThumbnails, reset } =
    useViewerStore()

  const { theme, setTheme } = useTheme()
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-background">
      <Header date={today} publication="E-Paper" />

      <main className="container mx-auto max-w-2xl p-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            className="gap-2 rounded-none"
          >
            <RotateCcw className="h-4 w-4" />
            Reset All
          </Button>
        </div>

        {/* Appearance */}
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-base">Appearance</CardTitle>
            <CardDescription className="font-mono text-xs">
              Customize how the app looks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Selection */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-xs text-muted-foreground font-mono">
                  Choose your preferred color scheme
                </p>
              </div>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-32 rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Show Thumbnails */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Thumbnails by Default</Label>
                <p className="text-xs text-muted-foreground font-mono">
                  Display page thumbnails when opening viewer
                </p>
              </div>
              <Switch
                checked={showThumbnails}
                onCheckedChange={setShowThumbnails}
              />
            </div>
          </CardContent>
        </Card>

        {/* Reading */}
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-base">Reading</CardTitle>
            <CardDescription className="font-mono text-xs">
              Configure reading behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Auto Flip */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Flip Pages</Label>
                <p className="text-xs text-muted-foreground font-mono">
                  Automatically flip pages after a delay
                </p>
              </div>
              <Switch checked={autoFlip} onCheckedChange={setAutoFlip} />
            </div>

            <Separator />

            {/* Flip Speed */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Page Flip Animation Speed</Label>
                  <p className="text-xs text-muted-foreground font-mono">
                    How fast pages turn (milliseconds)
                  </p>
                </div>
                <Badge variant="secondary" className="rounded-none font-mono">
                  {flipSpeed}ms
                </Badge>
              </div>
              <Slider
                value={[flipSpeed]}
                onValueChange={(value) => setFlipSpeed(value[0])}
                min={300}
                max={2000}
                step={100}
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>300ms (Fast)</span>
                <span>2000ms (Slow)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card className="rounded-none">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Keyboard className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Keyboard Shortcuts</CardTitle>
            </div>
            <CardDescription className="font-mono text-xs">
              Quick navigation commands
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {shortcuts.map((shortcut) => (
                <div
                  key={shortcut.key}
                  className="flex items-center justify-between gap-4 py-1.5 border-b border-dashed border-border last:border-0"
                >
                  <kbd className="inline-flex h-6 min-w-[2rem] items-center justify-center bg-muted px-2 font-mono text-xs font-medium">
                    {shortcut.key}
                  </kbd>
                  <span className="text-xs text-muted-foreground font-mono">
                    {shortcut.description}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="rounded-none">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">About</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">E-Paper Viewer</span>
                <Badge variant="outline" className="rounded-none font-mono">
                  v2.0.0
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                A modern digital newspaper reading experience with realistic
                page-flip animations.
              </p>
            </div>
            <Separator />
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="gap-2 rounded-none"
              >
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3" />
                  GitHub
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
