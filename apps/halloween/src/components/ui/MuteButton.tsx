'use client';

import { useAudioStore } from '@/store/useAudioStore';
import { ToolButton } from './ToolButton';

export const MuteButton = () => {
  const muted = useAudioStore((s) => s.muted);
  const toggleMuted = useAudioStore((s) => s.toggleMuted);

  return (
    <ToolButton
      aria-label={muted ? 'Unmute sound' : 'Mute sound'}
      aria-pressed={muted}
      onClick={toggleMuted}
      className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 size-11 p-0"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        {muted ? (
          <path d="m16 9 5 6m0-6-5 6" />
        ) : (
          <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
        )}
      </svg>
    </ToolButton>
  );
};
