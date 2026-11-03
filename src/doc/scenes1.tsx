import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, toFa} from './theme';
import {eBack, eInOut, eOut, lerp, prog, rnd} from './anim';
import {Cutout, DrawPath, GrowLine, SText, Slab, Svg, Tag, Words, useCue, useScene} from './ui';
import {BrushIcon, CodeIcon, Cross, FigLabel, Franklin, GuitarIcon} from './figures';

/** opacity window helper: fades in at a, out at b */
const win = (f: number, a: number, b: number, fade = 8) => prog(f, a, fade) * (1 - prog(f, b, fade));

/* ============================================================ 1. HOOK (subs 0-3) */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t3 = cue(3);
  const shrink = prog(f, t3, 24, eInOut);
  const cards = [
    {i: 0, x: 1340, rot: -3, Icon: GuitarIcon, label: 'گیتار', accent: C.red, fill: 0.14},
    {i: 1, x: 910, rot: 2, Icon: CodeIcon, label: 'برنامه‌نویسی', accent: C.blue, fill: 0.08},
    {i: 2, x: 480, rot: -2, Icon: BrushIcon, label: 'نقاشی', accent: C.ink, fill: 0.2},
  ];
  const s0 = prog(f, 0, 30, eBack);
  return (
    <>
      <Svg>
        <circle cx={150} cy={1010} r={300 * s0} fill={C.red} />
        <rect x={1640} y={170} width={150 * s0} height={150 * s0} fill={C.blue} transform={`rotate(${12 + f * 0.1} 1715 245)`} />
        <GrowLine x1={72} y1={130} x2={1848} y2={130} at={4} dur={40} width={1.5} opacity={0.5} />
      </Svg>
      <FigLabel n="01" text="UNFINISHED" y={150} align="right" x={72} />
      <div style={{position: 'absolute', inset: 0, transformOrigin: '960px 150px', transform: `translateY(${-shrink * 20}px) scale(${1 - shrink * 0.3})`}}>
        {cards.map((c) => {
          const at = cue(c.i);
          return (
            <Cutout key={c.i} x={c.x} y={190} w={380} h={440} at={at} rot={c.rot}>
              <div style={{position: 'absolute', inset: 0, background: C.white}}>
                <div style={{height: 16, background: c.accent}} />
                <div style={{display: 'flex', justifyContent: 'center', marginTop: 34}}><c.Icon s={220} /></div>
                <div style={{textAlign: 'center', fontSize: 58, marginTop: 14, direction: 'rtl'}}>{c.label}</div>
                <div style={{margin: '16px 36px 0', height: 8, background: C.paper2}}>
                  <div style={{height: '100%', width: `${c.fill * 100 * prog(f, at + 6, 30)}%`, background: c.accent, marginLeft: 'auto'}} />
                </div>
                <svg viewBox="0 0 380 440" style={{position: 'absolute', inset: 0}}>
                  <DrawPath d="M70 120 L310 380" at={t3 + c.i * 6} dur={14} len={400} stroke={C.red} width={14} cap="butt" />
                  <DrawPath d="M310 120 L70 380" at={t3 + c.i * 6 + 8} dur={14} len={400} stroke={C.red} width={14} cap="butt" />
                </svg>
              </div>
            </Cutout>
          );
        })}
      </div>
      <div style={{position: 'absolute', right: 96, top: 600, width: 1728}}>
        <Words text="من چرا ~هیچ‌چیز رو *تموم نمی‌کنم؟" at={t3 + 4} size={128} lh={1.25} stagger={5} />
      </div>
    </>
  );
};

