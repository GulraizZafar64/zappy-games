import { create } from "zustand"

interface AuthModalStore {
  isOpen: boolean
  mode: "signin" | "signup"
  openModal: (mode: "signin" | "signup") => void
  closeModal: () => void
  setMode: (mode: "signin" | "signup") => void
}

export const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  mode: "signin",
  openModal: (mode) => set({ isOpen: true, mode }),
  closeModal: () => set({ isOpen: false }),
  setMode: (mode) => set({ mode }),
}))
