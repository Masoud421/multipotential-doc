import React, {createContext, useContext} from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, F, FPS, H, W, timecode, toFa} from './theme';
import {clampOpts, eInOut, eOut, prog} from './anim';
import {CAPTIONS, CHAPTERS, DARK_SCENES, SPANS, DURATION, capEnd, capStart, cueAt, spokenStarts} from './timing';

/* ------------------------------------------------------------------ scene context */
export type Tone = 'paper' | 'gray' | 'ink';
type SceneCtxType = {from: number; to: number; dur: number; index: number; fg: string; bg: string; tone: Tone};
export const SceneCtx = createContext<SceneCtxType>({
  from: 0, to: 1, dur: 1, index: 0, fg: C.ink, bg: C.paper, tone: 'paper',
});
export const useScene = () => useContext(SceneCtx);

/** Returns cue(i, offset) -> scene-local frame of subtitle i's real start time. */
export const useCue = () => {
  const {from} = useScene();
  return (i: number, offset = 0) => capStart(i) - from + offset;
};
/** Scene-local frame where subtitle i ends. */
export const useCueEnd = () => {
  const {from} = useScene();
  return (i: number) => capEnd(i) - from;
};

/* ------------------------------------------------------------------ backgrounds */
const toneColors: Record<Tone, {bg: string; fg: string}> = {
  paper: {bg: C.paper, fg: C.ink},
  gray: {bg: C.paper2, fg: C.ink},
  ink: {bg: C.ink, fg: C.paper},
};

const GridBg: React.FC<{frame: number; tone: Tone}> = ({frame, tone}) => {
  const line = tone === 'ink' ? 'rgba(255,255,255,0.07)' : 'rgba(13,13,13,0.07)';
  const drift = (frame * 0.18) % 120;
  return (
    <div
      style={{
        position: 'absolute', inset: -240,
        backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
        backgroundSize: '120px 120px',
        backgroundPosition: `${drift}px ${drift * 0.5}px`,
      }}
    />
  );
};

export const PaperGrain: React.FC<{opacity?: number}> = ({opacity = 0.35}) => (
  <div
    style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: `url(${staticFile('assets/doc/grain.png')})`,
      backgroundSize: '512px 512px', mixBlendMode: 'multiply', opacity,
    }}
  />
);

/* ------------------------------------------------------------------ scene shell: camera + wipe */
export const SceneShell: React.FC<{
  index: number; from: number; to: number; tone?: Tone; zoom?: number; pan?: [number, number];
  wipe?: boolean; wipeColor?: string; grid?: boolean; children: React.ReactNode;
}> = ({index, from, to, tone = 'paper', zoom = 0.05, pan = [0, 0], wipe = true, wipeColor, grid = true, children}) => {
  const f = useCurrentFrame();
  const dur = Math.max(1, to - from);
  const t = Math.min(1, f / dur);
  const {bg, fg} = toneColors[tone];
  const p = wipe && index > 0 ? prog(f, 0, 20, eInOut) : 1;
  const edge = wipeColor ?? (index % 2 === 0 ? C.red : C.blue);
  const scale = 1 + zoom * t;
  const tx = pan[0] * (t - 0.5);
  const ty = pan[1] * (t - 0.5);
  return (
    <SceneCtx.Provider value={{from, to, dur, index, fg, bg, tone}}>
      <AbsoluteFill style={{clipPath: `inset(0 0 0 ${(1 - p) * 100}%)`, background: bg, color: fg, direction: 'rtl', fontFamily: F.fa, overflow: 'hidden'}}>
        <AbsoluteFill style={{transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transformOrigin: '50% 50%'}}>
          {grid && <GridBg frame={f} tone={tone} />}
          {children}
        </AbsoluteFill>
        <PaperGrain opacity={tone === 'ink' ? 0.12 : 0.32} />
        {tone !== 'ink' ? (
          <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `url(${staticFile('assets/overlay/paper.jpg')})`, backgroundSize: 'cover', mixBlendMode: 'multiply', opacity: 0.9}} />
        ) : (
          <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `url(${staticFile('assets/overlay/dust_white.png')})`, backgroundSize: 'cover', opacity: 0.5, transform: `translate(${(f % 90) * 0.4}px, ${(f % 60) * 0.3}px)`}} />
        )}
      </AbsoluteFill>
      {p < 1 && (
        <div style={{position: 'absolute', top: 0, bottom: 0, left: `${(1 - p) * 100}%`, width: 18, marginLeft: -9, background: edge}} />
      )}
    </SceneCtx.Provider>
  );
};