/* ============================================================ 2. PREMISE (subs 4-6) */
export const Premise: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const [t4, t5, t6] = [cue(4), cue(5), cue(6)];
  const dots = Array.from({length: 11}, (_, i) => ({x: 150 + rnd(i * 3 + 1) * 600, y: 220 + rnd(i * 3 + 2) * 560, r: 26 + rnd(i * 7) * 30}));
  const keep = [1, 4, 8];
  const scan = lerp(190, 800, prog(f, t5, 60, eInOut));
  return (
    <>
      <FigLabel n="02" text="MEASURE" y={150} align="left" x={72} />
      <Svg>
        {dots.map((d, i) => {
          const appear = prog(f, 6 + i * 3, 16, eBack);
          const scanned = d.y < scan && f > t5;
          const chosen = keep.includes(i) && f > t6;
          const dim = !keep.includes(i) && f > t6;
          return (
            <g key={i} opacity={dim ? 0.2 : 1}>
              <circle cx={d.x} cy={d.y} r={d.r * appear} fill={chosen ? C.red : scanned ? C.ink : C.gray} />
              {scanned && <circle cx={d.x} cy={d.y} r={d.r + 12} fill="none" stroke={C.ink} strokeWidth={2} />}
              {chosen && <path d={`M${d.x - 12} ${d.y} l9 10 l17 -20`} stroke={C.white} strokeWidth={6} fill="none" />}
            </g>
          );
        })}
        {f > t5 && f < t6 + 20 && <line x1={100} x2={820} y1={scan} y2={scan} stroke={C.blue} strokeWidth={4} />}
        <Cross x={100} y={190} /><Cross x={820} y={190} /><Cross x={100} y={800} /><Cross x={820} y={800} />
      </Svg>
      <div style={{position: 'absolute', right: 96, top: 180, width: 1000, display: 'flex', flexDirection: 'column', gap: 54}}>
        <Words text="شاید مشکل تو ~علاقه‌هات نیست" at={t4} size={92} />
        <Words text="شاید مشکل اینه که هیچ‌وقت *نسنجیدی" at={t5} size={92} />
        <Words text="کدومشون ^واقعا به دردت می‌خوره" at={t6} size={92} />
      </div>
    </>
  );
};

/* ============================================================ 3. AGENDA (subs 7-14) */
export const Agenda: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const seesawOn = win(f, t(8), t(11) + 10);
  const beam = Math.sin(prog(f, t(9), 60, eInOut) * Math.PI * 3) * 9 * (1 - prog(f, t(9), 80)) + (f > t(9) + 70 ? -7 : 0);
  const sq = [C.red, C.blue, C.ink, C.white];
  return (
    <>
      <FigLabel n="03" text="THE PLAN" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 90, fontSize: 420, lineHeight: 1, color: C.red, fontFamily: F.fa, overflow: 'hidden', padding: '40px 0', opacity: 1 - prog(f, t(12), 8)}}>
        <div style={{transform: `translateY(${(1 - prog(f, t(7), 22)) * 110}%)`}}>{toFa(3)}</div>
      </div>
      <div style={{position: 'absolute', right: 400, top: 200, opacity: 1 - prog(f, t(12), 8)}}>
        <Words text="معیار *ساده" at={t(7) + 4} size={104} />
      </div>
      <div style={{position: 'absolute', inset: 0, opacity: seesawOn}}>
        <Svg>
          <g transform={`translate(1220 640)`}>
            <path d="M0 0 L-60 110 L60 110Z" fill={C.ink} />
            <g transform={`rotate(${beam})`}>
              <rect x={-330} y={-8} width={660} height={16} fill={C.ink} />
              <circle cx={-300} cy={-60} r={52} fill={C.red} />
              <circle cx={300} cy={-60} r={52} fill={C.blue} />
            </g>
          </g>
          <SText x={920} y={580} at={t(9)} size={34} color={C.red}>زمین‌گیر</SText>
          <SText x={1520} y={580} at={t(9)} size={34} color={C.blue}>کمک</SText>
        </Svg>
        <div style={{position: 'absolute', right: 96, top: 330}}>
          <Words text="علاقه‌های زیادت" at={t(8)} size={54} color={C.mid} />
        </div>
      </div>
      <Cutout x={150} y={150} w={400} h={520} at={t(10)} from="l" rot={-2}><Franklin w={400} /></Cutout>
      <Tag text="بنجامین فرانکلین" at={t(10) + 10} x={180} y={730} fill={C.ink} size={34} align="left" />
      <div style={{opacity: 1 - prog(f, t(12), 8)}}><Tag text="همین هفته شروع کن" at={t(11)} x={620} y={560} fill={C.red} size={34} align="left" /></div>
      <Tag text="1706 – 1790" en at={t(10) + 16} x={200} y={800} align="left" />
      <div style={{position: 'absolute', inset: 0, opacity: prog(f, t(13), 10)}}>
        <Svg>
          {sq.map((c, i) => {
            const p = prog(f, t(13) + i * 5, 18, eBack);
            const x = 1560 - (i % 2) * 230;
            const y = 270 + Math.floor(i / 2) * 230;
            return (
              <g key={i} transform={`translate(${x + 100} ${y + 100}) scale(${p}) translate(-100 -100)`}>
                <rect width={200} height={200} fill={c} stroke={C.ink} strokeWidth={4} />
                <text x={100} y={130} textAnchor="middle" fontSize={96} fill={c === C.white ? C.ink : C.white} fontFamily={F.fa}>{toFa(i + 1)}</text>
              </g>
            );
          })}
        </Svg>
        <div style={{position: 'absolute', right: 96, top: 110}}><Words text="چهار مدل *کاری" at={t(13)} size={96} /></div>
        <div style={{position: 'absolute', right: 96, top: 740}}><Words text="مخصوص آدمای ~چندعلاقه‌ست" at={t(14)} size={52} /></div>
      </div>
    </>
  );
};

