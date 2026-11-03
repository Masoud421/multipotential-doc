import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, toFa} from './theme';
import {bezierPoint, eBack, eInOut, lerp, prog, rnd, win} from './anim';
import {Cutout, DrawPath, GrowLine, SText, Slab, Svg, Tag, Words, useCue} from './ui';
import {BrushIcon, CameraIcon, ClockIcon, CodeIcon, Cross, FigLabel, GuitarIcon, MusicIcon, PenIcon, ChartIcon, ThumbIcon, Halftone} from './figures';

const Big: React.FC<{n: number; at: number; color?: string}> = ({n, at, color = C.red}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', right: 96, top: 90, fontSize: 300, lineHeight: 1, color, overflow: 'hidden', padding: '30px 0'}}>
      <div style={{transform: `translateY(${(1 - prog(f, at, 22)) * 110}%)`}}>{toFa(n)}</div>
    </div>
  );
};

export const Typed: React.FC<{text: string; at: number; x: number; y: number; size?: number; color?: string; speed?: number}> = ({text, at, x, y, size = 44, color = C.ink, speed = 1.4}) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((f - at) / speed)));
  const blink = Math.floor(f / 10) % 2 === 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, fontFamily: F.mono, fontSize: size, letterSpacing: 4, color, direction: 'ltr', whiteSpace: 'nowrap'}}>
      {text.slice(0, n)}<span style={{opacity: blink && f >= at ? 1 : 0}}>▌</span>
    </div>
  );
};

/* ============================================================ C1 (44-46) */
export const C1: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const wave = Array.from({length: 40}, (_, i) => [220 + i * 18, 600 + Math.sin(i / 3) * 40 * Math.sin(i / 9 + 1)] as const);
  const d = 'M' + wave.map((p) => p.join(' ')).join(' L');
  return (
    <>
      <FigLabel n="10" text="CRITERION 01" y={150} align="left" x={72} />
      <Big n={1} at={t(44)} />
      <div style={{position: 'absolute', right: 380, top: 200}}><Words text="معیار *اول" at={t(44) + 4} size={110} /></div>
      <div style={{position: 'absolute', right: 96, top: 360, width: 1000}}><Words text="خود کار رو دوست داری" at={t(45)} size={70} /></div>
      {/* process panel (right) vs imagined result panel (left) */}
      <Svg>
        <rect x={1000} y={500} width={824} height={290} fill="none" stroke={C.ink} strokeWidth={3} />
        <SText x={1412} y={540} at={t(45) + 6} size={34} en color={C.mid}>PROCESS</SText>
        <g transform="translate(1100 560)">
          <DrawPath d="M0 150 C60 40 120 220 200 100 S320 20 380 140 S560 220 680 60" at={t(45) + 10} dur={60} len={1000} stroke={C.red} width={10} />
        </g>
        <rect x={100} y={500} width={824} height={290} fill="none" stroke={C.ink} strokeWidth={3} strokeDasharray="14 12" opacity={prog(f, t(46), 12)} />
        <SText x={512} y={540} at={t(46) + 4} size={34} en color={C.mid}>RESULT (IMAGINED)</SText>
        <g transform="translate(512 690)" opacity={prog(f, t(46) + 10, 16)}>
          <rect x={-120} y={20} width={80} height={60} fill={C.ink} /><rect x={-40} y={-30} width={80} height={110} fill={C.red} /><rect x={40} y={50} width={80} height={30} fill={C.blue} />
          <path d="M0 -90 l12 24 l26 4 l-19 18 l5 26 l-24 -13 l-24 13 l5 -26 l-19 -18 l26 -4Z" fill={C.ink} />
        </g>
      </Svg>
      <div style={{position: 'absolute', left: 100, top: 360, width: 820}}><Words text="یا فقط *نتیجه‌ای که ازش تصور می‌کنی؟" at={t(46)} size={60} /></div>
    </>
  );
};

