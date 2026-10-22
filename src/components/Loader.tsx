'use client';

import { useProgress } from '@react-three/drei';

export const Loader = () => {
  const { active, progress } = useProgress();

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-orange-300">
      {Math.round(progress)}%
    </div>
  );
};
