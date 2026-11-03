import React from 'react';
import {C, F} from './theme';

/* Original vector artwork (no third-party assets). Monochrome "cut-out" figures + red/blue accents. */

export const Halftone: React.FC<{id: string; size?: number; r?: number; color?: string; angle?: number}> = ({id, size = 9, r = 2, color = C.ink, angle = 30}) => (
  <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
    <circle cx={size / 2} cy={size / 2} r={r} fill={color} />
  </pattern>
);

/** Stylised 18th-century portrait cut-out (original illustration, not a copy of any artwork). */
export const Franklin: React.FC<{w?: number; id?: string}> = ({w = 380, id = 'fr'}) => (
  <svg viewBox="0 0 400 520" width={w} height={(w * 520) / 400} style={{overflow: 'visible'}}>
    <defs>
      <Halftone id={`${id}-ht`} />
      <Halftone id={`${id}-ht2`} size={7} r={1.5} color={C.ink} angle={60} />
      <linearGradient id={`${id}-skin`} x1="0" x2="1">
        <stop offset="0" stopColor="#F1F1F1" />
        <stop offset="1" stopColor="#B4B4B4" />
      </linearGradient>
    </defs>
    {/* long thin side hair, bald crown (no hat) */}
    <path d="M116 196 C66 238 54 346 90 420 C122 432 154 418 164 400 C142 340 130 280 126 226Z" fill="#9A9A9A" />
    <path d="M284 196 C334 238 346 346 310 420 C278 432 246 418 236 400 C258 340 270 280 274 226Z" fill="#9A9A9A" />
    <path d="M116 196 C66 238 54 346 90 420 C122 432 154 418 164 400 C142 340 130 280 126 226Z" fill={`url(#${id}-ht2)`} opacity="0.5" />
    <path d="M284 196 C334 238 346 346 310 420 C278 432 246 418 236 400 C258 340 270 280 274 226Z" fill={`url(#${id}-ht2)`} opacity="0.5" />
    {/* coat */}
    <path d="M-10 520 C-6 452 60 414 138 398 L262 398 C340 414 406 452 410 520Z" fill="#141414" />
    <path d="M138 398 L200 500 L152 520 L60 520 C70 470 100 420 138 398Z" fill="#262626" />
    <path d="M262 398 L200 500 L248 520 L340 520 C330 470 300 420 262 398Z" fill="#262626" />
    {/* shirt + cravat */}
    <path d="M160 396 L200 486 L240 396 L200 372Z" fill="#F4F4F2" />
    <path d="M178 392 L200 430 L222 392Z" fill="#CFCFCB" />
    {/* neck */}
    <path d="M168 320 L168 392 C190 410 210 410 232 392 L232 320Z" fill="#C4C4C4" />
    {/* face */}
    <ellipse cx="200" cy="222" rx="88" ry="118" fill={`url(#${id}-skin)`} />
    <path d="M204 124 C268 130 292 190 288 240 C284 304 248 340 204 342Z" fill={`url(#${id}-ht)`} opacity="0.32" />
    <path d="M118 176 C130 150 160 138 200 138 C240 138 270 150 282 176 C262 160 232 152 200 152 C168 152 138 160 118 176Z" fill="#E6E6E6" opacity="0.6" />
    {/* spectacles */}
    <g fill="rgba(255,255,255,0.35)" stroke={C.ink} strokeWidth="5">
      <circle cx="164" cy="236" r="27" />
      <circle cx="236" cy="236" r="27" />
    </g>
    <path d="M191 232 Q200 224 209 232" fill="none" stroke={C.ink} strokeWidth="5" />
    <path d="M137 232 L112 222 M263 232 L288 222" stroke={C.ink} strokeWidth="5" />
    <circle cx="164" cy="238" r="5" fill={C.ink} />
    <circle cx="236" cy="238" r="5" fill={C.ink} />
    <path d="M142 196 Q164 184 186 196 M214 196 Q236 184 258 196" stroke={C.ink} strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M200 244 L194 290 Q200 296 208 290" stroke="#555" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M176 314 Q200 322 224 312" stroke={C.ink} strokeWidth="5" fill="none" strokeLinecap="round" />
  </svg>
);

type IconProps = {s?: number; ink?: string; accent?: string; accent2?: string};
const base = (s: number) => ({viewBox: '0 0 200 200', width: s, height: s, style: {overflow: 'visible' as const}});