/* ============================================================ NEWPORT (47-53) */
export const Newport: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const A = win(f, t(47), t(49));
  const B = win(f, t(49), t(51));
  const Cc = prog(f, t(51), 10);
  const sat = (x: number) => 1 / (1 + Math.exp(-9 * (x - 0.62)));
  const pts = Array.from({length: 41}, (_, i) => [180 + (i / 40) * 720, 700 - sat(i / 40) * 380] as const);
  const dots = pts.slice(0, 1 + Math.floor(prog(f, t(52), 60, eInOut) * 40));
  return (
    <>
      <FigLabel n="11" text="CAL NEWPORT" y={150} align="left" x={72} />
      <div style={{opacity: A}}>
        <Tag text="CAL NEWPORT" en at={t(47)} x={1824} y={130} />
        <div style={{position: 'absolute', right: 96, top: 200}}><Words text="کال نیوپورت" at={t(47) + 4} size={120} /></div>
        <div style={{position: 'absolute', right: 96, top: 350}}><Words text="نویسنده کتاب *کار عمیق" at={t(47) + 14} size={64} /></div>
        <div style={{position: 'absolute', right: 96, top: 480}}><Words text="یه کتاب دیگه داره که حرفش بحث‌برانگیزه" at={t(48)} size={52} color={C.mid} width={1000} /></div>
        <Cutout x={220} y={190} w={360} h={500} at={t(47)} from="l" rot={-3}>
          <div style={{position: 'absolute', inset: 0, background: C.ink}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 30, background: C.red}} />
            <div style={{position: 'absolute', top: 70, left: 60, right: 30, color: C.paper, fontSize: 70, lineHeight: 1.2, direction: 'rtl', textAlign: 'right'}}>کار<br />عمیق</div>
            <div style={{position: 'absolute', bottom: 40, left: 60, width: 120, height: 8, background: C.paper}} />
          </div>
        </Cutout>
      </div>
      <div style={{opacity: B}}>
        <Slab at={t(49)} x={96} y={420} w={1728} h={6} color={C.ink} dir="r" />
        <div style={{position: 'absolute', left: 96, top: 620, fontSize: 420, lineHeight: 1, color: C.red, fontFamily: F.serif, opacity: prog(f, t(50), 14)}}>”</div>
        <div style={{position: 'absolute', right: 96, top: 170, width: 1700}}>
          <Words text="«اونقدر خوب باش که نتونن نادیده‌ات بگیرن»" at={t(49)} size={92} lh={1.3} />
        </div>
        <div style={{position: 'absolute', right: 96, top: 520, width: 1700}}>
          <Words text="توصیه «دنبال علاقه‌ات برو» همیشه جواب نمی‌ده" at={t(50)} size={64} color={C.mid} />
        </div>
        <Svg><GrowLine x1={1820} y1={560} x2={470} y2={560} at={t(50) + 40} dur={14} stroke={C.red} width={8} /></Svg>
      </div>
      <div style={{opacity: Cc}}>
        <div style={{position: 'absolute', right: 96, top: 130}}><Words text="رضایت شغلی" at={t(51)} size={92} /></div>
        <div style={{position: 'absolute', right: 96, top: 250}}><Words text="بعد از ساختن مهارت ارزشمند ~می‌اد" at={t(52)} size={56} width={900} /></div>
        <div style={{position: 'absolute', right: 96, top: 440}}><Words text="نه *قبلش" at={t(53)} size={90} /></div>
        <Svg>
          <path d="M180 320 V700 H900" stroke={C.ink} strokeWidth={4} fill="none" />
          <SText x={540} y={760} at={t(51)} size={30} color={C.mid}>مهارت</SText>
          <SText x={120} y={300} at={t(51)} size={30} color={C.mid}>رضایت</SText>
          <path d={'M' + dots.map((p) => p.join(' ')).join(' L')} stroke={C.red} strokeWidth={10} fill="none" strokeLinecap="round" />
          <line x1={630} x2={630} y1={320} y2={700} stroke={C.blue} strokeWidth={3} strokeDasharray="10 8" opacity={prog(f, t(53), 12)} />
          <SText x={630} y={310} at={t(53)} size={30} color={C.blue}>بعد از مهارت</SText>
        </Svg>
      </div>
    </>
  );
};

