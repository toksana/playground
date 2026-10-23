// Procedural loops → mono WAV → mp3 (needs ffmpeg): ambient wind, carve scrape, fire crackle.
// Usage: node scripts/generate-audio.mjs [outDir]   (default: public/audio)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const OUT = process.argv[2] ?? './public/audio';
const RATE = 22050;
const PEAK = 0.8;

// ---------- helpers ----------
const mulberry32 = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const noise = (rand, n) =>
  Float32Array.from({ length: n }, () => rand() * 2 - 1);

const lowpass = (x, cutoffAt) => {
  let y = 0;
  return x.map((v, i) => {
    const a = 1 - Math.exp((-2 * Math.PI * cutoffAt(i / RATE)) / RATE);
    y += a * (v - y);
    return y;
  });
};

const highpass = (x, cutoff) => {
  const lp = lowpass(x, () => cutoff);
  return x.map((v, i) => v - lp[i]);
};

// Blends the tail into the head so the loop has no click at the seam.
const makeLoop = (x, seconds, fadeSeconds) => {
  const n = Math.round(seconds * RATE);
  const fade = Math.round(fadeSeconds * RATE);
  return Float32Array.from({ length: n }, (_, i) => {
    if (i >= fade) return x[i];
    const w = i / fade;
    return x[i] * w + x[n + i] * (1 - w);
  });
};

const normalize = (x) => {
  const peak = x.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
  return x.map((v) => (v / peak) * PEAK);
};

const toWav = (x) => {
  const data = Buffer.alloc(x.length * 2);
  x.forEach((v, i) => data.writeInt16LE(Math.round(v * 32767), i * 2));
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVEfmt ', 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
};

// ---------- sounds ----------
const SECONDS = (s, fade) => s + fade;

// Wind: low noise whose cutoff and level swell slowly (whole cycles per loop → seamless).
const ambient = () => {
  const rand = mulberry32(1);
  const len = 8;
  const raw = noise(rand, Math.round(SECONDS(len, 1) * RATE));
  const swell = (t, cycles) => Math.sin((2 * Math.PI * cycles * t) / len);
  const wind = lowpass(raw, (t) => 350 + 250 * (0.5 + 0.5 * swell(t, 2)));
  const shaped = wind.map(
    (v, i) => v * (0.55 + 0.45 * (0.5 + 0.5 * swell(i / RATE, 3))),
  );
  return makeLoop(shaped, len, 1);
};

// Scrape: bright band-limited noise with fast random amplitude flutter.
const carve = () => {
  const rand = mulberry32(2);
  const len = 1;
  const raw = noise(rand, Math.round(SECONDS(len, 0.2) * RATE));
  const band = lowpass(highpass(raw, 1500), () => 5500);
  const flutter = lowpass(noise(rand, raw.length), () => 40);
  const shaped = band.map((v, i) => v * (0.5 + 4 * Math.abs(flutter[i])));
  return makeLoop(shaped, len, 0.2);
};

// Fire: quiet low rumble plus random short pops of filtered noise.
const crackle = () => {
  const rand = mulberry32(3);
  const len = 4;
  const n = Math.round(SECONDS(len, 0.5) * RATE);
  const rumble = lowpass(noise(rand, n), () => 180).map((v) => v * 0.6);
  const pops = new Float32Array(n);
  for (let i = 0; i < n; i += 1) {
    if (rand() > 0.0009) continue;
    const amp = 0.3 + rand() * 0.7;
    const decay = 60 + rand() * 240;
    const burst = highpass(noise(rand, 600), 800);
    burst.forEach((v, k) => {
      if (i + k < n) pops[i + k] += v * amp * Math.exp(-k / decay);
    });
  }
  return makeLoop(
    rumble.map((v, i) => v + pops[i] * 2),
    len,
    0.5,
  );
};

// ---------- output ----------
fs.mkdirSync(OUT, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'glowkin-audio-'));

Object.entries({ ambient, carve, crackle }).forEach(([name, make]) => {
  const wav = path.join(tmp, `${name}.wav`);
  const mp3 = path.join(OUT, `${name}.mp3`);
  fs.writeFileSync(wav, toWav(normalize(make())));
  execFileSync('ffmpeg', [
    '-y',
    '-loglevel',
    'error',
    '-i',
    wav,
    '-codec:a',
    'libmp3lame',
    '-b:a',
    '64k',
    mp3,
  ]);
  console.log(`${mp3} (${fs.statSync(mp3).size} bytes)`);
});
fs.rmSync(tmp, { recursive: true });
