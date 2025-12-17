"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { PageFlip } from "page-flip"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Layers,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    X,
    RefreshCw,
} from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// =============================================
// TEST PAGE - Simplified, stable implementation
// =============================================

// Hardcoded test images
const TEST_PAGES = [
    { id: "1", pageNumber: 1, imageUrl: "/editions/Edition 26/SA NEWS - V1 - E26 - 01.jpg" },
    { id: "2", pageNumber: 2, imageUrl: "/editions/Edition 26/SA NEWS - V1 - E26 - 02.jpg" },
    { id: "3", pageNumber: 3, imageUrl: "/editions/Edition 26/SA NEWS - V1 - E26 - 03.jpg" },
    { id: "4", pageNumber: 4, imageUrl: "/editions/Edition 26/SA NEWS - V1 - E26 - 04.jpg" },
    { id: "5", pageNumber: 5, imageUrl: "/editions/Edition 26/SA NEWS - V1 - E26 - 05.jpg" },
    { id: "6", pageNumber: 6, imageUrl: "/editions/Edition 26/SA NEWS - V1 - E26 - 06.jpg" },
]

export default function TestPage() {
    // Refs - use refs for PageFlip to avoid re-render issues
    const bookRef = useRef<HTMLDivElement>(null)
    const pageFlipRef = useRef<PageFlip | null>(null)
    const initRef = useRef(false)

    // State
    const [currentPage, setCurrentPage] = useState(0)
    const [showThumbnails, setShowThumbnails] = useState(false)
    const [zoomLevel, setZoomLevel] = useState(1)
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")

    const totalPages = TEST_PAGES.length + 2

    // =============================================
    // INITIALIZE PAGE FLIP - Only once
    // =============================================
    useEffect(() => {
        // Prevent double initialization (React StrictMode)
        if (initRef.current) return
        if (!bookRef.current) return

        initRef.current = true

        const initPageFlip = () => {
            const container = bookRef.current
            if (!container) {
                setStatus("error")
                return
            }

            const pageElements = container.querySelectorAll(".page-item")
            if (pageElements.length === 0) {
                console.error("No page elements found")
                setStatus("error")
                return
            }

            try {
                console.log(`Initializing PageFlip with ${pageElements.length} pages`)

                const pageFlip = new PageFlip(container, {
                    width: 400,
                    height: 560,
                    size: "stretch",
                    minWidth: 250,
                    maxWidth: 550,
                    minHeight: 350,
                    maxHeight: 770,
                    maxShadowOpacity: 0.5,
                    showCover: true,
                    mobileScrollSupport: false,
                    swipeDistance: 30,
                    clickEventForward: true,
                    usePortrait: false,
                    startPage: 0,
                    drawShadow: true,
                    flippingTime: 600,
                    useMouseEvents: true,
                    autoSize: true,
                    showPageCorners: true,
                    disableFlipByClick: false,
                })

                pageFlip.loadFromHTML(pageElements)

                pageFlip.on("flip", (e: { data: number }) => {
                    setCurrentPage(e.data)
                })

                pageFlipRef.current = pageFlip
                setStatus("ready")
                console.log("PageFlip ready!")
            } catch (err) {
                console.error("PageFlip error:", err)
                setStatus("error")
            }
        }

        // Small delay to ensure DOM is ready
        const timer = setTimeout(initPageFlip, 500)

        // Cleanup only on unmount
        return () => {
            clearTimeout(timer)
        }
    }, [])

    // Cleanup on unmount only
    useEffect(() => {
        return () => {
            if (pageFlipRef.current) {
                try {
                    pageFlipRef.current.destroy()
                } catch (e) {
                    // Ignore
                }
                pageFlipRef.current = null
                initRef.current = false
            }
        }
    }, [])

    // =============================================
    // NAVIGATION
    // =============================================
    const flipNext = useCallback(() => {
        pageFlipRef.current?.flipNext()
    }, [])

    const flipPrev = useCallback(() => {
        pageFlipRef.current?.flipPrev()
    }, [])

    const goToPage = useCallback((index: number) => {
        pageFlipRef.current?.turnToPage(index)
    }, [])

    const handleRetry = useCallback(() => {
        window.location.reload()
    }, [])

    // Zoom
    const zoomIn = () => setZoomLevel((z) => Math.min(z + 0.2, 2))
    const zoomOut = () => setZoomLevel((z) => Math.max(z - 0.2, 0.5))
    const resetZoom = () => setZoomLevel(1)

    // Keyboard
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement) return

            switch (e.key) {
                case "ArrowRight":
                case " ":
                    e.preventDefault()
                    flipNext()
                    break
                case "ArrowLeft":
                    e.preventDefault()
                    flipPrev()
                    break
                case "Home":
                    e.preventDefault()
                    goToPage(0)
                    break
                case "End":
                    e.preventDefault()
                    goToPage(totalPages - 1)
                    break
                case "t":
                case "T":
                    e.preventDefault()
                    setShowThumbnails((p) => !p)
                    break
                case "Escape":
                    setShowThumbnails(false)
                    break
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [flipNext, flipPrev, goToPage, totalPages])

    // =============================================
    // RENDER
    // =============================================
    return (
        <div className="flex min-h-screen flex-col bg-zinc-100 dark:bg-zinc-900">
            <Header date="2024-12-09" publication="SA NEWS - Test" />

            <TooltipProvider delayDuration={200}>
                <main className="relative flex flex-1 overflow-hidden">

                    {/* Main Book Area */}
                    <div
                        className="flex flex-1 items-center justify-center p-4"
                        style={{
                            transform: `scale(${zoomLevel})`,
                            transformOrigin: "center center",
                        }}
                    >
                        {/* THE BOOK */}
                        <div
                            ref={bookRef}
                            className="book-container"
                        >
                            {/* Cover Page */}
                            <div className="page-item page-cover" data-density="hard">
                                <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-900 text-white p-6">
                                    <h1 className="text-2xl font-bold mb-2">SA NEWS</h1>
                                    <div className="w-12 h-0.5 bg-white/40 my-3" />
                                    <p className="text-sm opacity-70">Edition 26</p>
                                    <p className="text-xs opacity-40 mt-8">Click to read →</p>
                                </div>
                            </div>

                            {/* Content Pages */}
                            {TEST_PAGES.map((page) => (
                                <div
                                    key={page.id}
                                    className="page-item page-content"
                                    data-density="soft"
                                >
                                    <div className="h-full w-full bg-white relative">
                                        <img
                                            src={page.imageUrl}
                                            alt={`Page ${page.pageNumber}`}
                                            className="h-full w-full object-contain"
                                            draggable={false}
                                        />
                                        <span className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-0.5 text-xs font-mono rounded">
                                            {page.pageNumber}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {/* Back Cover */}
                            <div className="page-item page-cover" data-density="hard">
                                <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-900 text-white p-6">
                                    <h1 className="text-xl font-bold">End</h1>
                                    <div className="w-12 h-0.5 bg-white/40 my-3" />
                                    <p className="text-sm opacity-70">Thank you</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Zoom Controls - Fixed Position */}
                    <div className="fixed right-4 top-20 z-50">
                        <div className="flex flex-col gap-1 bg-white dark:bg-zinc-800 border shadow-lg p-1 rounded-lg">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={zoomIn} className="h-9 w-9">
                                        <ZoomIn className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">Zoom In</TooltipContent>
                            </Tooltip>

                            <div className="text-[10px] text-center font-mono text-muted-foreground py-1">
                                {Math.round(zoomLevel * 100)}%
                            </div>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={zoomOut} className="h-9 w-9">
                                        <ZoomOut className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">Zoom Out</TooltipContent>
                            </Tooltip>

                            <div className="h-px bg-border my-1" />

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={resetZoom} className="h-9 w-9">
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">Reset</TooltipContent>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Bottom Navigation Bar */}
                    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-800 border-t shadow-lg">
                        <div className="flex h-14 items-center justify-between px-4 max-w-4xl mx-auto">
                            {/* Left: Thumbnails */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={showThumbnails ? "default" : "ghost"}
                                        size="icon"
                                        onClick={() => setShowThumbnails(!showThumbnails)}
                                    >
                                        <Layers className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Thumbnails (T)</TooltipContent>
                            </Tooltip>

                            {/* Center: Navigation */}
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" onClick={() => goToPage(0)} disabled={currentPage === 0}>
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={flipPrev} disabled={currentPage === 0}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                <span className="mx-3 text-sm font-mono min-w-[60px] text-center">
                                    {currentPage + 1} / {totalPages}
                                </span>

                                <Button variant="ghost" size="icon" onClick={flipNext} disabled={currentPage >= totalPages - 1}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => goToPage(totalPages - 1)} disabled={currentPage >= totalPages - 1}>
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Right: Status */}
                            <div className="flex items-center gap-2">
                                {status === "error" && (
                                    <Button variant="outline" size="sm" onClick={handleRetry} className="gap-1">
                                        <RefreshCw className="h-3 w-3" />
                                        Retry
                                    </Button>
                                )}
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "h-2 w-2 rounded-full",
                                        status === "ready" ? "bg-green-500" :
                                            status === "error" ? "bg-red-500" :
                                                "bg-yellow-500 animate-pulse"
                                    )} />
                                    <span className="text-xs text-muted-foreground capitalize hidden sm:inline">
                                        {status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thumbnails Panel */}
                    {showThumbnails && (
                        <div className="fixed right-0 top-14 bottom-14 w-56 bg-white dark:bg-zinc-800 border-l shadow-xl z-40 flex flex-col">
                            <div className="flex h-10 items-center justify-between px-3 border-b">
                                <span className="text-xs font-semibold uppercase text-muted-foreground">
                                    Pages
                                </span>
                                <Button variant="ghost" size="icon" onClick={() => setShowThumbnails(false)} className="h-7 w-7">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <ScrollArea className="flex-1">
                                <div className="grid grid-cols-2 gap-2 p-2">
                                    {TEST_PAGES.map((page, idx) => {
                                        const pageIdx = idx + 1
                                        const isActive = currentPage === pageIdx
                                        return (
                                            <button
                                                key={page.id}
                                                onClick={() => goToPage(pageIdx)}
                                                className={cn(
                                                    "aspect-[3/4] border-2 rounded overflow-hidden transition-all hover:scale-105",
                                                    isActive ? "border-blue-500 ring-2 ring-blue-500/50" : "border-gray-200 dark:border-gray-700"
                                                )}
                                            >
                                                <img
                                                    src={page.imageUrl}
                                                    alt={`Page ${page.pageNumber}`}
                                                    className="h-full w-full object-cover"
                                                    loading="lazy"
                                                />
                                            </button>
                                        )
                                    })}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </main>
            </TooltipProvider>
        </div>
    )
}
