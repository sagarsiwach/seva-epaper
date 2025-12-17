"use client"

import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useViewerStore } from "@/stores/viewer-store"

// =============================================
// ZOOM CONTROLS - Complete Rewrite
// Clean zoom functionality
// =============================================

export function ZoomControls() {
  const { zoomLevel, zoomIn, zoomOut, resetZoom } = useViewerStore()

  const zoomPercentage = Math.round(zoomLevel * 100)
  const canZoomIn = zoomLevel < 3
  const canZoomOut = zoomLevel > 0.5

  return (
    <TooltipProvider delayDuration={300}>
      <div className="absolute right-4 top-4 z-40">
        <div className="flex flex-col items-center gap-1 border border-border bg-card/95 p-1.5 shadow-lg backdrop-blur-sm">
          {/* Zoom In */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={zoomIn}
                disabled={!canZoomIn}
                className="h-8 w-8"
              >
                <ZoomIn className="h-4 w-4" />
                <span className="sr-only">Zoom In</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Zoom In (+)</p>
            </TooltipContent>
          </Tooltip>

          {/* Zoom Level Display */}
          <div className="flex h-8 w-8 items-center justify-center">
            <span className="text-[10px] font-mono font-medium text-muted-foreground">
              {zoomPercentage}%
            </span>
          </div>

          {/* Zoom Out */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={zoomOut}
                disabled={!canZoomOut}
                className="h-8 w-8"
              >
                <ZoomOut className="h-4 w-4" />
                <span className="sr-only">Zoom Out</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Zoom Out (-)</p>
            </TooltipContent>
          </Tooltip>

          {/* Divider */}
          <div className="my-1 h-px w-6 bg-border" />

          {/* Reset Zoom */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetZoom}
                disabled={zoomLevel === 1}
                className="h-8 w-8"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">Reset Zoom</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Reset (0)</p>
            </TooltipContent>
          </Tooltip>

          {/* Fit to Screen */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetZoom}
                className="h-8 w-8"
              >
                <Maximize2 className="h-4 w-4" />
                <span className="sr-only">Fit to Screen</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Fit to Screen (F)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
