import { create } from 'zustand';
import { readMuted, writeMuted } from '@/lib/audio/mutePreference';
import { setMuted } from '@/lib/audio/sound';

interface AudioState {
  muted: boolean;
  // Loads the saved preference on the client (kept out of the initial state for SSR).
  hydrate: () => void;
  toggleMuted: () => void;
}

export const useAudioStore = create<AudioState>()((set, get) => ({
  muted: false,
  hydrate: () => {
    const muted = readMuted();
    setMuted(muted);
    set({ muted });
  },
  toggleMuted: () => {
    const muted = !get().muted;
    setMuted(muted);
    writeMuted(muted);
    set({ muted });
  },
}));