/* ============================================================ REFRAME (54-56) */
export const Reframe: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  return (
    <>
      <FigLabel n="12" text="REFRAME" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 120, width: 1100}}><Words text="به جای دنبال *شغل ایده‌آل" at={t(54)} size={86} /></div>
      <div style={{position: 'absolute', right: 96, top: 290, width: 1100}}><Words text="ببین چطور توی کاری که الان داری" at={t(55)} size={56} color={C.mid} /></div>
      <div style={{position: 'absolute', right: 96, top: 380, width: 1100}}><Words text="~واقعا خوب بشی" at={t(56)} size={96} /></div>
      <Svg>
        {/* far-away ideal star (dashed) */}
        <g transform="translate(1500 640)" opacity={prog(f, t(54) + 10, 16)}>
          <path d="M0 -110 l26 54 l60 8 l-44 42 l11 60 l-53 -29 l-53 29 l11 -60 l-44 -42 l60 -8Z" fill="none" stroke={C.ink} strokeWidth={4} strokeDasharray="12 10" />
        </g>
        <GrowLine x1={1440} y1={760} x2={1560} y2={520} at={t(54) + 30} dur={12} stroke={C.red} width={10} />
        <GrowLine x1={1560} y1={760} x2={1440} y2={520} at={t(54) + 36} dur={12} stroke={C.red} width={10} />
        {/* stairs for current job */}
        {[0, 1, 2, 3, 4].map((i) => {
          const p = prog(f, t(56) + i * 6, 16, eBack);
          return <rect key={i} x={140 + i * 150} y={780 - (i + 1) * 90 * p} width={140} height={(i + 1) * 90 * p} fill={i === 4 ? C.red : C.ink} />;
        })}
        <SText x={440} y={830} at={t(55)} size={34} color={C.mid}>کاری که الان داری</SText>
      </Svg>
    </>
  );
};

/* ============================================================ EXPERIMENT (57-66) */
export const Experiment: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const vf = prog(f, t(58), 20, eInOut);
  const X = (a: number, b: number) => win(f, t(a), t(b));
  const corners = [[300, 200], [1060, 200], [300, 760], [1060, 760]];
  return (
    <>
      <FigLabel n="13" text="THE EXPERIMENT" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 110}}><Words text="یه آزمایش ~ساده" at={t(57)} size={92} /></div>
      {/* viewfinder */}
      <Svg>
        {corners.map(([x, y], i) => {
          const sx = i % 2 === 0 ? 1 : -1, sy = i < 2 ? 1 : -1;
          return <path key={i} d={`M${x} ${y + sy * 70} V${y} H${x + sx * 70}`} stroke={C.ink} strokeWidth={8} fill="none" opacity={vf} />;
        })}
        <circle cx={680} cy={480} r={9} fill={C.red} opacity={Math.floor(f / 15) % 2 === 0 ? 1 : 0.2} />
      </Svg>
      <div style={{position: 'absolute', left: 520, top: 340, opacity: X(58, 59)}}><CameraIcon s={320} /></div>
      <div style={{position: 'absolute', right: 96, top: 270, opacity: X(58, 61)}}>
        <Words text="فرض کن به ~عکاسی علاقه داری" at={t(58)} size={58} />
      </div>
      {/* videos pushed aside */}
      <div style={{opacity: X(59, 61)}}>
        {[0, 1, 2].map((i) => {
          const away = prog(f, t(60), 22, eInOut);
          return (
            <div key={i} style={{position: 'absolute', left: 420 + i * 230 - away * 260 * (i - 1) * 2 - away * 0, top: 360 + i * 20 + away * 280, width: 200, height: 130, background: C.ink, transform: `rotate(${(i - 1) * 6 * (1 + away * 3)}deg)`, opacity: 1 - away * 0.4}}>
              <div style={{position: 'absolute', left: 80, top: 38, borderLeft: `46px solid ${C.paper}`, borderTop: '28px solid transparent', borderBottom: '28px solid transparent'}} />
            </div>
          );
        })}
        <div style={{position: 'absolute', right: 96, top: 380}}><Words text="ویدیوهای آموزشی و پشت‌صحنه" at={t(59)} size={50} width={900} color={C.mid} /></div>
        <div style={{position: 'absolute', right: 96, top: 470}}><Words text="رو بذار ~کنار" at={t(60)} size={80} /></div>
      </div>
      {/* shoot a short set and edit */}
      <div style={{opacity: X(61, 63)}}>
        {[0, 1, 2].map((i) => (
          <Cutout key={i} x={420 + i * 240} y={330 + (i % 2) * 40} w={210} h={250} at={t(61) + i * 6} rot={(i - 1) * 5} from="b">
            <div style={{position: 'absolute', inset: 0, background: C.white}}>
              <div style={{position: 'absolute', inset: 14, bottom: 52, background: i === 1 ? C.gray : C.mid}}><div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: '38%', background: C.ink2, opacity: 0.6}} /></div>
            </div>
          </Cutout>
        ))}
        <div style={{position: 'absolute', right: 96, top: 380}}><Words text="یه مجموعه عکس کوتاه بگیر و ~ادیت کن" at={t(61)} size={64} width={900} /></div>
      </div>
      {/* the result is bad */}
      <div style={{opacity: X(63, 66)}}>
        <Cutout x={380} y={300} w={420} h={330} at={t(63)} rot={-5} from="t">
          <div style={{position: 'absolute', inset: 0, background: C.white}}>
            <svg viewBox="0 0 420 330" style={{position: 'absolute', inset: 0}}>
              <rect x={14} y={14} width={392} height={270} fill={C.ink2} />
              <g transform="rotate(-9 210 150)"><rect x={-40} y={170} width={500} height={160} fill={C.mid} /><line x1={-40} y1={170} x2={460} y2={170} stroke={C.paper} strokeWidth={3} /></g>
            </svg>
          </div>
        </Cutout>
        <div style={{position: 'absolute', left: 860, top: 330, opacity: prog(f, t(63) + 6, 8)}}><ClockIcon s={150} /></div>
        <div style={{position: 'absolute', right: 96, top: 250}}><Words text="نتیجه‌ش احتمالا ~افتضاحه" at={t(63)} size={86} /></div>
        <Tag text="نور خراب" at={t(64)} x={560} y={600} fill={C.red} size={40} align="right" />
        <Tag text="کادر کج" at={t(64) + 10} x={860} y={600} fill={C.blue} size={40} align="right" />
        <Tag text="ساعت‌ها گیر یه ادیت ساده" at={t(65)} x={560} y={690} fill={C.ink} size={40} align="right" />
      </div>
      <div style={{position: 'absolute', right: 96, top: 560, opacity: prog(f, t(66), 10)}}><Words text="آخر هفته از خودت ~بپرس" at={t(66)} size={100} /></div>
    </>
  );
};