export const GuitarIcon: React.FC<IconProps> = ({s = 200, ink = C.ink, accent = C.red}) => (
  <svg {...base(s)}>
    <g transform="rotate(38 100 100)">
      <rect x="92" y="-6" width="16" height="104" fill={ink} />
      <rect x="86" y="-18" width="28" height="20" fill={accent} />
      <path d="M100 86 C62 86 56 124 74 138 C54 152 60 196 100 196 C140 196 146 152 126 138 C144 124 138 86 100 86Z" fill={ink} />
      <circle cx="100" cy="142" r="14" fill="#F2F1ED" />
      <rect x="84" y="170" width="32" height="6" fill="#F2F1ED" />
    </g>
  </svg>
);
export const CodeIcon: React.FC<IconProps> = ({s = 200, ink = C.ink, accent = C.blue}) => (
  <svg {...base(s)}>
    <rect x="6" y="30" width="188" height="140" fill={ink} />
    <circle cx="26" cy="48" r="5" fill={accent} /><circle cx="42" cy="48" r="5" fill="#F2F1ED" /><circle cx="58" cy="48" r="5" fill="#F2F1ED" />
    <path d="M74 92 L46 118 L74 144 M126 92 L154 118 L126 144" stroke="#F2F1ED" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M112 86 L88 150" stroke={accent} strokeWidth="10" strokeLinecap="round" />
  </svg>
);
export const BrushIcon: React.FC<IconProps> = ({s = 200, ink = C.ink, accent = C.red}) => (
  <svg {...base(s)}>
    <g transform="rotate(40 100 100)">
      <rect x="90" y="-20" width="20" height="130" fill={ink} />
      <rect x="86" y="106" width="28" height="22" fill="#9A9A9A" />
      <path d="M86 128 C80 170 96 196 100 204 C104 196 120 170 114 128Z" fill={accent} />
    </g>
    <path d="M10 186 C40 170 70 196 100 182" stroke={ink} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.4" />
  </svg>
);
export const CameraIcon: React.FC<IconProps> = ({s = 200, ink = C.ink, accent = C.red}) => (
  <svg {...base(s)}>
    <path d="M10 56 H58 L72 36 H128 L142 56 H190 V168 H10Z" fill={ink} />
    <circle cx="100" cy="110" r="44" fill="#F2F1ED" />
    <circle cx="100" cy="110" r="32" fill={ink} />
    <circle cx="100" cy="110" r="14" fill={accent} />
    <rect x="156" y="68" width="22" height="12" fill={accent} />
  </svg>
);
export const NotebookIcon: React.FC<IconProps> = ({s = 200, ink = C.ink, accent = C.red}) => (
  <svg {...base(s)}>
    <rect x="30" y="10" width="140" height="180" fill="#F2F1ED" stroke={ink} strokeWidth="6" />
    <rect x="30" y="10" width="24" height="180" fill={ink} />
    {[48, 74, 100, 126, 152].map((y) => (<line key={y} x1="72" x2="154" y1={y} y2={y} stroke={ink} strokeWidth="4" opacity="0.5" />))}
    <path d="M78 52 L96 70 L132 34" stroke={accent} strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const ThumbIcon: React.FC<IconProps> = ({s = 200, ink = C.ink, accent = C.red}) => (
  <svg {...base(s)}>
    <rect x="12" y="92" width="44" height="92" fill={accent} />
    <path d="M66 94 L100 20 C122 20 130 40 120 66 L112 84 H168 C186 84 190 104 180 118 C190 130 186 146 174 152 C180 168 168 182 152 182 H66Z" fill={ink} />
  </svg>
);
export const BellIcon: React.FC<IconProps> = ({s = 200, ink = C.ink, accent = C.red}) => (
  <svg {...base(s)}>
    <path d="M100 18 C60 18 52 56 52 90 C52 126 36 140 28 150 H172 C164 140 148 126 148 90 C148 56 140 18 100 18Z" fill={ink} />
    <circle cx="100" cy="172" r="16" fill={accent} />
    <circle cx="100" cy="14" r="8" fill={ink} />
  </svg>
);
export const SendIcon: React.FC<IconProps> = ({s = 200, ink = C.ink, accent = C.blue}) => (
  <svg {...base(s)}>
    <path d="M10 100 L190 20 L140 180 L100 118Z" fill={ink} />
    <path d="M100 118 L190 20" stroke={accent} strokeWidth="8" />
    <path d="M100 118 L96 168 L124 140" fill={accent} />
  </svg>
);
export const TelescopeIcon: React.FC<IconProps> = ({s = 200, ink = C.ink, accent = C.blue}) => (
  <svg {...base(s)}>
    <g transform="rotate(-24 100 80)">
      <rect x="26" y="58" width="130" height="36" fill={ink} />
      <rect x="150" y="50" width="30" height="52" fill={accent} />
      <rect x="8" y="64" width="22" height="24" fill="#9A9A9A" />
    </g>
    <path d="M100 100 L66 196 M100 100 L134 196 M100 100 V196" stroke={ink} strokeWidth="7" />
    <circle cx="160" cy="22" r="5" fill={accent} /><circle cx="184" cy="44" r="3" fill={accent} />
  </svg>
);
export const PatentIcon: React.FC<IconProps> = ({s = 200, ink = C.ink, accent = C.red}) => (
  <svg {...base(s)}>
    <path d="M10 70 L100 18 L190 70Z" fill={ink} />
    <rect x="22" y="76" width="156" height="10" fill={ink} />
    {[34, 64, 94, 124, 154].map((x) => (<rect key={x} x={x} y="92" width="16" height="70" fill={ink} />))}
    <rect x="10" y="168" width="180" height="16" fill={ink} />
    <circle cx="100" cy="52" r="11" fill={accent} />
  </svg>
);
export const FlameIcon: React.FC<IconProps> = ({s = 200, ink = C.ink, accent = C.red}) => (
  <svg {...base(s)}>
    <path d="M100 8 C128 52 172 78 164 130 C158 168 130 192 100 192 C70 192 42 168 36 130 C28 92 66 78 80 40 C90 60 96 64 100 8Z" fill={accent} />
    <path d="M100 76 C116 104 138 116 134 144 C131 166 116 178 100 178 C84 178 69 166 66 144 C62 120 86 108 100 76Z" fill="#F2F1ED" />
    <path d="M100 128 C108 140 118 146 116 158 C114 168 108 172 100 172 C92 172 86 168 84 158 C82 146 94 140 100 128Z" fill={ink} />
  </svg>
);
export const ClockIcon: React.FC<IconProps> = ({s = 200, ink = C.ink, accent = C.red}) => (
  <svg {...base(s)}>
    <circle cx="100" cy="100" r="86" fill="none" stroke={ink} strokeWidth="10" />
    <path d="M100 100 V46 M100 100 L136 120" stroke={ink} strokeWidth="10" strokeLinecap="round" />
    <circle cx="100" cy="100" r="9" fill={accent} />
  </svg>
);

/** Fig label in the corner, editorial style. */
export const FigLabel: React.FC<{n: string; text: string; color?: string; x?: number; y?: number; align?: 'left' | 'right'}> = ({n, text, color = C.ink, x = 72, y = 96, align = 'left'}) => (
  <div style={{position: 'absolute', [align]: x, top: y, fontFamily: F.mono, fontSize: 18, letterSpacing: 4, color, textTransform: 'uppercase', display: 'flex', gap: 14, alignItems: 'center'} as React.CSSProperties}>
    <span style={{width: 34, height: 2, background: color}} />
    <span>FIG. {n} / {text}</span>
  </div>
);

export const Cross: React.FC<{x: number; y: number; s?: number; color?: string}> = ({x, y, s = 14, color = C.ink}) => (
  <path d={`M${x - s} ${y} H${x + s} M${x} ${y - s} V${y + s}`} stroke={color} strokeWidth="2" />
);

export const MusicIcon: React.FC<IconProps> = ({s = 200, ink = C.ink, accent = C.red}) => (
  <svg {...base(s)}>
    <path d="M70 150 V40 L160 20 V130" stroke={ink} strokeWidth="12" fill="none" strokeLinejoin="round" />
    <ellipse cx="52" cy="154" rx="30" ry="22" fill={ink} />
    <ellipse cx="142" cy="134" rx="30" ry="22" fill={accent} />
    <path d="M70 70 L160 50" stroke={ink} strokeWidth="12" />
  </svg>
);
export const PenIcon: React.FC<IconProps> = ({s = 200, ink = C.ink, accent = C.blue}) => (
  <svg {...base(s)}>
    <path d="M20 180 L40 120 L150 10 L190 50 L80 160Z" fill={ink} />
    <path d="M150 10 L190 50" stroke={accent} strokeWidth="18" />
    <path d="M20 180 L40 120 L80 160Z" fill="#F2F1ED" />
    <path d="M30 196 H110" stroke={accent} strokeWidth="8" />
  </svg>
);
export const ChartIcon: React.FC<IconProps> = ({s = 200, ink = C.ink, accent = C.red}) => (
  <svg {...base(s)}>
    <path d="M14 14 V186 H190" stroke={ink} strokeWidth="8" fill="none" />
    <path d="M30 150 L72 100 L108 126 L170 40" stroke={accent} strokeWidth="12" fill="none" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);
