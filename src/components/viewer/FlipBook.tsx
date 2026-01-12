"use client"

import { forwardRef, useCallback, useRef, useImperativeHandle, useState, useEffect } from "react"
import HTMLFlipBook from "react-pageflip"
import type { Page } from "@/types"
import { cn } from "@/lib/utils"

// Page component for the flip book
interface PageProps {
  page: Page
  isFirst?: boolean
  isLast?: boolean
}

const FlipPage = forwardRef<HTMLDivElement, PageProps>(
  ({ page, isFirst, isLast }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "page-content relative h-full w-full overflow-hidden",
          "select-none", // Prevent text selection during flip
          isFirst || isLast ? "bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900" : "bg-white"
        )}
        data-density={isFirst || isLast ? "hard" : "soft"}
      >
        {isFirst ? (
          // Cover page - minimal, elegant
          <div className="flex h-full w-full flex-col items-center justify-center p-8">
            <div className="text-center space-y-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-stone-300 to-stone-400 dark:from-stone-600 dark:to-stone-700" />
              <h1 className="text-2xl font-light tracking-widest uppercase text-stone-700 dark:text-stone-300">
                E-Paper
              </h1>
              <p className="text-xs text-stone-500 dark:text-stone-400 tracking-wide">
                Swipe to read
              </p>
            </div>
          </div>
        ) : isLast ? (
          // Back cover
          <div className="flex h-full w-full flex-col items-center justify-center p-8">
            <div className="text-center space-y-4">
              <p className="text-sm text-stone-500 dark:text-stone-400 font-light">
                End of Edition
              </p>
            </div>
          </div>
        ) : (
          // Content page with subtle paper texture effect
          <div className="relative h-full w-full">
            {/* Paper texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/[0.02] via-transparent to-black/[0.02] pointer-events-none" />

            <img
              src={page.imageUrl}
              alt={`Page ${page.pageNumber}`}
              className="h-full w-full object-contain"
              draggable={false}
            />

            {/* Subtle page number */}
            <div className="absolute bottom-3 right-3 text-[10px] font-light text-stone-400 tabular-nums">
              {page.pageNumber}
            </div>

            {/* Inner shadow for depth */}
            <div className="absolute inset-0 shadow-inner pointer-events-none opacity-30" />
          </div>
        )}
      </div>
    )
  }
)

FlipPage.displayName = "FlipPage"

// FlipBook component props
interface FlipBookProps {
  pages: Page[]
  currentPage?: number
  onPageChange?: (page: number) => void
  onInit?: () => void
  className?: string
  flipDuration?: number
}

export interface FlipBookRef {
  flipNext: () => void
  flipPrev: () => void
  turnToPage: (page: number) => void
  getCurrentPage: () => number
}

export const FlipBook = forwardRef<FlipBookRef, FlipBookProps>(
  (
    {
      pages,
      currentPage = 0,
      onPageChange,
      onInit,
      className,
      flipDuration = 1200, // Slower, more elegant like Apple Books
    },
    ref
  ) => {
    const bookRef = useRef<any>(null)
    const [dimensions, setDimensions] = useState({ width: 500, height: 700 })

    // Calculate dimensions on mount and resize
    useEffect(() => {
      const updateDimensions = () => {
        const isMobile = window.innerWidth < 768
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024

        let width: number
        let height: number

        if (isMobile) {
          // Full width on mobile, accounting for padding
          width = Math.min(380, window.innerWidth - 32)
          height = Math.round(width * 1.414) // A4 ratio
        } else if (isTablet) {
          width = 450
          height = 636
        } else {
          width = 520
          height = 735
        }

        setDimensions({ width, height })
      }

      updateDimensions()
      window.addEventListener('resize', updateDimensions)
      return () => window.removeEventListener('resize', updateDimensions)
    }, [])

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      flipNext: () => bookRef.current?.pageFlip()?.flipNext(),
      flipPrev: () => bookRef.current?.pageFlip()?.flipPrev(),
      turnToPage: (page: number) => bookRef.current?.pageFlip()?.turnToPage(page),
      getCurrentPage: () => bookRef.current?.pageFlip()?.getCurrentPageIndex() || 0,
    }))

    const handleFlip = useCallback(
      (e: { data: number }) => {
        onPageChange?.(e.data)
      },
      [onPageChange]
    )

    const handleInit = useCallback(() => {
      onInit?.()
    }, [onInit])

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768

    return (
      <div className={cn("flex items-center justify-center", className)}>
        {/* @ts-expect-error - react-pageflip types are incomplete */}
        <HTMLFlipBook
          ref={bookRef}
          width={dimensions.width}
          height={dimensions.height}
          size="stretch"
          minWidth={280}
          maxWidth={600}
          minHeight={400}
          maxHeight={850}

          // Shadow settings for Apple Books-like depth
          maxShadowOpacity={0.15} // Subtle shadow
          drawShadow={true}

          // Animation settings - smooth and elegant
          flippingTime={flipDuration}

          // Interaction settings
          showCover={true}
          mobileScrollSupport={false}
          swipeDistance={30} // Responsive swipe
          clickEventForward={false}
          usePortrait={isMobile}
          startPage={currentPage}
          useMouseEvents={true}
          autoSize={true}

          // Corner peel - enabled for natural book feel
          // Drag from corner = corner peel, drag from edge = side peel
          showPageCorners={true}
          disableFlipByClick={false} // Allow corner click to flip

          onFlip={handleFlip}
          onInit={handleInit}
          className="flip-book-apple"
        >
          {/* Front cover */}
          <FlipPage
            key="cover-front"
            page={{ id: "cover", pageNumber: 0, imageUrl: "" }}
            isFirst
          />

          {/* Content pages */}
          {pages.map((page) => (
            <FlipPage key={page.id} page={page} />
          ))}

          {/* Back cover */}
          <FlipPage
            key="cover-back"
            page={{ id: "back", pageNumber: pages.length + 1, imageUrl: "" }}
            isLast
          />
        </HTMLFlipBook>
      </div>
    )
  }
)

FlipBook.displayName = "FlipBook"
