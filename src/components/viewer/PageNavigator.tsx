"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useViewerStore } from "@/stores/viewer-store"

// =============================================
// PAGE NAVIGATOR - Complete Rewrite
// Clean navigation bar
// =============================================

interface PageNavigatorProps {
  onFlipNext: () => void
  onFlipPrev: () => void
  onGoToPage: (page: number) => void
  totalPages: number
}

export function PageNavigator({
  onFlipNext,
  onFlipPrev,
  onGoToPage,
  totalPages,
}: PageNavigatorProps) {
  const { currentPage, showThumbnails, toggleThumbnails } = useViewerStore()

  // Display page is 1-indexed for users
  const displayPage = currentPage + 1
  const [inputValue, setInputValue] = useState(String(displayPage))

  // Sync input with current page
  useEffect(() => {
    setInputValue(String(displayPage))
  }, [displayPage])

  // Handle page input submission
  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const pageNum = parseInt(inputValue)
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onGoToPage(pageNum - 1) // Convert to 0-indexed
    } else {
      setInputValue(String(displayPage))
    }
  }

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const pageIndex = value[0] - 1 // Convert to 0-indexed
    onGoToPage(pageIndex)
  }

  const canGoPrev = currentPage > 0
  const canGoNext = currentPage < totalPages - 1

  return (
    <TooltipProvider delayDuration={300}>
      <div className="absolute bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between gap-4 px-4">
          {/* Thumbnails Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showThumbnails ? "secondary" : "ghost"}
                size="icon"
                onClick={toggleThumbnails}
                className="shrink-0"
              >
                <Layers className="h-4 w-4" />
                <span className="sr-only">Toggle Thumbnails</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Thumbnails (T)</p>
            </TooltipContent>
          </Tooltip>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1">
            {/* First Page */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onGoToPage(0)}
                  disabled={!canGoPrev}
                >
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="sr-only">First Page</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>First (Home)</p>
              </TooltipContent>
            </Tooltip>

            {/* Previous Page */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onFlipPrev}
                  disabled={!canGoPrev}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous Page</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Previous (←)</p>
              </TooltipContent>
            </Tooltip>

            {/* Page Input */}
            <form
              onSubmit={handleInputSubmit}
              className="flex items-center gap-2"
            >
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="h-8 w-14 text-center font-mono text-sm rounded-none"
                min={1}
                max={totalPages}
              />
              <span className="text-sm text-muted-foreground font-mono">
                / {totalPages}
              </span>
            </form>

            {/* Next Page */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onFlipNext}
                  disabled={!canGoNext}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next Page</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Next (→)</p>
              </TooltipContent>
            </Tooltip>

            {/* Last Page */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onGoToPage(totalPages - 1)}
                  disabled={!canGoNext}
                >
                  <ChevronsRight className="h-4 w-4" />
                  <span className="sr-only">Last Page</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Last (End)</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Page Slider (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-md items-center gap-4">
            <Slider
              value={[displayPage]}
              onValueChange={handleSliderChange}
              min={1}
              max={totalPages}
              step={1}
              className="flex-1"
            />
          </div>

          {/* Spacer for balance */}
          <div className="w-10 shrink-0 hidden md:block" />
        </div>
      </div>
    </TooltipProvider>
  )
}
