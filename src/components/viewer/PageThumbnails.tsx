"use client"

import { useRef, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useViewerStore } from "@/stores/viewer-store"
import { Page } from "@/types/edition"
import { cn } from "@/lib/utils"

// =============================================
// PAGE THUMBNAILS - Complete Rewrite
// Clean thumbnail sidebar
// =============================================

interface PageThumbnailsProps {
    pages: Page[]
    onPageSelect: (pageIndex: number) => void
}

export function PageThumbnails({ pages, onPageSelect }: PageThumbnailsProps) {
    const { currentPage, setShowThumbnails } = useViewerStore()
    const activeRef = useRef<HTMLButtonElement>(null)

    // Auto-scroll to active thumbnail
    useEffect(() => {
        if (activeRef.current) {
            activeRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            })
        }
    }, [currentPage])

    // Current page index in the pages array (subtract 1 for cover)
    const activePageIndex = currentPage - 1

    return (
        <div className="absolute right-0 top-0 bottom-14 z-30 w-48 border-l border-border bg-card/95 backdrop-blur-sm flex flex-col">
            {/* Header */}
            <div className="flex h-10 items-center justify-between border-b border-border px-3 shrink-0">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Pages ({pages.length})
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowThumbnails(false)}
                    className="h-6 w-6"
                >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Close Thumbnails</span>
                </Button>
            </div>

            {/* Thumbnails Grid */}
            <ScrollArea className="flex-1">
                <div className="grid grid-cols-2 gap-2 p-2">
                    {pages.map((page, index) => {
                        const isActive = activePageIndex === index

                        return (
                            <button
                                key={page.id}
                                ref={isActive ? activeRef : null}
                                onClick={() => onPageSelect(index)}
                                className={cn(
                                    "group relative aspect-[3/4] overflow-hidden border transition-all",
                                    "hover:border-primary hover:shadow-md",
                                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                                    isActive
                                        ? "border-primary ring-2 ring-primary ring-offset-1"
                                        : "border-border"
                                )}
                            >
                                {/* Thumbnail Image */}
                                <img
                                    src={page.thumbnailUrl || page.imageUrl}
                                    alt={`Page ${page.pageNumber}`}
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                    draggable={false}
                                />

                                {/* Page Number Overlay */}
                                <div
                                    className={cn(
                                        "absolute inset-x-0 bottom-0 flex items-center justify-center py-0.5 text-[10px] font-mono font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-background/80 text-foreground backdrop-blur-sm"
                                    )}
                                >
                                    {page.pageNumber}
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
                            </button>
                        )
                    })}
                </div>
            </ScrollArea>

            {/* Footer */}
            <div className="flex h-8 items-center justify-center border-t border-border shrink-0">
                <span className="text-[10px] font-mono text-muted-foreground">
                    {activePageIndex >= 0 && activePageIndex < pages.length
                        ? `Page ${activePageIndex + 1} of ${pages.length}`
                        : `${pages.length} pages`}
                </span>
            </div>
        </div>
    )
}
