import { create } from "zustand"
import { persist } from "zustand/middleware"

// =============================================
// VIEWER STORE - Complete Rewrite
// Clean state management for e-paper viewer
// =============================================

export interface ViewerState {
  // Current viewing state
  currentEdition: string | null
  currentSection: string | null
  currentPage: number
  totalPages: number

  // View state
  zoomLevel: number
  showThumbnails: boolean
  isLoading: boolean

  // Preferences (persisted)
  autoFlip: boolean
  flipSpeed: number

  // Actions
  setCurrentEdition: (edition: string | null) => void
  setCurrentSection: (section: string | null) => void
  setCurrentPage: (page: number) => void
  setTotalPages: (total: number) => void
  setZoomLevel: (level: number) => void
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  toggleThumbnails: () => void
  setShowThumbnails: (show: boolean) => void
  nextPage: () => void
  prevPage: () => void
  goToPage: (page: number) => void
  goToFirstPage: () => void
  goToLastPage: () => void
  setAutoFlip: (enabled: boolean) => void
  setFlipSpeed: (speed: number) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

const initialState = {
  currentEdition: null,
  currentSection: null,
  currentPage: 0,
  totalPages: 0,
  zoomLevel: 1,
  showThumbnails: false,
  isLoading: true,
  autoFlip: false,
  flipSpeed: 1000,
}

export const useViewerStore = create<ViewerState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentEdition: (edition) => set({ currentEdition: edition }),
      setCurrentSection: (section) => set({ currentSection: section }),
      setCurrentPage: (page) => set({ currentPage: page }),
      setTotalPages: (total) => set({ totalPages: total }),

      setZoomLevel: (level) =>
        set({ zoomLevel: Math.max(0.5, Math.min(level, 3)) }),

      zoomIn: () => {
        const { zoomLevel } = get()
        set({ zoomLevel: Math.min(zoomLevel + 0.25, 3) })
      },

      zoomOut: () => {
        const { zoomLevel } = get()
        set({ zoomLevel: Math.max(zoomLevel - 0.25, 0.5) })
      },

      resetZoom: () => set({ zoomLevel: 1 }),

      toggleThumbnails: () =>
        set((state) => ({ showThumbnails: !state.showThumbnails })),

      setShowThumbnails: (show) => set({ showThumbnails: show }),

      nextPage: () => {
        const { currentPage, totalPages } = get()
        if (currentPage < totalPages - 1) {
          set({ currentPage: currentPage + 1 })
        }
      },

      prevPage: () => {
        const { currentPage } = get()
        if (currentPage > 0) {
          set({ currentPage: currentPage - 1 })
        }
      },

      goToPage: (page) => {
        const { totalPages } = get()
        const clampedPage = Math.max(0, Math.min(page, totalPages - 1))
        set({ currentPage: clampedPage })
      },

      goToFirstPage: () => set({ currentPage: 0 }),

      goToLastPage: () => {
        const { totalPages } = get()
        set({ currentPage: Math.max(0, totalPages - 1) })
      },

      setAutoFlip: (enabled) => set({ autoFlip: enabled }),
      setFlipSpeed: (speed) => set({ flipSpeed: speed }),
      setLoading: (loading) => set({ isLoading: loading }),

      reset: () => set(initialState),
    }),
    {
      name: "epaper-viewer-store",
      partialize: (state) => ({
        autoFlip: state.autoFlip,
        flipSpeed: state.flipSpeed,
        showThumbnails: state.showThumbnails,
      }),
    }
  )
)
