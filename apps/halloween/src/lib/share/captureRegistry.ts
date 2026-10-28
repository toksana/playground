type FrameSource = () => HTMLCanvasElement;

let source: FrameSource | null = null;

// The WebGL canvas lives inside <Canvas>, the buttons outside it; this connects the two.
export const registerFrameSource = (next: FrameSource): (() => void) => {
  source = next;
  return () => {
    if (source === next) source = null;
  };
};

export const captureFrame = (): HTMLCanvasElement | null =>
  source === null ? null : source();