/* ============================================================ VERDICT (67-73) */
export const Verdict: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const A = win(f, t(67), t(70));
  const B = prog(f, t(70), 10);
  return (
    <>
      <FigLabel n="14" text="THE VERDICT" y={150} align="left" x={72} />
      <div style={{opacity: A}}>
        <div style={{position: 'absolute', right: 96, top: 130, width: 1400}}><Words text="با اینکه سخت‌تر از چیزی بود که فکر می‌کردم" at={t(67)} size={62} color={C.mid} /></div>
        <div style={{position: 'absolute', right: 96, top: 300, width: 1500}}><Words text="هنوز دلم می‌خواد توش ~بهتر بشم؟" at={t(69)} size={124} lh={1.25} /></div>
        <Svg>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const p = prog(f, t(69) + 14 + i * 5, 16, eBack);
            return <rect key={i} x={1700 - i * 130} y={820 - (i + 1) * 30 * p} width={100} height={(i + 1) * 30 * p} fill={i === 5 ? C.red : C.ink} />;
          })}
        </Svg>
      </div>
      <div style={{opacity: B}}>
        <div style={{position: 'absolute', right: 96, top: 130}}><Words text="لازم نیست عاشق همه بخش‌هاش باشی" at={t(70)} size={64} width={1500} /></div>
        <Svg>
          {/* fork: watching vs doing */}
          <g opacity={prog(f, t(71), 14)}>
            <path d="M1000 420 V500 M1000 500 H1450 V560 M1000 500 H550 V560" stroke={C.ink} strokeWidth={4} fill="none" />
            <rect x={1300} y={560} width={300} height={200} fill="none" stroke={C.ink} strokeWidth={4} />
            <rect x={400} y={560} width={300} height={200} fill={C.ink} />
            <circle cx={1450} cy={660} r={44} fill={C.blue} />
            <path d="M1438 640 l36 20 l-36 20Z" fill={C.paper} />
            <path d="M500 700 l40 -60 l30 40 l-20 0 l40 60Z" fill={C.red} transform="translate(-6 0)" />
          </g>
          <SText x={1450} y={800} at={t(71) + 6} size={34} color={C.mid}>فقط دیدن زندگی عکاس‌ها</SText>
          <SText x={550} y={800} at={t(72)} size={34} color={C.red}>فرار از کار واقعی</SText>
        </Svg>
        <div style={{position: 'absolute', right: 96, top: 250}}><Words text="ولی اگه…" at={t(71)} size={60} color={C.mid} /></div>
      </div>
      <Slab at={t(73)} x={96} y={160} w={560} h={150} color={C.red} dir="l" />
      <div style={{position: 'absolute', left: 96, top: 170, width: 560, display: 'flex', justifyContent: 'center'}}><Words text="شاید *عجله نکن" at={t(73)} size={56} color={C.paper} align="center" hlColor={C.ink} /></div>
    </>
  );
};

