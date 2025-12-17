"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { PageFlip } from "page-flip"
import { useViewerStore } from "@/stores/viewer-store"
import { Page } from "@/types/edition"
import { ZoomControls } from "./ZoomControls"
import { PageNavigator } from "./PageNavigator"
import { PageThumbnails } from "./PageThumbnails"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// =============================================
// PAGE FLIP VIEWER - Complete Rewrite
// Clean, working implementation
// =============================================

interface PageFlipViewerProps {
    pages: Page[]
    sectionId: string
}

export function PageFlipViewer({ pages, sectionId: _sectionId }: PageFlipViewerProps) {
    // Refs
    const containerRef = useRef<HTMLDivElement>(null)
    const bookRef = useRef<HTMLDivElement>(null)
    const pageFlipRef = useRef<PageFlip | null>(null)

    // Local state
    const [isReady, setIsReady] = useState(false)
    const [imagesLoaded, setImagesLoaded] = useState(false)

    // Store
    const {
        setCurrentPage,
        setTotalPages,
        showThumbnails,
        setShowThumbnails,
        zoomLevel,
        flipSpeed,
        setLoading,
    } = useViewerStore()

    // Total pages including covers
    const totalPagesWithCovers = pages.length + 2

    // =============================================
    // PRELOAD IMAGES
    // =============================================
    useEffect(() => {
        if (pages.length === 0) {
            setImagesLoaded(true)
            setLoading(false)
            return
        }

        let loadedCount = 0
        const totalImages = pages.length

        const loadImage = (src: string) => {
            return new Promise<void>((resolve) => {
                const img = new Image()
                img.onload = () => {
                    loadedCount++
                    if (loadedCount >= totalImages) {
                        setImagesLoaded(true)
                        setLoading(false)
                    }
                    resolve()
                }
                img.onerror = () => {
                    loadedCount++
                    if (loadedCount >= totalImages) {
                        setImagesLoaded(true)
                        setLoading(false)
                    }
                    resolve()
                }
                img.src = src
            })
        }

        // Load first 3 images immediately, rest lazily
        const priorityImages = pages.slice(0, 3)
        const otherImages = pages.slice(3)

        Promise.all(priorityImages.map((p) => loadImage(p.imageUrl))).then(() => {
            // Start loading other images in background
            otherImages.forEach((p) => loadImage(p.imageUrl))
        })

        // Set timeout fallback
        const timeout = setTimeout(() => {
            setImagesLoaded(true)
            setLoading(false)
        }, 3000)

        return () => clearTimeout(timeout)
    }, [pages, setLoading])

    // =============================================
    // INITIALIZE PAGE FLIP
    // =============================================
    useEffect(() => {
        if (!bookRef.current || !imagesLoaded || isReady) return

        // Wait for DOM to be ready
        const initTimeout = setTimeout(() => {
            try {
                const pageElements = bookRef.current?.querySelectorAll(".page-item")
                if (!pageElements || pageElements.length === 0) return

                const isMobile = window.innerWidth < 768

                const pageFlip = new PageFlip(bookRef.current!, {
                    width: isMobile ? 350 : 500,
                    height: isMobile ? 500 : 700,
                    size: "stretch",
                    minWidth: 280,
                    maxWidth: 800,
                    minHeight: 400,
                    maxHeight: 1100,
                    maxShadowOpacity: 0.3,
                    showCover: true,
                    mobileScrollSupport: false,
                    swipeDistance: 50,
                    clickEventForward: true,
                    usePortrait: isMobile,
                    startPage: 0,
                    drawShadow: true,
                    flippingTime: flipSpeed,
                    useMouseEvents: true,
                    autoSize: true,
                    showPageCorners: true,
                    disableFlipByClick: false,
                })

                pageFlip.loadFromHTML(pageElements)

                // Handle page flip events
                pageFlip.on("flip", (e: { data: number }) => {
                    setCurrentPage(e.data)
                })

                pageFlipRef.current = pageFlip
                setTotalPages(totalPagesWithCovers)
                setCurrentPage(0)
                setIsReady(true)
            } catch (error) {
                console.error("PageFlip initialization error:", error)
                setIsReady(true) // Still show content even if flip fails
            }
        }, 100)

        return () => {
            clearTimeout(initTimeout)
            if (pageFlipRef.current) {
                try {
                    pageFlipRef.current.destroy()
                } catch (e) {
                    // Ignore destroy errors
                }
                pageFlipRef.current = null
            }
        }
    }, [
        imagesLoaded,
        isReady,
        flipSpeed,
        setCurrentPage,
        setTotalPages,
        totalPagesWithCovers,
    ])

    // =============================================
    // NAVIGATION HANDLERS
    // =============================================
    const handleFlipNext = useCallback(() => {
        pageFlipRef.current?.flipNext()
    }, [])

    const handleFlipPrev = useCallback(() => {
        pageFlipRef.current?.flipPrev()
    }, [])

    const handleGoToPage = useCallback((pageIndex: number) => {
        pageFlipRef.current?.turnToPage(pageIndex)
    }, [])

    // =============================================
    // KEYBOARD SHORTCUTS
    // =============================================
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in input
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
                    handleFlipNext()
                    break
                case "ArrowLeft":
                    e.preventDefault()
                    handleFlipPrev()
                    break
                case "Home":
                    e.preventDefault()
                    handleGoToPage(0)
                    break
                case "End":
                    e.preventDefault()
                    handleGoToPage(totalPagesWithCovers - 1)
                    break
                case "t":
                case "T":
                    e.preventDefault()
                    setShowThumbnails(!showThumbnails)
                    break
                case "Escape":
                    e.preventDefault()
                    setShowThumbnails(false)
                    break
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [
        handleFlipNext,
        handleFlipPrev,
        handleGoToPage,
        showThumbnails,
        setShowThumbnails,
        totalPagesWithCovers,
    ])

    // =============================================
    // RENDER
    // =============================================
    return (
        <div
            ref={containerRef}
            className="relative flex h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-muted/30"
        >
            {/* Loading State */}
            {!imagesLoaded && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                        <div className="grid grid-cols-2 gap-3">
                            <Skeleton className="h-52 w-36 rounded-none" />
                            <Skeleton className="h-52 w-36 rounded-none" />
                        </div>
                        <p className="text-sm font-mono text-muted-foreground animate-pulse">
                            Loading pages...
                        </p>
                    </div>
                </div>
            )}

            {/* Book Container */}
            <div
                className="flex flex-1 items-center justify-center p-4 transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
            >
                <div
                    ref={bookRef}
                    className={cn(
                        "relative transition-opacity duration-300",
                        !isReady && "opacity-0"
                    )}
                >
                    {/* Front Cover */}
                    <div className="page-item" data-density="hard">
                        <div className="flex h-full w-full flex-col items-center justify-center bg-card border border-border p-8">
                            <div className="text-center space-y-4">
                                <h1 className="text-2xl font-bold tracking-tight">
                                    E-Paper Edition
                                </h1>
                                <div className="h-px w-16 mx-auto bg-border" />
                                <p className="text-sm text-muted-foreground font-mono">
                                    {pages.length} pages
                                </p>
                                <p className="text-xs text-muted-foreground mt-8">
                                    Click or swipe to turn pages
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Pages */}
                    {pages.map((page, index) => (
                        <div
                            key={page.id}
                            className="page-item"
                            data-density="soft"
                        >
                            <div className="relative h-full w-full bg-white overflow-hidden">
                                <img
                                    src={page.imageUrl}
                                    alt={`Page ${page.pageNumber}`}
                                    className="h-full w-full object-contain"
                                    loading={index < 4 ? "eager" : "lazy"}
                                    draggable={false}
                                />
                                {/* Page Number Badge */}
                                <div className="absolute bottom-2 right-2 bg-background/90 border border-border px-2 py-0.5 text-xs font-mono text-muted-foreground">
                                    {page.pageNumber}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Back Cover */}
                    <div className="page-item" data-density="hard">
                        <div className="flex h-full w-full flex-col items-center justify-center bg-card border border-border p-8">
                            <div className="text-center space-y-4">
                                <h1 className="text-xl font-bold tracking-tight">
                                    End of Edition
                                </h1>
                                <div className="h-px w-16 mx-auto bg-border" />
                                <p className="text-sm text-muted-foreground font-mono">
                                    Thank you for reading
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <ZoomControls />

            <PageNavigator
                onFlipNext={handleFlipNext}
                onFlipPrev={handleFlipPrev}
                onGoToPage={handleGoToPage}
                totalPages={totalPagesWithCovers}
            />

            {/* Thumbnails Sidebar */}
            {showThumbnails && (
                <PageThumbnails
                    pages={pages}
                    onPageSelect={(index) => handleGoToPage(index + 1)} // +1 for cover
                />
            )}
        </div>
    )
}
