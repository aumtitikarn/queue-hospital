import { create } from 'zustand'

interface UIState {
  isLoading: boolean
  notification: {
    message: string
    type: 'success' | 'error' | 'info'
  } | null
  setLoading: (loading: boolean) => void
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void
  hideNotification: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  notification: null,
  setLoading: (loading) => set({ isLoading: loading }),
  showNotification: (message, type) =>
    set({ notification: { message, type } }),
  hideNotification: () => set({ notification: null }),
}))

