"use client"

import { useViewerStore } from "@/stores/viewer"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Grid3X3,
  Maximize2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ControlsProps {
  onNext: () => void
  onPrev: () => void
  onFirst: () => void
  onLast: () => void
  onGoToPage: (page: number) => void
  className?: string
}

export function Controls({
  onNext,
  onPrev,
  onFirst,
  onLast,
  className,
}: ControlsProps) {
  const {
    currentPage,
    totalPages,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleThumbnails,
    showThumbnails,
  } = useViewerStore()

  return (
    <TooltipProvider delayDuration={300}>
      {/* Bottom Navigation Bar */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40",
          "flex items-center justify-between gap-2 px-4 py-3",
          "bg-background/95 backdrop-blur border-t",
          "safe-area-pb",
          className
        )}
      >
        {/* Left: Thumbnails toggle */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showThumbnails ? "secondary" : "ghost"}
                size="icon"
                onClick={toggleThumbnails}
                className="h-9 w-9"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Toggle thumbnails (T)</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Center: Page Navigation */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onFirst}
                disabled={currentPage === 0}
                className="h-9 w-9 hidden sm:flex"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>First page (Home)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onPrev}
                disabled={currentPage === 0}
                className="h-9 w-9"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Previous (←)</p>
            </TooltipContent>
          </Tooltip>

          {/* Page indicator */}
          <div className="flex items-center gap-2 px-3 min-w-[100px] justify-center">
            <span className="font-mono text-sm">
              {currentPage + 1} / {totalPages}
            </span>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
                disabled={currentPage >= totalPages - 1}
                className="h-9 w-9"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Next (→)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onLast}
                disabled={currentPage >= totalPages - 1}
                className="h-9 w-9 hidden sm:flex"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Last page (End)</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Right: Zoom Controls */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={zoomOut}
                disabled={zoom <= 0.5}
                className="h-9 w-9 hidden sm:flex"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Zoom out</p>
            </TooltipContent>
          </Tooltip>

          <div className="hidden md:flex items-center gap-2 px-2">
            <Slider
              value={[zoom]}
              onValueChange={([v]) => useViewerStore.getState().setZoom(v)}
              min={0.5}
              max={2}
              step={0.1}
              className="w-24"
            />
            <span className="font-mono text-xs w-10 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={zoomIn}
                disabled={zoom >= 3}
                className="h-9 w-9 hidden sm:flex"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Zoom in</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetZoom}
                className="h-9 w-9"
              >
                {zoom === 1 ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <RotateCcw className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Reset zoom</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
