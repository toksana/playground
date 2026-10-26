'use client';

import { useEffect, useRef } from 'react';
import { playbackMode } from './demoPlayback';

interface DemoVideoProps {
  webm: string;
  mp4: string;
  poster: string;
  width: number;
  height: number;
}

const play = async (video: HTMLVideoElement): Promise<void> => {
  try {
    await video.play();
  } catch (error) {
    // Pausing right after play() rejects with AbortError: expected on quick hover in and out.
    if (error instanceof Error && error.name !== 'AbortError')
      console.warn('Demo video could not play', error);
  }
};

const stop = (video: HTMLVideoElement): void => {
  video.pause();
  video.currentTime = 0;
};

// Starts and stops `video` the way `playbackMode` says; returns the cleanup.
const attachPlayback = (video: HTMLVideoElement): (() => void) | undefined => {
  const mode = playbackMode({
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches,
    canHover: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  });
  // React does not reliably put the `muted` attribute on server-rendered markup, and
  // autoplay on iOS needs the property set before play().
  video.muted = true;

  if (mode === 'hover') {
    const card = video.closest('article') ?? video;
    const onEnter = (): void => void play(video);
    const onLeave = (): void => stop(video);
    card.addEventListener('pointerenter', onEnter);
    card.addEventListener('pointerleave', onLeave);
    return () => {
      card.removeEventListener('pointerenter', onEnter);
      card.removeEventListener('pointerleave', onLeave);
    };
  }

  if (mode === 'visible') {
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? void play(video) : stop(video)),
      { threshold: 0.5 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }
  return undefined;
};

// Decorative loop of the experience; the card already carries the title and the Play link.
export const DemoVideo = ({
  webm,
  mp4,
  poster,
  width,
  height,
}: DemoVideoProps) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    return video === null ? undefined : attachPlayback(video);
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      width={width}
      height={height}
      aria-hidden="true"
      className="border-amber/30 h-full w-auto rounded-2xl border object-cover"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
};