/* ============================================================ 4. WELCOME (subs 15-16) */
export const Welcome: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const p = prog(f, cue(15), 26, eInOut);
  return (
    <>
      <Svg>
        <circle cx={960} cy={440} r={560 * p} fill={C.red} />
        <circle cx={960} cy={440} r={540 * prog(f, cue(15) + 8, 26, eInOut)} fill={C.ink} />
      </Svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 130, textAlign: 'center', fontSize: 400, lineHeight: 1.1, color: C.paper, fontFamily: F.fa, overflow: 'hidden', padding: '30px 0'}}>
        <div style={{transform: `translateY(${(1 - prog(f, cue(15) + 14, 22)) * 110}%)`}}>سرک</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 630, display: 'flex', justifyContent: 'center'}}>
        <Words text="به سرک خوش اومدی" at={cue(15) + 20} size={64} align="center" color={C.paper} />
      </div>
      <Tag text="Sarak" en at={cue(15) + 28} x={880} y={570} color={C.paper} align="left" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 730, display: 'flex', justifyContent: 'center'}}>
        <Words text="بریم ~سراغش" at={cue(16)} size={56} align="center" color={C.paper} />
      </div>
    </>
  );
};

/* ============================================================ 5. PARADOX (subs 17-20) */
export const Paradox: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const lines = Array.from({length: 14}, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    return [1380 + Math.cos(a) * 520, 470 + Math.sin(a) * 330] as [number, number];
  });
  const circ = [[-70, -30, C.red], [70, -30, C.blue], [0, 70, C.ink]] as const;
  return (
    <>
      <FigLabel n="04" text="PARADOX" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 110}}><Words text="اینجا یه ~تناقض هست" at={t(17)} size={96} /></div>
      <Svg>
        <GrowLine x1={960} y1={250} x2={960} y2={830} at={t(17) + 10} dur={30} width={1.5} opacity={0.6} />
        {lines.map((l, i) => (
          <GrowLine key={i} x1={l[0]} y1={l[1]} x2={1380 + (l[0] - 1380) * 0.12} y2={470 + (l[1] - 470) * 0.12} at={t(18) + i * 1.5} dur={22} width={2} opacity={0.5} />
        ))}
        {[200, 130, 60].map((r, i) => (
          <circle key={r} cx={1380} cy={470} r={r * prog(f, t(18) + i * 4, 20, eBack)} fill={i === 2 ? C.red : 'none'} stroke={C.ink} strokeWidth={5} />
        ))}
        <g style={{mixBlendMode: 'multiply'}}>
          {circ.map(([dx, dy, c], i) => (
            <circle key={i} cx={470 + dx * 1.2} cy={470 + dy * 1.2 + (1 - prog(f, t(20) + i * 5, 24)) * 80} r={130 * prog(f, t(20) + i * 5, 24, eBack)} fill={c} opacity={0.85} />
          ))}
        </g>
      </Svg>
      <div style={{position: 'absolute', left: 1000, top: 680, width: 800, right: 120}}>
        <Words text="همه می‌گن روی یه چیز *تمرکز کن" at={t(18)} size={52} width={730} />
      </div>
      <div style={{position: 'absolute', left: 100, top: 660, width: 840}}>
        <Words text="با پیشرفت *هوش مصنوعی" at={t(19)} size={44} color={C.mid} width={840} />
        <Words text="مهارت‌های ~ترکیبی مهم می‌شن" at={t(20)} size={48} width={840} style={{marginTop: 54}} />
      </div>
    </>
  );
};