/* ============================================================ C2 (74-78) */
export const C2: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  return (
    <>
      <FigLabel n="15" text="CRITERION 02" y={150} align="left" x={72} />
      <Big n={2} at={t(74)} color={C.blue} />
      <div style={{position: 'absolute', right: 380, top: 200}}><Words text="معیار *دوم" at={t(74) + 4} size={110} hlColor={C.blue} /></div>
      <div style={{position: 'absolute', right: 96, top: 360, width: 1100}}><Words text="علاقه‌هات به هم کمک می‌کنن؟" at={t(75)} size={74} /></div>
      <Cutout x={170} y={190} w={340} h={430} at={t(76)} from="l" rot={-3}>
        <svg viewBox="0 0 340 430" style={{position: 'absolute', inset: 0}}>
          <defs><Halftone id="wp" /></defs>
          <rect width={340} height={430} fill={C.paper2} />
          <circle cx={170} cy={150} r={80} fill={C.mid} /><path d="M20 430 C20 300 110 260 170 260 C230 260 320 300 320 430Z" fill={C.ink} />
          <rect width={340} height={430} fill="url(#wp)" opacity={0.25} />
          <path d="M120 100 C130 60 210 60 220 100" fill="none" stroke={C.ink} strokeWidth={14} />
        </svg>
      </Cutout>
      <Tag text="امیلی واپنیک" at={t(76) + 8} x={190} y={660} fill={C.blue} size={36} align="left" />
      <Tag text="TED TALK" en at={t(76) + 14} x={190} y={735} align="left" />
      <div style={{position: 'absolute', right: 96, top: 560, width: 1000}}>
        <Words text="به آدمایی که چند علاقه همزمان دارن می‌گه" at={t(77)} size={48} color={C.mid} />
      </div>
      <Typed text="MULTIPOTENTIALITE" at={t(78)} x={760} y={680} size={70} color={C.ink} />
      <Slab at={t(78) + 20} x={750} y={770} w={950} h={12} color={C.blue} dir="l" />
    </>
  );
};

/* ============================================================ C2 COMBINE (79-82) */
export const C2Combine: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const m = prog(f, t(81), 36, eInOut);
  const src = [[1500, 300, C.red], [1500, 520, C.blue], [1500, 740, C.ink]] as const;
  return (
    <>
      <FigLabel n="16" text="COMBINE" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 110}}><Words text="یکی از توانایی‌های مهم این آدما" at={t(79)} size={56} color={C.mid} width={1000} /></div>
      <div style={{position: 'absolute', right: 96, top: 210}}><Words text="~ترکیب کردنه" at={t(80)} size={130} /></div>
      <Svg>
        {src.map(([x, y, c], i) => {
          const p = prog(f, t(81) + i * 5, 16, eBack);
          const cx = lerp(x, 760, m), cy = lerp(y + 40, 560, m);
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={86 * p * (1 - m * 0.2)} fill={c} opacity={0.9} />
              <GrowLine x1={x - 100} y1={y + 40} x2={880} y2={560} at={t(81) + 20 + i * 4} dur={20} stroke={C.mid} width={2} dash="8 8" opacity={1 - m} />
            </g>
          );
        })}
        <g transform={`translate(760 560) scale(${prog(f, t(82), 20, eBack)})`}>
          <path d="M0 -150 l34 90 l96 6 l-74 62 l24 94 l-80 -52 l-80 52 l24 -94 l-74 -62 l96 -6Z" fill={C.red} stroke={C.ink} strokeWidth={6} />
        </g>
        <SText x={1480} y={420} at={t(81)} size={32} color={C.mid} anchor="end">{''}</SText>
      </Svg>
      <div style={{position: 'absolute', right: 96, top: 590, width: 700, opacity: prog(f, t(81), 10)}}><Words text="دانش چند حوزه رو برمی‌دارن" at={t(81)} size={46} width={700} /></div>
      <div style={{position: 'absolute', left: 96, top: 780, opacity: prog(f, t(82), 10), width: 1400}}><Words text="و یه چیز ~تازه می‌سازن" at={t(82)} size={72} /></div>
    </>
  );
};

