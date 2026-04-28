import { create } from 'zustand';
import { Item } from '../types';

interface AppState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentAd: Item | null;
  setCurrentAd: (ad: Item | null) => void;
}

export const useStore = create<AppState>((set) => ({
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  currentAd: null,
  setCurrentAd: (ad) => set({ currentAd: ad }),
}));