/* ------------------------------------------------------------------ typography */
type WordsProps = {
  text: string; at: number; size?: number; color?: string; align?: 'start' | 'center' | 'end';
  width?: number; stagger?: number; lh?: number; stroke?: number; font?: string; gap?: number;
  style?: React.CSSProperties; dur?: number; hlColor?: string;
};

/**
 * Kinetic text: words slide up out of a mask, staggered from the cue frame.
 * Prefix a word with `*` for an ink highlight box, `~` for red text, `^` for blue text, `_` for red box.
 */
export const Words: React.FC<WordsProps> = ({
  text, at, size = 64, color, align = 'start', width, stagger = 3, lh = 1.35, stroke = 0, font, gap, style, dur = 16, hlColor,
}) => {
  const f = useCurrentFrame();
  const {fg, bg, from} = useScene();
  const col = color ?? fg;
  const lines = text.split('\n');
  let k = 0;
  // Word-exact sync: when measured word times exist for the cue being spoken, each displayed word
  // appears on the spoken word it lines up with (spread over the rest of that cue), never before `at`.
  const nShown = lines.reduce((a, l) => a + l.split(' ').filter(Boolean).length, 0);
  const revealAt: number[] = [];
  {
    const abs = from + at;
    const ci = cueAt(abs + 2);
    const starts = spokenStarts(ci);
    const rem = starts ? starts.filter((x) => x >= abs - 2) : [];
    for (let j = 0; j < nShown; j++) {
      if (rem.length) {
        const idx = nShown > 1 ? Math.round((j * (rem.length - 1)) / (nShown - 1)) : 0;
        revealAt.push(Math.max(at, rem[idx] - from - 2));
      } else revealAt.push(at + j * stagger);
    }
  }
  return (
    <div
      style={{
        direction: 'rtl', width, fontFamily: font ?? F.fa, fontSize: size, lineHeight: lh, color: col,
        WebkitTextStroke: stroke ? `${stroke}px ${col}` : undefined, ...style,
      }}
    >
      {lines.map((line, li) => (
        <div
          key={li}
          style={{
            display: 'flex', flexWrap: 'wrap', columnGap: gap ?? size * 0.26,
            justifyContent: align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : 'center',
          }}
        >
          {line.split(' ').filter(Boolean).map((raw, wi) => {
            const mark = raw[0];
            const isMark = '*~^_'.includes(mark);
            const word = isMark ? raw.slice(1) : raw;
            const ri = k++;
            const p = prog(f, revealAt[ri], dur);
            const box = mark === '*' || mark === '_';
            const wcol = mark === '~' ? C.red : mark === '^' ? C.blue : box ? (mark === '*' ? bg : C.white) : col;
            const boxCol = mark === '_' ? C.red : hlColor ?? col;
            return (
              <span key={wi} style={{display: 'inline-block', overflow: 'hidden', padding: `${size * 0.2}px 0 ${size * 0.34}px`, margin: `${-size * 0.2}px 0 ${-size * 0.34}px`}}>
                <span style={{display: 'inline-block', position: 'relative', transform: `translateY(${(1 - p) * 115}%)`, opacity: p > 0 ? 1 : 0, color: wcol}}>
                  {box && (
                    <span
                      style={{
                        position: 'absolute', inset: `${size * 0.1}px ${-size * 0.12}px ${size * 0.06}px`, background: boxCol, zIndex: -1,
                        transformOrigin: 'right center', transform: `scaleX(${prog(f, revealAt[ri] + 6, 14)})`,
                      }}
                    />
                  )}
                  <span style={{position: 'relative', padding: box ? `0 ${size * 0.1}px` : 0}}>{word}</span>
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Small framed label (like an editorial tag). `en` renders Latin mono caps. */
export const Tag: React.FC<{text: string; at: number; x: number; y: number; en?: boolean; color?: string; fill?: string; size?: number; align?: 'right' | 'left'}> = ({
  text, at, x, y, en = false, color, fill, size = 26, align = 'right',
}) => {
  const f = useCurrentFrame();
  const {fg} = useScene();
  const p = prog(f, at, 14);
  const col = color ?? fg;
  return (
    <div
      style={{
        position: 'absolute', [align]: align === 'right' ? W - x : x, top: y, direction: en ? 'ltr' : 'rtl',
        fontFamily: en ? F.mono : F.fa, fontSize: en ? size * 0.74 : size, letterSpacing: en ? 3 : 0,
        textTransform: 'uppercase', color: fill ? C.white : col, background: fill, border: fill ? 'none' : `1.5px solid ${col}`,
        padding: `${size * 0.12}px ${size * 0.5}px ${size * 0.2}px`, opacity: p, transform: `translateY(${(1 - p) * 14}px)`, whiteSpace: 'nowrap',
      } as React.CSSProperties}
    >
      {text}
    </div>
  );
};

/** Solid rectangle that wipes in (for shapes / bands / highlights). */
export const Slab: React.FC<{at: number; x: number; y: number; w: number; h: number; color: string; dir?: 'r' | 'l' | 'u' | 'd'; dur?: number; rot?: number; opacity?: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({
  at, x, y, w, h, color, dir = 'r', dur = 20, rot = 0, opacity = 1, style, children,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur, eInOut);
  const origin = dir === 'r' ? 'right center' : dir === 'l' ? 'left center' : dir === 'u' ? 'center bottom' : 'center top';
  const tf = dir === 'r' || dir === 'l' ? `scaleX(${p})` : `scaleY(${p})`;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg)`, ...style}}>
      <div style={{position: 'absolute', inset: 0, background: color, opacity, transformOrigin: origin, transform: tf}} />
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ svg helpers */
export const Svg: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', ...style}}>
    {children}
  </svg>
);

/** Animated stroke draw for a path with known approximate length. */
export const DrawPath: React.FC<{d: string; at: number; dur?: number; len?: number; stroke?: string; width?: number; fill?: string; opacity?: number; dash?: string; cap?: 'round' | 'butt'}> = ({
  d, at, dur = 30, len = 3000, stroke, width = 4, fill = 'none', opacity = 1, cap = 'round',
}) => {
  const f = useCurrentFrame();
  const {fg} = useScene();
  const p = prog(f, at, dur, eInOut);
  return (
    <path d={d} fill={fill} stroke={stroke ?? fg} strokeWidth={width} strokeLinecap={cap} strokeLinejoin="round" opacity={opacity}
      strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
  );
};

/** Straight line that grows from (x1,y1) towards (x2,y2). */
export const GrowLine: React.FC<{x1: number; y1: number; x2: number; y2: number; at: number; dur?: number; stroke?: string; width?: number; dash?: string; opacity?: number}> = ({
  x1, y1, x2, y2, at, dur = 20, stroke, width = 2, dash, opacity = 1,
}) => {
  const f = useCurrentFrame();
  const {fg} = useScene();
  const p = prog(f, at, dur, eInOut);
  return <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={stroke ?? fg} strokeWidth={width} strokeDasharray={dash} opacity={opacity} strokeLinecap="round" />;
};

/** SVG text with RTL support. */
export const SText: React.FC<{x: number; y: number; at: number; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end'; en?: boolean; children: React.ReactNode; dur?: number; weight?: number; ls?: number}> = ({
  x, y, at, size = 30, color, anchor = 'middle', en = false, children, dur = 14, ls,
}) => {
  const f = useCurrentFrame();
  const {fg} = useScene();
  const p = prog(f, at, dur);
  // In RTL text `start`/`end` are mirrored: callers pass the *visual* side (start = left, end = right).
  const a = en ? anchor : anchor === 'start' ? 'end' : anchor === 'end' ? 'start' : anchor;
  return (
    <text x={x} y={y + (1 - p) * 14} textAnchor={a} fill={color ?? fg} opacity={p} fontSize={size}
      fontFamily={en ? F.mono : F.fa} direction={en ? 'ltr' : 'rtl'} letterSpacing={ls ?? (en ? 3 : 0)}>
      {children}
    </text>
  );
};

/** Collage "cut-out" treatment: white paper border + hard offset shadow. */
export const cutoutFilter =
  'drop-shadow(3px 0 0 #fff) drop-shadow(-3px 0 0 #fff) drop-shadow(0 3px 0 #fff) drop-shadow(0 -3px 0 #fff) drop-shadow(12px 16px 0 rgba(13,13,13,0.16))';

export const Cutout: React.FC<{x: number; y: number; w: number; h: number; at: number; rot?: number; from?: 'r' | 'l' | 'b' | 't'; children: React.ReactNode; dur?: number; style?: React.CSSProperties}> = ({
  x, y, w, h, at, rot = 0, from = 'r', children, dur = 24, style,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur);
  const dx = from === 'r' ? 220 : from === 'l' ? -220 : 0;
  const dy = from === 'b' ? 200 : from === 't' ? -200 : 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: Math.min(1, p * 2.2), transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) rotate(${rot + (1 - p) * 8}deg)`, filter: cutoutFilter, ...style}}>
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ persistent layers */
export const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const idx = CAPTIONS.findIndex((_, i) => f >= capStart(i) && f < capEnd(i) + 4);
  if (idx < 0) return null;
  const local = f - capStart(idx);
  const p = prog(local, 0, 5);
  const exit = interpolate(f, [capEnd(idx), capEnd(idx) + 4], [1, 0], clampOpts);
  const lines = CAPTIONS[idx].text.split('\n');
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 64, display: 'flex', justifyContent: 'center', direction: 'rtl', opacity: Math.min(p, exit), transform: `translateY(${(1 - p) * 10}px)`}}>
      <div style={{background: 'rgba(13,13,13,0.94)', color: C.paper, fontFamily: F.fa, fontSize: 46, lineHeight: 1.6, textAlign: 'center', padding: '8px 40px 14px', maxWidth: 1500, borderRight: `8px solid ${C.red}`}}>
        {lines.map((l, i) => (<div key={i}>{l}</div>))}
      </div>
    </div>
  );
};

/** Top HUD (chapter / timecode) and the bottom progress rail with scene ticks. */
export const Hud: React.FC = () => {
  const f = useCurrentFrame();
  const span = SPANS.find((s) => f >= s.from && f < s.to) ?? SPANS[SPANS.length - 1];
  const dark = DARK_SCENES.includes(span.id);
  const col = dark ? C.paper : C.ink;
  const prg = Math.min(1, f / DURATION);
  const chapterStarts = SPANS.filter((s, i) => i === 0 || SPANS[i - 1].ch !== s.ch);
  return (
    <>
      <div style={{position: 'absolute', top: 38, right: 72, direction: 'rtl', display: 'flex', alignItems: 'center', gap: 18, color: col, fontFamily: F.fa, fontSize: 28}}>
        <span style={{background: C.red, color: C.white, padding: '0 14px 4px', fontSize: 24}}>{toFa(span.ch + 1)}</span>
        <span>{CHAPTERS[span.ch]}</span>
      </div>
      <div style={{position: 'absolute', top: 40, left: 72, display: 'flex', alignItems: 'center', gap: 20, color: col, fontFamily: F.mono, fontSize: 20, letterSpacing: 3}}>
        <span style={{width: 14, height: 14, background: C.blue}} />
        <span>{timecode(f / FPS)}</span>
      </div>
      <div style={{position: 'absolute', left: 72, right: 72, bottom: 30, height: 2, background: 'rgba(13,13,13,0.18)'}}>
        <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${prg * 100}%`, background: C.red}} />
        {chapterStarts.map((s) => (
          <div key={s.id} style={{position: 'absolute', right: `${(s.from / DURATION) * 100}%`, top: -5, width: 2, height: 12, background: C.ink}} />
        ))}
      </div>
    </>
  );
};
