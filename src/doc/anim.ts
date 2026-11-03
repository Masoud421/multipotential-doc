import {Easing, interpolate} from 'remotion';

export const clampOpts = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

export const eOut = Easing.bezier(0.16, 1, 0.3, 1); // expo-like out
export const eInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const eBack = Easing.bezier(0.34, 1.56, 0.64, 1);

/** 0..1 progress that starts at frame `start` and lasts `dur` frames. */
export const prog = (
  frame: number,
  start: number,
  dur = 18,
  easing: (t: number) => number = eOut,
): number =>
  interpolate(frame, [start, start + Math.max(1, dur)], [0, 1], {
    ...clampOpts,
    easing,
  });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const bezierPoint = (
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  t: number,
): [number, number] => {
  const u = 1 - t;
  const x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0];
  const y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1];
  return [x, y];
};

/** Deterministic pseudo random in [0,1) from an integer seed. */
export const rnd = (seed: number): number => {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** opacity window: fades in at frame a, out at frame b */
export const win = (f: number, a: number, b: number, fade = 8) => prog(f, a, fade) * (1 - prog(f, b, fade));