/* ============================================================ APP (83-89) */
export const AppScene: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const icons = [{I: MusicIcon, n: 'موسیقی'}, {I: CodeIcon, n: 'برنامه‌نویسی'}, {I: PenIcon, n: 'طراحی'}];
  const spin = prog(f, t(88), 60, eInOut) * 360;
  return (
    <>
      <FigLabel n="17" text="A SMALL APP" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 120, width: 900}}><Words text="موسیقی، برنامه‌نویسی و طراحی" at={t(83)} size={64} /></div>
      {icons.map((c, i) => (
        <Cutout key={i} x={1560 - 0} y={270 + i * 190} w={180} h={170} at={t(83) + i * 24} from="r" rot={(i - 1) * 3}>
          <div style={{position: 'absolute', inset: 0, background: C.white, display: 'flex', justifyContent: 'center', alignItems: 'center'}}><c.I s={120} /></div>
        </Cutout>
      ))}
      {icons.map((c, i) => (
        <div key={`l${i}`} style={{position: 'absolute', right: 380, top: 330 + i * 190, opacity: prog(f, t(83) + i * 24 + 10, 10), fontSize: 38, color: C.mid}}>{c.n}</div>
      ))}
      <Svg>
        {[0, 1, 2].map((i) => (
          <GrowLine key={i} x1={1500} y1={355 + i * 190} x2={1080} y2={500} at={t(86) + i * 6} dur={20} stroke={C.red} width={3} />
        ))}
        {/* phone */}
        <g opacity={prog(f, t(85), 14)} transform={`translate(${lerp(120, 0, prog(f, t(85), 20))} 0)`}>
          <rect x={720} y={190} width={360} height={620} rx={44} fill={C.ink} />
          <rect x={742} y={230} width={316} height={540} rx={16} fill={C.paper} />
          {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={770} x2={1030} y1={330 + i * 26} y2={330 + i * 26} stroke={C.ink} strokeWidth={2} />)}
          {[0, 1, 2, 3, 4, 5].map((i) => <ellipse key={i} cx={800 + i * 40} cy={330 + [2, 0, 3, 1, 4, 2][i] * 13} rx={11} ry={8} fill={i % 2 ? C.blue : C.red} />)}
          <rect x={770} y={520} width={260} height={50} fill={C.red} /><rect x={770} y={590} width={260} height={50} fill={C.ink} /><rect x={770} y={660} width={260} height={50} fill={C.blue} />
        </g>
        <g transform="translate(400 500)" opacity={prog(f, t(88), 10)}>
          <g transform={`rotate(${spin})`}>
            {[0, 1, 2].map((i) => {
              const a = (i * 2 * Math.PI) / 3;
              return <circle key={i} cx={Math.cos(a) * 110} cy={Math.sin(a) * 110} r={34} fill={[C.red, C.blue, C.ink][i]} />;
            })}
            <circle r={110} fill="none" stroke={C.ink} strokeWidth={3} strokeDasharray="14 10" />
          </g>
        </g>
      </Svg>
      <div style={{position: 'absolute', left: 120, top: 700, width: 520}}><Words text="هر کدوم اون یکی رو ~بهتر می‌کنه" at={t(88)} size={46} width={560} /></div>
      <div style={{position: 'absolute', right: 96, top: 800 - 30, display: 'none'}} />
    </>
  );
};

