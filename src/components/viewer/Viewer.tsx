"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { FlipBook, type FlipBookRef } from "./FlipBook"
import { Controls } from "./Controls"
import { Thumbnails } from "./Thumbnails"
import { useViewerStore } from "@/stores/viewer"
import type { Page } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ViewerProps {
  pages: Page[]
  title?: string
}

export function Viewer({ pages, title: _title }: ViewerProps) {
  const flipBookRef = useRef<FlipBookRef>(null)
  const [isReady, setIsReady] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  const {
    setPage,
    setTotalPages,
    setLoading,
    zoom,
    showThumbnails,
    preferences,
  } = useViewerStore()

  // Preload images
  useEffect(() => {
    if (pages.length === 0) {
      setImagesLoaded(true)
      setLoading(false)
      return
    }

    let loaded = 0
    const total = Math.min(pages.length, 5) // Preload first 5

    const loadImage = (src: string) => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = img.onerror = () => {
          loaded++
          if (loaded >= total) {
            setImagesLoaded(true)
            setLoading(false)
          }
          resolve()
        }
        img.src = src
      })
    }

    pages.slice(0, 5).forEach((p) => loadImage(p.imageUrl))

    // Fallback timeout
    const timeout = setTimeout(() => {
      setImagesLoaded(true)
      setLoading(false)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [pages, setLoading])

  // Set total pages (pages + 2 covers)
  useEffect(() => {
    setTotalPages(pages.length + 2)
  }, [pages.length, setTotalPages])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault()
          flipBookRef.current?.flipNext()
          break
        case "ArrowLeft":
          e.preventDefault()
          flipBookRef.current?.flipPrev()
          break
        case "Home":
          e.preventDefault()
          flipBookRef.current?.turnToPage(0)
          break
        case "End":
          e.preventDefault()
          flipBookRef.current?.turnToPage(pages.length + 1)
          break
        case "t":
        case "T":
          e.preventDefault()
          useViewerStore.getState().toggleThumbnails()
          break
        case "Escape":
          e.preventDefault()
          if (showThumbnails) {
            useViewerStore.getState().toggleThumbnails()
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [pages.length, showThumbnails])

  // Navigation handlers
  const handleNext = useCallback(() => {
    flipBookRef.current?.flipNext()
  }, [])

  const handlePrev = useCallback(() => {
    flipBookRef.current?.flipPrev()
  }, [])

  const handleFirst = useCallback(() => {
    flipBookRef.current?.turnToPage(0)
  }, [])

  const handleLast = useCallback(() => {
    flipBookRef.current?.turnToPage(pages.length + 1)
  }, [pages.length])

  const handleGoToPage = useCallback((page: number) => {
    flipBookRef.current?.turnToPage(page)
  }, [])

  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page)
    },
    [setPage]
  )

  const handleInit = useCallback(() => {
    setIsReady(true)
  }, [])

  return (
    <div className="relative flex flex-col h-[100dvh] overflow-hidden bg-muted/30">
      {/* Loading overlay */}
      {!imagesLoaded && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-48 w-32" />
              <Skeleton className="h-48 w-32" />
            </div>
            <p className="text-sm font-mono text-muted-foreground animate-pulse">
              Loading pages...
            </p>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div
        className={cn(
          "flex-1 flex items-center justify-center p-4 pb-20",
          "transition-transform duration-200 ease-out",
          showThumbnails && "sm:ml-[240px]"
        )}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        <FlipBook
          ref={flipBookRef}
          pages={pages}
          onPageChange={handlePageChange}
          onInit={handleInit}
          flipDuration={preferences.flipDuration}
          className={cn(
            "transition-opacity duration-300",
            !isReady && "opacity-0"
          )}
        />
      </div>

      {/* Thumbnails sidebar */}
      <Thumbnails pages={pages} onPageSelect={handleGoToPage} />

      {/* Bottom controls */}
      <Controls
        onNext={handleNext}
        onPrev={handlePrev}
        onFirst={handleFirst}
        onLast={handleLast}
        onGoToPage={handleGoToPage}
      />
    </div>
  )
}