/* ============================================================ 6. STAT (subs 21-24, ink) */
export const Stat: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const pct = prog(f, t(23), 50, eInOut);
  const n = Math.round(39 * pct);
  return (
    <>
      <FigLabel n="05" text="WEF / FUTURE OF JOBS" color={C.paper} y={150} align="left" x={72} />
      <Svg>
        {Array.from({length: 100}, (_, i) => {
          const col = i % 10, row = Math.floor(i / 10);
          const filled = i < n;
          const appear = prog(f, t(22) + i * 0.4, 12, eBack);
          return <circle key={i} cx={760 - col * 58} cy={200 + row * 58} r={21 * appear} fill={filled ? C.red : 'none'} stroke={filled ? C.red : '#555'} strokeWidth={3} />;
        })}
      </Svg>
      <div style={{position: 'absolute', right: 96, top: 120}}><Words text="گزارش مجمع جهانی اقتصاد" at={t(21)} size={70} /></div>
      <div style={{position: 'absolute', right: 96, top: 215}}><Words text="درباره آینده مشاغل" at={t(21) + 8} size={48} color={C.gray} /></div>
      <div style={{position: 'absolute', right: 96, top: 290, fontSize: 190, lineHeight: 1.1, color: C.paper, opacity: prog(f, t(22), 14), transform: `translateY(${(1 - prog(f, t(22), 20)) * 40}px)`}}>
        {toFa(2030)}
      </div>
      <div style={{position: 'absolute', right: 96, top: 470, fontSize: 280, lineHeight: 1.1, color: C.red, opacity: prog(f, t(23), 8)}}>
        {toFa(n)}٪
      </div>
      <div style={{position: 'absolute', right: 96, top: 770}}>
        <Words text="مهارت‌های کلیدی شغل‌ها تغییر می‌کنه" at={t(24)} size={50} />
      </div>
    </>
  );
};