/* ============================================================ HOPPING (90-98) */
export const Hopping: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const stops = [
    {I: CodeIcon, x: 1500, y: 330, at: 91, n: 'کدنویسی'},
    {I: GuitarIcon, x: 1120, y: 560, at: 92, n: 'گیتار'},
    {I: BrushIcon, x: 740, y: 330, at: 93, n: 'نقاشی'},
    {I: ChartIcon, x: 360, y: 560, at: 94, n: 'بورس'},
  ];
  const drop = prog(f, t(95), 80);
  return (
    <>
      <FigLabel n="18" text="HOPPING" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 110}}><Words text="ولی یه حالت ~دیگه هم هست" at={t(90)} size={80} /></div>
      {stops.map((s, i) => (
        <div key={i} style={{position: 'absolute', left: s.x - 70, top: s.y - 70 + prog(f, t(s.at), 18, eBack) * 0 + (1 - prog(f, t(s.at), 18, eBack)) * -40, opacity: prog(f, t(s.at), 12) * (1 - drop * 0.35), transform: `rotate(${drop * (i % 2 ? 14 : -14)}deg)`}}>
          <s.I s={140} />
          <div style={{textAlign: 'center', fontSize: 34, marginTop: 8}}>{s.n}</div>
        </div>
      ))}
      <Svg>
        {stops.slice(0, 3).map((s, i) => {
          const n = stops[i + 1];
          return <path key={i} d={`M${s.x - 70} ${s.y} Q${(s.x + n.x) / 2} ${s.y - 130} ${n.x + 70} ${n.y}`} stroke={C.ink} strokeWidth={3} strokeDasharray="10 10" fill="none" opacity={prog(f, t(n.at), 8)} />;
        })}
        {/* nothing is carried over: falling crumbs */}
        {Array.from({length: 24}, (_, i) => (
          <rect key={i} x={260 + rnd(i) * 1300} y={720 + drop * 80 * rnd(i + 40) - (1 - drop) * 20} width={18} height={18} fill={i % 3 === 0 ? C.red : C.gray} opacity={drop} transform={`rotate(${rnd(i + 9) * 90} ${260 + rnd(i) * 1300} 740)`} />
        ))}
      </Svg>
      <div style={{position: 'absolute', right: 96, top: 700, opacity: prog(f, t(95), 12)}}><Words text="هر بار همه‌چیز رو ~ول می‌کنی" at={t(95)} size={62} /></div>
      <div style={{position: 'absolute', left: 96, top: 710, opacity: prog(f, t(98), 12)}}><Words text="یه جای کار می‌لنگه" at={t(98)} size={50} color={C.red} /></div>
    </>
  );
};

/* ============================================================ EXERCISE (99-106) */
export const Exercise: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  return (
    <>
      <FigLabel n="19" text="EXERCISE" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 110}}><Words text="تمرینش ~ساده‌ست" at={t(99)} size={92} /></div>
      <Cutout x={1130} y={430} w={600} h={380} at={t(100)} from="r" rot={2}>
        <div style={{position: 'absolute', inset: 0, background: C.white}}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{position: 'absolute', right: 40, top: 40 + i * 110, display: 'flex', alignItems: 'center', gap: 22, direction: 'rtl', opacity: prog(f, t(101) + i * 10, 12)}}>
              <div style={{width: 62, height: 62, borderRadius: 31, background: [C.red, C.blue, C.ink][i], color: C.white, fontSize: 40, textAlign: 'center', lineHeight: '66px'}}>{toFa(i + 1)}</div>
              <div style={{width: 360 * prog(f, t(101) + i * 10 + 4, 24), height: 10, background: C.ink, opacity: 0.8}} />
            </div>
          ))}
        </div>
      </Cutout>
      <div style={{position: 'absolute', right: 96, top: 250, width: 960, opacity: 0}}>.</div>
      <div style={{position: 'absolute', right: 96, top: 250}}><Words text="یه کاغذ بردار" at={t(100)} size={52} color={C.mid} /></div>
      <div style={{position: 'absolute', right: 96, top: 330}}><Words text="سه تا علاقه اصلیت رو بنویس" at={t(100) + 8} size={46} width={640} /></div>
      <Svg>
        <rect x={180} y={430} width={420} height={270} fill={C.red} opacity={prog(f, t(102), 12)} />
        <text x={390} y={590} textAnchor="middle" fontSize={84} fill={C.white} opacity={prog(f, t(102), 12)} fontFamily={F.fa}>پروژه</text>
        <GrowLine x1={1160} y1={490} x2={600} y2={530} at={t(103)} dur={18} stroke={C.red} width={5} />
        <GrowLine x1={1160} y1={710} x2={600} y2={620} at={t(103) + 10} dur={18} stroke={C.ink} width={5} dash="10 10" opacity={0.25} />
        <GrowLine x1={1160} y1={600} x2={600} y2={580} at={t(103) + 6} dur={18} stroke={C.blue} width={5} />
        {/* coin crossed out */}
        <g transform="translate(260 790) scale(0.8)" opacity={prog(f, t(104), 12)}>
          <circle r={60} fill="none" stroke={C.ink} strokeWidth={8} /><text textAnchor="middle" y={22} fontSize={64} fill={C.ink} fontFamily={F.mono}>$</text>
          <DrawPath d="M-70 -70 L70 70" at={t(104) + 10} dur={14} len={200} stroke={C.red} width={12} />
        </g>
      </Svg>
      <div style={{position: 'absolute', left: 120, top: 220, width: 800}}><Words text="یه پروژه کوچیک که حداقل دوتاشون توش به کار بیاد" at={t(102)} size={48} width={820} /></div>
      <div style={{position: 'absolute', left: 360, top: 750, width: 700}}><Words text="لازم نیست ~پولساز باشه" at={t(104)} size={50} width={700} /></div>
    </>
  );
};

