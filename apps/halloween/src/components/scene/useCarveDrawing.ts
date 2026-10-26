import type { ThreeEvent } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';
import { hitToCarveUV } from '@/lib/carve/hit';
import type { Point } from '@/lib/carve/strokes';
import { useCarveStore } from '@/store/useCarveStore';

type PointerEvent = ThreeEvent<globalThis.PointerEvent>;

const local = new Vector3();

const toCarveUV = (e: PointerEvent): Point | null => {
  local.copy(e.point);
  e.object.worldToLocal(local);
  return hitToCarveUV(local.x, local.y, e.face?.normal.z);
};

// Pointer handlers for the outer pumpkin shell. Reads and writes the store via getState():
// nothing here re-renders React.
export const useCarveDrawing = () => {
  const pressed = useRef(false);

  // Input is ignored while a template is being carved by the animation.
  const isCarving = (): boolean => {
    const { phase, isAnimating } = useCarveStore.getState();
    return phase === 'carving' && !isAnimating;
  };

  const onPointerDown = (e: PointerEvent): void => {
    if (!isCarving()) return;
    e.stopPropagation();
    pressed.current = true;
    const uv = toCarveUV(e);
    if (uv !== null) useCarveStore.getState().beginStroke(uv);
  };

  const onPointerMove = (e: PointerEvent): void => {
    if (!pressed.current) return;
    if (!isCarving()) {
      pressed.current = false;
      return;
    }
    e.stopPropagation();
    const { current, beginStroke, extendStroke, endStroke } =
      useCarveStore.getState();

    // Released outside the canvas: pointerup never reached us.
    if (e.nativeEvent.buttons === 0) {
      pressed.current = false;
      endStroke();
      return;
    }

    const uv = toCarveUV(e);
    if (uv === null) endStroke();
    else if (current === null) beginStroke(uv);
    else extendStroke(uv);
  };

  const endPress = (): void => {
    pressed.current = false;
    useCarveStore.getState().endStroke();
  };

  // Leaving the shell closes the stroke but keeps `pressed`, so re-entering continues drawing.
  const onPointerLeave = (): void => useCarveStore.getState().endStroke();

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: endPress,
    onPointerLeave,
  };
};
