import React from 'react';
import {staticFile, useCurrentFrame} from 'remotion';
import {C} from './theme';
import {eInOut, prog} from './anim';
import {Cutout} from './ui';

/** Local media lives in public/assets (see docs/ASSETS.md). */
export const asset = (p: string) => staticFile(`assets/${p}`);

/** Tabler icon (MIT) tinted with any colour via CSS mask. Files: public/assets/icons/<name>.svg */
export const TIcon: React.FC<{name: string; s?: number; color?: string; style?: React.CSSProperties}> = ({name, s = 64, color = C.ink, style}) => (
  <div style={{width: s, height: s, backgroundColor: color, WebkitMaskImage: `url(${asset(`icons/${name}.svg`)})`, maskImage: `url(${asset(`icons/${name}.svg`)})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%', ...style}} />
);

/** A photo / engraving pasted like a print: paper border, masking tape, soft shadow, slides in. */
export const Print: React.FC<{
  src: string; x: number; y: number; w: number; h: number; at: number; rot?: number; from?: 'r' | 'l' | 'b' | 't';
  tape?: boolean; border?: number; fit?: 'cover' | 'contain'; pos?: string; bg?: string; dur?: number;
}> = ({src, x, y, w, h, at, rot = 0, from = 'b', tape = true, border = 10, fit = 'cover', pos = 'center', bg = '#F7F5EF', dur = 26}) => (
  <Cutout x={x} y={y} w={w} h={h} at={at} rot={rot} from={from} dur={dur}>
    <div style={{position: 'absolute', inset: 0, background: bg, padding: border}}>
      <div style={{width: '100%', height: '100%', backgroundImage: `url(${asset(src)})`, backgroundSize: fit, backgroundPosition: pos, backgroundRepeat: 'no-repeat', backgroundColor: bg}} />
    </div>
    {tape && <img src={asset('overlay/masking_tape.png')} style={{position: 'absolute', left: w / 2 - w * 0.16, top: -w * 0.04, width: w * 0.32, opacity: 0.85, transform: 'rotate(-3deg)'}} />}
  </Cutout>
);

/** Hand-drawn mark that draws itself (right to left for Persian). kind: arrow | circle | star | underline */
export const Mark: React.FC<{kind: 'arrow' | 'circle' | 'star' | 'underline'; x: number; y: number; w: number; h: number; at: number; color?: string; dur?: number; rot?: number}> = ({kind, x, y, w, h, at, color = C.red, dur = 18, rot = 0}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur, eInOut);
  const url = asset(`overlay/handdrawn_${kind}.png`);
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, width: w, height: h, backgroundColor: color, WebkitMaskImage: `url(${url})`, maskImage: `url(${url})`,
        WebkitMaskSize: '100% 100%', maskSize: '100% 100%', clipPath: `inset(0 0 0 ${(1 - p) * 100}%)`, transform: `rotate(${rot}deg)`,
      }}
    />
  );
};
