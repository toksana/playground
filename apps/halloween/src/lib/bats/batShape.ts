import { Shape } from 'three';

export type Point2 = [number, number];

// Right half of the bat silhouette (x >= 0), from the top of the head down to the tail.
// Units: the full wingspan is 1, so the shape is scaled per instance.
const RIGHT_HALF: Point2[] = [
  [0, 0.1],
  [0.025, 0.11],
  [0.045, 0.2], // ear tip
  [0.07, 0.11],
  [0.1, 0.08],
  [0.24, 0.13],
  [0.4, 0.11],
  [0.5, 0.03], // wing tip
  [0.42, -0.02],
  [0.36, -0.1], // wing scallops
  [0.29, -0.03],
  [0.22, -0.12],
  [0.15, -0.04],
  [0.08, -0.13],
  [0.035, -0.1],
  [0, -0.17], // tail
];

const isOnAxis = ([x]: Point2): boolean => x === 0;

// Closed outline, counter-clockwise: the right half down, then its mirror image back up.
export const batOutline = (): Point2[] => {
  const mirrored = RIGHT_HALF.filter((point) => !isOnAxis(point))
    .map(([x, y]): Point2 => [-x, y])
    .reverse();
  return [...RIGHT_HALF, ...mirrored];
};

export const batShape = (): Shape => {
  const [first, ...rest] = batOutline();
  const shape = new Shape();
  shape.moveTo(...first);
  rest.forEach((point) => shape.lineTo(...point));
  shape.closePath();
  return shape;
};
