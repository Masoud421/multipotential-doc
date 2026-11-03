import captionsJson from '../captions.json';
import audioInfo from '../audio-info.json';
import {FPS} from './theme';

export type SpokenWord = {w: string; start: number; end: number};
export type Caption = {start: number; end: number; text: string; words?: SpokenWord[]};
export const CAPTIONS = captionsJson as Caption[];

/** Total length: the narration is the master timeline (seconds come from src/audio-info.json, written by scripts/sync-audio.py). */
export const AUDIO_SECONDS = audioInfo.seconds;
export const DURATION = Math.ceil(AUDIO_SECONDS * FPS);

export const capStart = (i: number) => Math.round(CAPTIONS[i].start * FPS);
export const capEnd = (i: number) => Math.round(CAPTIONS[i].end * FPS);

/** Absolute start frames of every spoken word of cue i (null when word timings are not available). */
export const spokenStarts = (i: number): number[] | null => {
  const w = CAPTIONS[i]?.words;
  return w && w.length ? w.map((x) => Math.round(x.start * FPS)) : null;
};
/** Index of the cue being spoken at absolute frame `abs` (the latest cue that started at or before it). */
export const cueAt = (abs: number): number => {
  let lo = 0, hi = CAPTIONS.length - 1, ans = 0;
  while (lo <= hi) { const m = (lo + hi) >> 1; if (capStart(m) <= abs) { ans = m; lo = m + 1; } else hi = m - 1; }
  return ans;
};

/**
 * Scene list. `a` is the index of the first subtitle of the scene. A scene starts
 * on that subtitle's real SRT timestamp and ends where the next scene starts.
 * `ch` is the chapter (shown in the HUD).
 */
export type SceneDef = {id: string; a: number; ch: number};

export const CHAPTERS = [
  'مقدمه',
  'تناقض',
  'معیار اول',
  'معیار دوم',
  'معیار سوم',
  'روش فرانکلین',
  'سه قدم',
  'چهار مدل',
  'انتخاب',
];

export const SCENES: SceneDef[] = [
  {id: 'hook', a: 0, ch: 0},
  {id: 'premise', a: 4, ch: 0},
  {id: 'agenda', a: 7, ch: 0},
  {id: 'welcome', a: 15, ch: 0},
  {id: 'paradox', a: 17, ch: 1},
  {id: 'stat', a: 21, ch: 1},
  {id: 'combine', a: 25, ch: 1},
  {id: 'question', a: 31, ch: 1},
  {id: 'halflife', a: 35, ch: 1},
  {id: 'three', a: 42, ch: 1},
  {id: 'c1', a: 44, ch: 2},
  {id: 'newport', a: 47, ch: 2},
  {id: 'reframe', a: 54, ch: 2},
  {id: 'experiment', a: 57, ch: 2},
  {id: 'verdict', a: 67, ch: 2},
  {id: 'c2', a: 74, ch: 3},
  {id: 'c2combine', a: 79, ch: 3},
  {id: 'app', a: 83, ch: 3},
  {id: 'hopping', a: 90, ch: 3},
  {id: 'exercise', a: 99, ch: 3},
  {id: 'cta1', a: 107, ch: 3},
  {id: 'dip', a: 114, ch: 4},
  {id: 'jump', a: 123, ch: 4},
  {id: 'twoq', a: 129, ch: 4},
  {id: 'rule', a: 134, ch: 4},
  {id: 'recap', a: 141, ch: 4},
  {id: 'gap', a: 147, ch: 4},
  {id: 'franklin', a: 158, ch: 5},
  {id: 'virtues', a: 172, ch: 5},
  {id: 'garden', a: 184, ch: 5},
  {id: 'step1', a: 192, ch: 6},
  {id: 'step2', a: 201, ch: 6},
  {id: 'step3', a: 211, ch: 6},
  {id: 'warning', a: 223, ch: 6},
  {id: 'goodnews', a: 228, ch: 6},
  {id: 'models', a: 235, ch: 7},
  {id: 'hug', a: 243, ch: 7},
  {id: 'slash', a: 252, ch: 7},
  {id: 'einstein', a: 261, ch: 7},
  {id: 'phoenix', a: 271, ch: 7},
  {id: 'ai', a: 278, ch: 7},
  {id: 'needs', a: 283, ch: 8},
  {id: 'choose', a: 290, ch: 8},
  {id: 'action', a: 299, ch: 8},
  {id: 'outro', a: 303, ch: 8},
];

export type SceneSpan = SceneDef & {from: number; to: number; index: number};

export const SPANS: SceneSpan[] = SCENES.map((s, index) => {
  const from = index === 0 ? 0 : capStart(s.a);
  const to = index === SCENES.length - 1 ? DURATION : capStart(SCENES[index + 1].a);
  return {...s, from, to, index};
});

/** Scenes rendered on the dark (ink) tone — the HUD flips to light. */
export const DARK_SCENES = ['stat', 'cta1', 'outro'];
