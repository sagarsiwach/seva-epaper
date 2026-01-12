import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ViewMode, ViewerPreferences } from "@/types"

interface ViewerState {
  // Current state
  currentPage: number
  totalPages: number
  zoom: number
  isLoading: boolean

  // UI state
  showThumbnails: boolean
  showControls: boolean
  viewMode: ViewMode

  // Preferences (persisted)
  preferences: ViewerPreferences

  // Actions
  setPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  goToFirst: () => void
  goToLast: () => void

  setTotalPages: (total: number) => void
  setZoom: (zoom: number) => void
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void

  setLoading: (loading: boolean) => void
  toggleThumbnails: () => void
  setShowControls: (show: boolean) => void
  setViewMode: (mode: ViewMode) => void

  updatePreferences: (prefs: Partial<ViewerPreferences>) => void
  reset: () => void
}

const defaultPreferences: ViewerPreferences = {
  theme: "system",
  autoFlip: false,
  flipDuration: 1200, // Slower, more elegant like Apple Books
  showPageNumbers: true,
}

const initialState = {
  currentPage: 0,
  totalPages: 0,
  zoom: 1,
  isLoading: true,
  showThumbnails: false,
  showControls: true,
  viewMode: "flip" as ViewMode,
  preferences: defaultPreferences,
}

export const useViewerStore = create<ViewerState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPage: (page) => {
        const { totalPages } = get()
        const clamped = Math.max(0, Math.min(page, totalPages - 1))
        set({ currentPage: clamped })
      },

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

      goToFirst: () => set({ currentPage: 0 }),

      goToLast: () => {
        const { totalPages } = get()
        set({ currentPage: Math.max(0, totalPages - 1) })
      },

      setTotalPages: (total) => set({ totalPages: total }),

      setZoom: (zoom) => {
        const clamped = Math.max(0.5, Math.min(zoom, 3))
        set({ zoom: clamped })
      },

      zoomIn: () => {
        const { zoom } = get()
        set({ zoom: Math.min(zoom + 0.25, 3) })
      },

      zoomOut: () => {
        const { zoom } = get()
        set({ zoom: Math.max(zoom - 0.25, 0.5) })
      },

      resetZoom: () => set({ zoom: 1 }),

      setLoading: (loading) => set({ isLoading: loading }),

      toggleThumbnails: () => set((state) => ({
        showThumbnails: !state.showThumbnails
      })),

      setShowControls: (show) => set({ showControls: show }),

      setViewMode: (mode) => set({ viewMode: mode }),

      updatePreferences: (prefs) => set((state) => ({
        preferences: { ...state.preferences, ...prefs }
      })),

      reset: () => set({
        ...initialState,
        preferences: get().preferences, // Keep preferences
      }),
    }),
    {
      name: "epaper-viewer",
      partialize: (state) => ({
        preferences: state.preferences,
        showThumbnails: state.showThumbnails,
        viewMode: state.viewMode,
      }),
    }
  )
)