/* ============================================================ 7. COMBINE (subs 25-30) */
export const Combine: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const no = 1 - prog(f, t(27) - 6, 10);
  return (
    <>
      <FigLabel n="06" text="COMBINE" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 110}}>
        <Words text="باید همه‌چیز رو یاد بگیری؟" at={t(25)} size={72} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 180, textAlign: 'center', fontSize: 520, lineHeight: 1.1, color: C.red, opacity: no * prog(f, t(26), 6), transform: `scale(${0.6 + 0.4 * prog(f, t(26), 14, eBack)})`}}>
        نه
      </div>
      <Svg>
        {Array.from({length: 48}, (_, i) => {
          const col = i % 12, row = Math.floor(i / 12);
          const vis = prog(f, t(25) + i * 0.7, 10, eBack) * (1 - prog(f, t(26) + i * 0.3, 10));
          return <rect key={`b${i}`} x={1740 - col * 120} y={300 + row * 130} width={90} height={100 * vis} fill={i % 5 === 0 ? C.red : i % 7 === 0 ? C.blue : C.gray} stroke={C.ink} strokeWidth={2} opacity={vis} />;
        })}
        {Array.from({length: 10}, (_, i) => {
          const x = 1720 - (i % 5) * 130, y = 400 + Math.floor(i / 5) * 130;
          const p = prog(f, t(27) + i * 3, 16, eBack);
          const merge = prog(f, t(28) + 30, 40, eInOut);
          return (
            <g key={i} transform={`translate(${lerp(x, 520, merge)} ${lerp(y, 480, merge)}) scale(${p * (1 - merge * 0.7)})`} opacity={1 - merge * 0.95}>
              <circle r={48} fill="none" stroke={C.ink} strokeWidth={4} />
              <path d="M0 -48 A48 48 0 0 0 0 48Z" fill={i % 3 === 0 ? C.red : i % 3 === 1 ? C.blue : C.ink} />
            </g>
          );
        })}
        <g transform={`translate(520 480) rotate(${prog(f, t(28) + 40, 60, eInOut) * 45}) scale(${prog(f, t(28) + 50, 24, eBack)})`}>
          <rect x={-120} y={-120} width={240} height={240} fill={C.red} />
          <rect x={-80} y={-80} width={160} height={160} fill={C.blue} transform="rotate(45)" />
          <circle r={44} fill={C.paper} />
        </g>
        <GrowLine x1={1620} y1={720} x2={440} y2={720} at={t(30)} dur={30} width={3} />
        <path d={`M440 720 l22 -12 v24Z`} fill={C.ink} opacity={prog(f, t(30) + 25, 6)} />
        <path d={`M1620 720 l-22 -12 v24Z`} fill={C.ink} opacity={prog(f, t(30), 6)} />
        <SText x={1220} y={690} at={t(27) + 20} size={36} color={C.mid}>ده تا علاقه نیمه‌کاره</SText>
        <SText x={520} y={690} at={t(29)} size={36} color={C.red}>مهارت تازه و کمیاب</SText>
      </Svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 740, display: 'flex', justifyContent: 'center'}}>
        <Words text="یه دنیا *فاصله‌ست" at={t(30) + 10} size={48} align="center" />
      </div>
    </>
  );
};

/* ============================================================ 8. QUESTION (subs 31-34) */
export const Question: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const swing = Math.sin(prog(f, t(33), 120, eInOut) * Math.PI * 4) * 11 * (1 - prog(f, t(33), 140) * 0.5);
  return (
    <>
      <FigLabel n="07" text="THE QUESTION" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 110}}>
        <Words text="پس سؤال ~اصلی اینه" at={t(31)} size={78} />
      </div>
      <div style={{position: 'absolute', right: 96, top: 250, width: 900}}>
        <Words text="از کجا بفهمیم علاقه‌های زیادمون" at={t(32)} size={50} color={C.mid} />
      </div>
      <Svg>
        <g transform="translate(560 520)">
          <path d="M0 0 L-70 200 L70 200Z" fill={C.ink} />
          <g transform={`rotate(${swing})`} opacity={prog(f, t(32), 14)}>
            <rect x={-380} y={-8} width={760} height={16} fill={C.ink} />
            <rect x={-440} y={-120} width={120} height={112} fill={C.red} transform={`rotate(${-swing})  translate(60 0)`} />
            <circle cx={380} cy={-70} r={70} fill={C.blue} />
          </g>
        </g>
        <SText x={190} y={790} at={t(33)} size={44} color={C.red}>خراب‌کننده</SText>
        <SText x={940} y={790} at={t(34)} size={44} color={C.blue}>مزیت</SText>
      </Svg>
      <div style={{position: 'absolute', right: 96, top: 340, width: 900}}>
        <Words text="دارن ~پیشرفتمون رو خراب می‌کنن یا می‌تونن ^بزرگ‌ترین مزیتمون باشن؟" at={t(33)} size={74} />
      </div>
    </>
  );
};

