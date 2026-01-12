"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useViewerStore } from "@/stores/viewer"
import type { Page } from "@/types"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useRef } from "react"

interface ThumbnailsProps {
  pages: Page[]
  onPageSelect: (pageIndex: number) => void
}

export function Thumbnails({ pages, onPageSelect }: ThumbnailsProps) {
  const { currentPage, showThumbnails, toggleThumbnails } = useViewerStore()
  const activeRef = useRef<HTMLButtonElement>(null)

  // Scroll active thumbnail into view
  useEffect(() => {
    if (showThumbnails && activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [currentPage, showThumbnails])

  if (!showThumbnails) return null

  return (
    <div
      className={cn(
        "fixed left-0 top-0 bottom-0 z-50",
        "w-[200px] sm:w-[240px]",
        "bg-background/95 backdrop-blur border-r",
        "flex flex-col",
        "animate-in slide-in-from-left duration-200"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-medium text-sm">Pages</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleThumbnails}
          className="h-7 w-7"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Thumbnails list */}
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-2 gap-2 p-3">
          {pages.map((page, index) => {
            // +1 because of front cover
            const isActive = currentPage === index + 1
            return (
              <button
                key={page.id}
                ref={isActive ? activeRef : null}
                onClick={() => onPageSelect(index + 1)}
                className={cn(
                  "relative aspect-[3/4] rounded overflow-hidden",
                  "border-2 transition-all",
                  "hover:border-primary/50",
                  "focus:outline-none focus:ring-2 focus:ring-ring",
                  isActive
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent"
                )}
              >
                <img
                  src={page.thumbnailUrl || page.imageUrl}
                  alt={`Page ${page.pageNumber}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div
                  className={cn(
                    "absolute bottom-0 left-0 right-0",
                    "bg-gradient-to-t from-black/60 to-transparent",
                    "px-1 py-0.5 text-white text-xs font-mono text-center"
                  )}
                >
                  {page.pageNumber}
                </div>
              </button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