/* ============================================================ CTA 1 (107-113) */
export const Cta1: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const A = win(f, t(107), t(109));
  const B = win(f, t(109), t(112));
  const Cc = prog(f, t(112), 10);
  const nodes = Array.from({length: 22}, (_, i) => ({a: (i / 22) * Math.PI * 2 + rnd(i) * 0.4, r: 200 + rnd(i + 5) * 220}));
  return (
    <>
      <FigLabel n="20" text="BREAK" y={150} align="left" x={72} />
      <div style={{opacity: A}}>
        <div style={{position: 'absolute', right: 96, top: 170, width: 1600}}><Words text="اگه حس کردی دارم درباره ~خودت حرف می‌زنم" at={t(107)} size={110} lh={1.25} /></div>
        <Svg><circle cx={440} cy={600} r={80 * prog(f, t(108), 20, eBack)} fill={C.ink} /><path d="M280 820 C280 700 360 680 440 680 C520 680 600 700 600 820Z" fill={C.ink} opacity={prog(f, t(108), 12)} /></Svg>
      </div>
      <div style={{opacity: B}}>
        <Svg>
          <g transform="translate(1280 480)">
            {nodes.map((n, i) => {
              const p = prog(f, t(110) + i * 2, 18, eBack);
              return <g key={i}><line x1={0} y1={0} x2={Math.cos(n.a) * n.r * p} y2={Math.sin(n.a) * n.r * p} stroke={C.mid} strokeWidth={2} /><circle cx={Math.cos(n.a) * n.r * p} cy={Math.sin(n.a) * n.r * p} r={13} fill={i % 4 === 0 ? C.red : i % 4 === 1 ? C.blue : C.ink} /></g>;
            })}
            <circle r={110} fill={C.red} transform={`scale(${1 + Math.sin(f / 6) * 0.04})`} />
          </g>
        </Svg>
        <div style={{position: 'absolute', left: 1280 - 70, top: 480 - 70}}><ThumbIcon s={140} ink={C.paper} accent={C.ink} /></div>
        <div style={{position: 'absolute', left: 120, top: 200}}><Words text="لایک رو *بزن" at={t(109)} size={100} /></div>
        <div style={{position: 'absolute', left: 120, top: 360, width: 560}}><Words text="تا این ویدیو به آدمای پرعلاقه‌ی دیگه هم برسه" at={t(110)} size={46} width={560} color={C.mid} /></div>
      </div>
      <div style={{opacity: Cc}}>
        <div style={{position: 'absolute', right: 96, top: 120}}><Words text="و بمون" at={t(112)} size={100} /></div>
        <div style={{position: 'absolute', right: 96, top: 260, width: 1000}}><Words text="چون معیار سوم از همه سخت‌تره" at={t(112) + 6} size={64} /></div>
        <Svg>
          {[0, 1, 2].map((i) => {
            const p = prog(f, t(112) + 10 + i * 8, 20, eBack);
            const hard = i === 2;
            return (
              <g key={i} transform={`translate(${1560 - i * 330} 620) scale(${p})`}>
                <rect x={-130} y={-130} width={260} height={260} fill={hard ? C.red : C.gray} />
                <text y={60} textAnchor="middle" fontSize={190} fill={hard ? C.white : C.mid} fontFamily={F.fa}>{toFa(i + 1)}</text>
              </g>
            );
          })}
        </Svg>
        <div style={{position: 'absolute', left: 120, top: 560, width: 900}}><Words text="بیشتر آدما دقیقا همین‌جا ~گیر می‌کنن" at={t(113)} size={60} width={760} /></div>
      </div>
    </>
  );
};
