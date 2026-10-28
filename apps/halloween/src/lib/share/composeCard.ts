import { wrapText } from './wrapText';

// Portrait 4:5, a good fit for Stories and chat previews.
const WIDTH = 1080;
const HEIGHT = 1350;
const BACKGROUND = '#05060c';
const FRAME_TOP = HEIGHT - WIDTH;
const FADE = 160;
const TEXT_WIDTH = 900;
const LINE_HEIGHT = 70;
const FONT_STACK = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

export interface CardContent {
  text: string;
  color: string;
}

const paintBackground = (
  ctx: CanvasRenderingContext2D,
  color: string,
): void => {
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  const glow = ctx.createRadialGradient(WIDTH / 2, 800, 0, WIDTH / 2, 800, 700);
  glow.addColorStop(0, `${color}33`);
  glow.addColorStop(1, `${color}00`);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
};

const fadeEdge = (
  ctx: CanvasRenderingContext2D,
  y: number,
  toward: 1 | -1,
): void => {
  const gradient = ctx.createLinearGradient(0, y, 0, y + FADE * toward);
  gradient.addColorStop(0, BACKGROUND);
  gradient.addColorStop(1, `${BACKGROUND}00`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, Math.min(y, y + FADE * toward), WIDTH, FADE);
};

// Centre square of the scene, so the pumpkin stays in frame on both portrait and landscape screens.
const paintFrame = (
  ctx: CanvasRenderingContext2D,
  frame: HTMLCanvasElement,
): void => {
  const side = Math.min(frame.width, frame.height * 0.8);
  const sx = (frame.width - side) / 2;
  const sy = (frame.height - side) / 2;
  ctx.drawImage(frame, sx, sy, side, side, 0, FRAME_TOP, WIDTH, WIDTH);
  fadeEdge(ctx, FRAME_TOP, 1);
  fadeEdge(ctx, HEIGHT, -1);
};

const paintText = (
  ctx: CanvasRenderingContext2D,
  { text, color }: CardContent,
): void => {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  ctx.font = `500 24px ${FONT_STACK}`;
  ctx.letterSpacing = '5px';
  ctx.fillStyle = color;
  ctx.fillText('YOUR PUMPKIN TELLS YOUR FORTUNE', WIDTH / 2, 90);
  ctx.letterSpacing = '0px';

  ctx.font = `700 56px ${FONT_STACK}`;
  ctx.fillStyle = '#fff7ed';
  ctx.shadowColor = color;
  ctx.shadowBlur = 28;
  const lines = wrapText(
    text,
    TEXT_WIDTH,
    (line) => ctx.measureText(line).width,
  );
  lines.forEach((line, i) =>
    ctx.fillText(line, WIDTH / 2, 170 + i * LINE_HEIGHT),
  );
  ctx.shadowBlur = 0;
};

const paintFooter = (ctx: CanvasRenderingContext2D): void => {
  ctx.font = `400 26px ${FONT_STACK}`;
  ctx.fillStyle = 'rgba(255, 247, 237, 0.6)';
  ctx.textAlign = 'center';
  ctx.fillText(
    'Glowkin · playground.oksana.dev/halloween',
    WIDTH / 2,
    HEIGHT - 48,
  );
};

export const composeCard = (
  frame: HTMLCanvasElement,
  content: CardContent,
): HTMLCanvasElement => {
  const card = document.createElement('canvas');
  card.width = WIDTH;
  card.height = HEIGHT;
  const ctx = card.getContext('2d');
  if (ctx === null) throw new Error('2D canvas is not available');

  paintBackground(ctx, content.color);
  paintFrame(ctx, frame);
  paintText(ctx, content);
  paintFooter(ctx);
  return card;
};
