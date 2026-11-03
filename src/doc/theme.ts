// Design tokens for the editorial documentary look.
export const FPS = 30;
export const W = 1920;
export const H = 1080;

export const C = {
  paper: '#F2F1ED',
  paper2: '#E5E4DF',
  gray: '#C8C7C2',
  mid: '#8A8985',
  ink: '#0D0D0D',
  ink2: '#2B2B2B',
  red: '#E3342F',
  blue: '#1E4FD6',
  white: '#FFFFFF',
};

export const F = {
  fa: "'ZFJahan','Vazirmatn','Tahoma','Arial',sans-serif",
  serif: "Georgia,'Times New Roman','DejaVu Serif',serif",
  mono: "'SF Mono','Menlo','Consolas','DejaVu Sans Mono',monospace",
};

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
export const toFa = (n: number | string): string =>
  String(n).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);

export const timecode = (seconds: number): string => {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return toFa(`${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`);
};
