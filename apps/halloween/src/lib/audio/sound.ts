import { Howl, Howler } from 'howler';

export type SoundName = 'ambient' | 'carve' | 'crackle' | 'ignite' | 'music';

interface SoundDef {
  src: string;
  loop: boolean;
  // Stream instead of decoding the whole file up front (the music track is ~3 MB).
  html5?: boolean;
}

const SOUNDS: Record<SoundName, SoundDef> = {
  ambient: { src: '/audio/crickets-and-owl.mp3', loop: true },
  carve: { src: '/audio/carve.mp3', loop: true },
  crackle: { src: '/audio/crackle.mp3', loop: true },
  ignite: { src: '/audio/match-strike.mp3', loop: false },
  music: { src: '/audio/music.mp3', loop: true, html5: true },
};

const howls = new Map<SoundName, Howl>();
// Last requested volume per sound: a fade to 0 stops the sound once it finishes.
const targets = new Map<SoundName, number>();

const getHowl = (name: SoundName): Howl => {
  const existing = howls.get(name);
  if (existing !== undefined) return existing;

  const def = SOUNDS[name];
  const howl = new Howl({
    src: [def.src],
    loop: def.loop,
    html5: def.html5 ?? false,
    volume: 0,
    onloaderror: () => console.warn(`Audio "${def.src}" failed to load`),
    onplayerror: () => console.warn(`Audio "${def.src}" failed to play`),
  });
  howls.set(name, howl);
  return howl;
};

// Creates every Howl so the files start loading (and the audio context exists).
export const preload = (): void =>
  (Object.keys(SOUNDS) as SoundName[]).forEach(getHowl);

// Must run synchronously inside a user gesture handler (iOS / Chrome autoplay policy).
export const unlock = (): void => {
  preload();
  if (Howler.ctx?.state === 'suspended') void Howler.ctx.resume();
};

const ensurePlaying = (name: SoundName): Howl => {
  const howl = getHowl(name);
  if (!howl.playing()) howl.play();
  return howl;
};

// Sets volume (and optionally rate) right away, starting the sound if needed.
export const set = (name: SoundName, volume: number, rate?: number): void => {
  targets.set(name, volume);
  const howl = ensurePlaying(name);
  howl.volume(volume);
  if (rate !== undefined) howl.rate(rate);
};

export const fadeTo = (name: SoundName, volume: number, ms: number): void => {
  targets.set(name, volume);
  const howl = getHowl(name);
  if (volume === 0 && !howl.playing()) return;
  if (howl.playing()) {
    howl.fade(Number(howl.volume()), volume, ms);
  } else {
    // Howler queues a fade issued right after play() (HTML5 play-lock) behind the
    // 'play' event and never runs it, so start the fade once playback has begun.
    howl.once('play', () => howl.fade(0, volume, ms));
    howl.play();
  }
  if (volume === 0)
    setTimeout(() => {
      if (targets.get(name) === 0) howl.stop();
    }, ms + 50);
};

export const playOnce = (name: SoundName, volume = 1): void => {
  const howl = getHowl(name);
  howl.stop();
  howl.volume(volume);
  howl.play();
};

export const setMuted = (muted: boolean): void => {
  Howler.mute(muted);
};
