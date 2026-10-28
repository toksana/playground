'use client';

import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { registerFrameSource } from '@/lib/share/captureRegistry';

// Exposes the WebGL canvas to the share buttons (needs `preserveDrawingBuffer` on <Canvas>).
export const GlCapture = (): null => {
  const gl = useThree((s) => s.gl);

  useEffect(() => registerFrameSource(() => gl.domElement), [gl]);

  return null;
};