/* ============================================================ 9. HALF LIFE (subs 35-41) */
export const HalfLife: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const fill = prog(f, t(35), t(38) - t(35), eInOut);
  const half = prog(f, t(38), 18, eBack);
  const phase2 = prog(f, t(39), 14);
  return (
    <>
      <FigLabel n="08" text="TIME" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 110, opacity: 1 - phase2}}>
        <Words text="هر بار که یه چیز جذاب پیدا می‌کنی…" at={t(35)} size={62} />
      </div>
      <Svg style={{opacity: 1 - phase2}}>
        {Array.from({length: 40}, (_, i) => {
          const col = i % 20, row = Math.floor(i / 20);
          const filled = i / 40 < fill;
          const gone = i >= 20 && half > 0;
          return <rect key={i} x={1780 - col * 82} y={380 + row * 150} width={70} height={110} fill={filled ? (i < 20 ? C.ink : gone ? C.red : C.ink) : 'none'} stroke={C.ink} strokeWidth={2} opacity={prog(f, t(35) + i * 0.6, 10)} />;
        })}
        <SText x={1000} y={330} at={t(36)} size={34} color={C.mid}>چند ماه بذاری تا بفهمی واقعا دوستش داری</SText>
        <rect x={140} y={540} width={1640 * half * 0.5} height={10} fill={C.red} transform={`translate(${1640 * (1 - half * 0.5)} 0)`} opacity={0} />
      </Svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 650, textAlign: 'center', fontSize: 100, color: C.red, opacity: win(f, t(38), t(39), 10)}}>
        {Math.round(half) ? 'نصف عمرت می‌ره' : ''}
      </div>
      <div style={{position: 'absolute', right: 96, top: 130, opacity: phase2}}>
        <Words text="به جای شمردن علاقه‌ها" at={t(39)} size={74} />
      </div>
      <div style={{position: 'absolute', right: 96, top: 260, opacity: phase2}}>
        <Words text="باید ببینی از هر کدوم ~چی به دست می‌اری" at={t(40)} size={74} width={1500} />
      </div>
      <Svg style={{opacity: phase2}}>
        {[0, 1, 2].map((i) => {
          const p = prog(f, t(40) + i * 8, 20, eBack);
          const x = 1460 - i * 440;
          return (
            <g key={i} transform={`translate(${x} 600) scale(${p})`}>
              <circle r={110} fill="none" stroke={C.ink} strokeWidth={4} />
              <path d="M-40 0 l28 30 l54 -64" stroke={i === 0 ? C.red : i === 1 ? C.blue : C.ink} strokeWidth={16} fill="none" strokeLinecap="round" />
            </g>
          );
        })}
      </Svg>
    </>
  );
};

/* ============================================================ 10. THREE (subs 42-43) */
export const Three: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  return (
    <>
      <FigLabel n="09" text="3 CRITERIA" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 120}}><Words text="و برای این کار" at={t(42)} size={56} color={C.mid} /></div>
      <div style={{position: 'absolute', right: 96, top: 210}}><Words text="سه تا ~معیار هست" at={t(43)} size={110} /></div>
      <Svg>
        {[0, 1, 2].map((i) => {
          const p = prog(f, t(43) + 8 + i * 8, 22, eBack);
          const col = [C.red, C.blue, C.ink][i];
          return (
            <g key={i} transform={`translate(${1500 - i * 480} 640) scale(${p})`}>
              <rect x={-200} y={-170} width={400} height={340} fill={col} />
              <text y={80} textAnchor="middle" fontSize={260} fill={C.white} fontFamily={F.fa}>{toFa(i + 1)}</text>
            </g>
          );
        })}
      </Svg>
    </>
  );
};
