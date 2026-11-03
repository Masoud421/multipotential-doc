import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, toFa} from './theme';
import {bezierPoint, eBack, eInOut, lerp, prog, rnd, win} from './anim';
import {Cutout, DrawPath, GrowLine, SText, Slab, Svg, Tag, Words, useCue} from './ui';
import {Cross, FigLabel, Franklin, NotebookIcon, ThumbIcon} from './figures';
import {Mark, Print, TIcon} from './assets';

const Big: React.FC<{n: number; at: number; color?: string}> = ({n, at, color = C.red}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', right: 96, top: 90, fontSize: 300, lineHeight: 1, color, overflow: 'hidden', padding: '30px 0'}}>
      <div style={{transform: `translateY(${(1 - prog(f, at, 22)) * 110}%)`}}>{toFa(n)}</div>
    </div>
  );
};

type P2 = [number, number];
const SEG1: [P2, P2, P2, P2] = [[140, 380], [360, 360], [420, 720], [620, 730]];
const SEG2: [P2, P2, P2, P2] = [[620, 730], [820, 740], [900, 420], [1120, 300]];
const dipPoint = (p: number): P2 => (p < 1 ? bezierPoint(...SEG1, p) : bezierPoint(...SEG2, Math.min(1, p - 1)));
const DIP_PATH = `M${SEG1[0].join(' ')} C${SEG1[1].join(' ')} ${SEG1[2].join(' ')} ${SEG1[3].join(' ')} C${SEG2[1].join(' ')} ${SEG2[2].join(' ')} ${SEG2[3].join(' ')}`;

/* ============================================================ DIP (114-122) */
export const Dip: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const travel = prog(f, t(115), t(118) - t(115) + 30, eInOut) * 1 + prog(f, t(121), 70, eInOut);
  const [dx, dy] = dipPoint(Math.min(2, travel));
  return (
    <>
      <FigLabel n="21" text="THE DIP" y={150} align="left" x={72} />
      <Big n={3} at={t(114)} />
      <div style={{position: 'absolute', right: 340, top: 190}}><Words text="معیار *سوم" at={t(114) + 4} size={104} hlColor={C.ink} /></div>
      <div style={{position: 'absolute', right: 96, top: 340, width: 800}}><Words text="وقتی هیجان اولیه تموم می‌شه چه اتفاقی می‌فته؟" at={t(115)} size={54} width={780} /></div>
      <Svg>
        <path d="M120 790 H1140 M120 790 V260" stroke={C.ink} strokeWidth={3} fill="none" />
        <rect x={430} y={540} width={400} height={250} fill={C.red} opacity={0.14 * prog(f, t(118), 20)} />
        <DrawPath d={DIP_PATH} at={t(115)} dur={t(118) - t(115) + 30} len={1800} stroke={C.ink} width={8} />
        <circle cx={dx} cy={dy} r={20} fill={C.red} opacity={prog(f, t(115), 6)} />
        <SText x={190} y={340} at={t(115) + 10} size={30} color={C.mid} anchor="start">هیجان اولیه</SText>
        <SText x={630} y={830} at={t(120)} size={52} color={C.red}>شیب</SText>
        <SText x={1090} y={270} at={t(122)} size={30} color={C.blue} anchor="end">پاداش</SText>
        <SText x={120} y={240} at={t(115)} size={22} en color={C.mid} anchor="start">ENERGY</SText>
        <SText x={1140} y={826} at={t(115)} size={22} en color={C.mid} anchor="end">TIME</SText>
      </Svg>
      <Tag text="ست گادین · کتاب شیب" at={t(117)} x={1824} y={560} size={36} fill={C.ink} />
      <div style={{position: 'absolute', right: 96, top: 640, width: 800}}><Words text="دوره‌ای که پیشرفت کند می‌شه" at={t(118)} size={46} color={C.mid} width={780} /></div>
      <div style={{position: 'absolute', right: 96, top: 710, width: 800}}><Words text="باید آگاهانه ازش ~رد بشی" at={t(122)} size={56} width={780} /></div>
    </>
  );
};

/* ============================================================ JUMP (123-128) */
export const Jump: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const tracks = [250, 480, 710];
  const hop = (k: number) => prog(f, t(127) + k * 16, 14, eInOut);
  const px = (x: number, y: number) => ({x, y});
  const place = (k: number) => {
    // dot sits at the dip start of track k, then jumps to the next track's start
    const from = [520, tracks[k] + 40], to = [520, tracks[Math.min(2, k + 1)] + 40];
    return [from[0], lerp(from[1], to[1], hop(k)) - Math.sin(hop(k) * Math.PI) * 90] as [number, number];
  };
  const dot = hop(1) > 0 ? place(1) : place(0);
  return (
    <>
      <FigLabel n="22" text="JUMPING" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 110, width: 900}}><Words text="اینجا برای آدم چندعلاقه ~خطرناکه" at={t(123)} size={72} /></div>
      <Svg>
        {tracks.map((y, k) => {
          const d = `M140 ${y} C320 ${y - 10} 380 ${y + 80} 520 ${y + 80} S760 ${y - 40} 900 ${y - 60}`;
          return (
            <g key={k}>
              <DrawPath d={d} at={t(124) + k * 10} dur={26} len={900} stroke={[C.ink, C.blue, C.mid][k]} width={7} />
              <circle cx={140} cy={y} r={8} fill={C.ink} opacity={prog(f, t(124) + k * 10, 6)} />
              <SText x={920} y={y - 56} at={t(125) + k * 8} size={28} color={C.mid} anchor="start">{['', 'علاقه جدید', 'یکی دیگه'][k]}</SText>
            </g>
          );
        })}
        <circle cx={dot[0]} cy={dot[1]} r={20} fill={C.red} opacity={prog(f, t(124) + 30, 8)} />
        {[0, 1].map((k) => (
          <path key={k} d={`M520 ${tracks[k] + 40} Q440 ${(tracks[k] + tracks[k + 1]) / 2 + 40} 520 ${tracks[k + 1] + 40}`} stroke={C.red} strokeWidth={3} strokeDasharray="8 8" fill="none" opacity={hop(k)} />
        ))}
      </Svg>
      <div style={{position: 'absolute', right: 96, top: 260, width: 800}}><Words text="هر بار یادگیری سخت می‌شه یه علاقه جدید کنارش منتظره" at={t(124)} size={46} width={780} color={C.mid} /></div>
      <div style={{position: 'absolute', right: 96, top: 430, width: 800}}><Words text="که هنوز قسمت سختش رو ندیدی" at={t(126)} size={46} width={780} /></div>
      <div style={{position: 'absolute', right: 96, top: 540}}><Words text="و تو ~می‌پری" at={t(127)} size={110} /></div>
      <div style={{position: 'absolute', right: 96, top: 700}}><Words text="شاخه به شاخه" at={t(128)} size={64} color={C.red} width={800} /></div>
    </>
  );
};

/* ============================================================ TWO QUESTIONS (129-133) */
export const TwoQ: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const card = (n: number, at: number, x: number, color: string, children: React.ReactNode) => (
    <Cutout x={x} y={290} w={760} h={480} at={at} from="b" rot={n === 1 ? 1.5 : -1.5}>
      <div style={{position: 'absolute', inset: 0, background: C.white}}>
        <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: 150, background: color, color: C.white, fontSize: 160, textAlign: 'center', lineHeight: '230px'}}>{toFa(n)}</div>
        {children}
      </div>
    </Cutout>
  );
  return (
    <>
      <FigLabel n="23" text="TWO QUESTIONS" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 110}}><Words text="برای تشخیص، از خودت ~دو تا سؤال بپرس" at={t(129)} size={72} width={1500} /></div>
      {card(1, t(130), 1000, C.red, (
        <div style={{position: 'absolute', right: 180, top: 60, width: 520, direction: 'rtl'}}>
          <Words text="توی این مسیر چیز جدیدی یاد گرفتم، حتی اگه کند؟" at={t(130) + 6} size={50} width={520} />
        </div>
      ))}
      {card(2, t(132), 120, C.blue, (
        <div style={{position: 'absolute', right: 180, top: 50, width: 520, direction: 'rtl'}}>
          <Words text="دلیل مشخصی برای کنار گذاشتنش دارم؟" at={t(132) + 6} size={50} width={520} />
          <div style={{marginTop: 24, opacity: prog(f, t(133), 10), color: C.mid}}><Words text="یا فقط از سخت شدنش خسته شدم؟" at={t(133)} size={44} width={520} color={C.mid} /></div>
        </div>
      ))}
    </>
  );
};

/* ============================================================ RULE (134-140) */
export const Rule: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const A = win(f, t(134), t(138));
  const B = prog(f, t(138), 10);
  const weeks = Array.from({length: 13}, (_, i) => i);
  const prof = (i: number) => (i < 8 ? 80 + i * 36 : 80 + 8 * 36 + (i - 8) * 8);
  return (
    <>
      <FigLabel n="24" text="THE RULE" y={150} align="left" x={72} />
      <div style={{opacity: A}}>
        <div style={{position: 'absolute', right: 96, top: 110}}><Words text="ساده بگم" at={t(134)} size={64} color={C.mid} /></div>
        <div style={{position: 'absolute', right: 96, top: 210, width: 1500}}><Words text="سه ماهه روی یه مهارت کار می‌کنی و پیشرفتت ~کند شده" at={t(135)} size={72} width={1500} /></div>
        <Svg>
          {weeks.map((i) => {
            const h = prof(i) * 1.3 * prog(f, t(135) + i * 3, 14, eBack);
            return <rect key={i} x={1700 - i * 118} y={780 - h} width={96} height={h} fill={i > 8 ? C.red : C.ink} />;
          })}
          <SText x={1700} y={830} at={t(135)} size={28} color={C.mid} anchor="end">هفته ۱</SText>
          <SText x={290} y={830} at={t(136)} size={28} color={C.mid} anchor="start">هفته ۱۳</SText>
        </Svg>
        <div style={{position: 'absolute', left: 120, top: 520}}><Words text="دلیل خوبی برای ول کردن نیست" at={t(137)} size={50} color={C.red} width={700} /></div>
      </div>
      <div style={{opacity: B}}>
        <div style={{position: 'absolute', right: 96, top: 120, width: 1600}}><Words text="ولی اگه بعد از تجربه واقعی دیدی" at={t(138)} size={58} color={C.mid} width={1600} /></div>
        <div style={{position: 'absolute', right: 96, top: 230, width: 1600}}><Words text="این کار با شرایط و هدفت جور نیست" at={t(139)} size={78} width={1600} /></div>
        <div style={{position: 'absolute', right: 96, top: 440, width: 1700}}><Words text="کنار گذاشتنش *شکست نیست" at={t(140)} size={126} width={1700} /></div>
        <Svg><DrawPath d="M1000 520 L1680 520" at={t(140) + 36} dur={16} len={700} stroke={C.red} width={10} /></Svg>
      </div>
    </>
  );
};

/* ============================================================ RECAP (141-146) */
export const Recap: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const rows = [
    {n: 1, at: 142, text: 'خود فرآیند رو دوست داری یا فقط نتیجه‌ش رو؟', c: C.red},
    {n: 2, at: 144, text: 'علاقه‌هات به هم کمک می‌کنن؟', c: C.blue},
    {n: 3, at: 145, text: 'وقتی توی شیب افتادی، دلیل ادامه دادنت چیه؟', c: C.ink},
  ];
  return (
    <>
      <FigLabel n="25" text="RECAP" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 110}}><Words text="پس سه تا ~معیار داریم" at={t(141)} size={92} /></div>
      {rows.map((r, i) => (
        <div key={i}>
          <Slab at={t(r.at)} x={96} y={290 + i * 190} w={1728} h={160} color={C.white} dir="r" />
          <Slab at={t(r.at)} x={1664} y={290 + i * 190} w={160} h={160} color={r.c} dir="r" />
          <div style={{position: 'absolute', right: 1664 - 1664 + 96 + 0, top: 290 + i * 190, width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontSize: 130, opacity: prog(f, t(r.at) + 8, 8)}}>{toFa(r.n)}</div>
          <div style={{position: 'absolute', right: 300, top: 290 + i * 190 + 30, width: 1400}}><Words text={r.text} at={t(r.at) + 6} size={62} width={1360} /></div>
        </div>
      ))}
    </>
  );
};

/* ============================================================ GAP (147-157) */
export const Gap: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const A = win(f, t(147), t(154));
  const B = win(f, t(154), t(156));
  const Cc = prog(f, t(156), 10);
  const bubbles = ['حرف زدن', 'منبع معرفی کردن', 'ساعت‌ها بحث', 'فکر می‌کنم بلدم'];
  return (
    <>
      <FigLabel n="26" text="KNOWING VS DOING" y={150} align="left" x={72} />
      <div style={{opacity: A}}>
        <div style={{position: 'absolute', right: 96, top: 110}}><Words text="ولی یه چیز هنوز ~مونده" at={t(147)} size={92} /></div>
        {bubbles.map((b, i) => (
          <Cutout key={i} x={1180 - (i % 2) * 560 + 60} y={330 + Math.floor(i / 2) * 190} w={460} h={140} at={t(148) + i * 24} from="b" rot={(i % 2 ? 2 : -2)}>
            <div style={{position: 'absolute', inset: 0, background: i === 3 ? C.red : C.white, color: i === 3 ? C.white : C.ink, fontSize: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl'}}>{b}</div>
          </Cutout>
        ))}
        <div style={{position: 'absolute', right: 96, top: 740, opacity: prog(f, t(152), 10)}}><Words text="در حالی که یه بار هم دست به کار ~نشدن" at={t(152)} size={56} /></div>
      </div>
      <div style={{opacity: B}}>
        <Svg>
          <rect x={1300} y={330} width={300} height={440} fill="none" stroke={C.ink} strokeWidth={4} strokeDasharray="12 10" />
          <rect x={1300} y={770 - 360 * prog(f, t(154), 20)} width={300} height={360 * prog(f, t(154), 20)} fill={C.ink} opacity={0.15} />
          <rect x={640} y={730} width={300} height={40} fill={C.red} />
          <GrowLine x1={1000} y1={730} x2={1000} y2={420} at={t(155)} dur={20} stroke={C.red} width={6} />
          <path d="M980 450 L1000 410 L1020 450Z" fill={C.red} opacity={prog(f, t(155) + 16, 4)} />
          <SText x={1450} y={820} at={t(154)} size={34} color={C.mid}>فکر می‌کنم بلدم</SText>
          <SText x={790} y={820} at={t(155)} size={34} color={C.red}>واقعا بلدم</SText>
        </Svg>
        <div style={{position: 'absolute', right: 96, top: 120, width: 1500}}><Words text="بین «فکر می‌کنم بلدم» و «واقعا بلدم»" at={t(154)} size={64} width={1500} /></div>
        <div style={{position: 'absolute', left: 96, top: 330, width: 520}}><Words text="یه دنیا *فاصله‌ست" at={t(155) + 10} size={78} width={520} /></div>
      </div>
      <div style={{opacity: Cc}}>
        <div style={{position: 'absolute', right: 96, top: 120, width: 1600}}><Words text="برای کسی که همین‌طور بین علاقه‌ها می‌چرخه" at={t(156)} size={60} color={C.mid} width={1600} /></div>
        <div style={{position: 'absolute', right: 96, top: 270, width: 1600}}><Words text="بهترین الگو ~کیه؟" at={t(157)} size={170} width={1600} /></div>
        <Svg>{[0, 1, 2, 3, 4, 5, 6].map((i) => <circle key={i} cx={1700 - i * 250} cy={700} r={26 * prog(f, t(157) + 6 + i * 4, 14, eBack)} fill={[C.red, C.blue, C.ink][i % 3]} />)}</Svg>
      </div>
    </>
  );
};

/* ============================================================ FRANKLIN (158-171) */
export const FranklinScene: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const roles = [
    {n: 'نویسنده', at: 163}, {n: 'چاپ‌کننده', at: 163.5}, {n: 'طنزنویس', at: 164}, {n: 'آزمایش روی الکتریسیته', at: 164.5},
    {n: 'چند تا اختراع', at: 165}, {n: 'دیپلمات', at: 166}, {n: 'یکی از پدران بنیان‌گذار آمریکا', at: 166.5},
  ];
  const chips = win(f, t(163), t(167));
  return (
    <>
      <FigLabel n="27" text="BENJAMIN FRANKLIN" y={150} align="left" x={72} />
      <Svg>
        <circle cx={520} cy={460} r={270 * prog(f, t(158), 30, eInOut)} fill={C.red} />
        <rect x={160} y={620} width={200 * prog(f, t(158) + 10, 24)} height={200} fill={C.blue} transform="rotate(-8 260 720)" />
      </Svg>
      <Print src="photos/franklin.jpg" x={250} y={140} w={520} h={676} at={t(158)} from="b" rot={-1} border={12} />
      <Print src="photos/almanack.jpg" x={86} y={832} w={150} h={206} at={t(163)} from="b" rot={-4} border={6} fit="cover" pos="top" />
      <Print src="photos/press.jpg" x={270} y={850} w={400} h={190} at={t(163) + 10} from="b" rot={2} border={6} />
      <Print src="photos/kite2.jpg" x={710} y={836} w={230} h={204} at={t(164) + 8} from="b" rot={-3} border={6} />
      <div style={{position: 'absolute', right: 96, top: 110}}><Words text="بنجامین *فرانکلین" at={t(158)} size={110} /></div>
      <Mark kind="underline" x={1040} y={236} w={784} h={28} at={t(158) + 24} color={C.red} />
      <div style={{position: 'absolute', right: 96, top: 262}}><Words text="بذار نشونت بدم" at={t(159)} size={56} color={C.mid} /></div>
      <div style={{position: 'absolute', right: 96, top: 340, width: 1000, opacity: win(f, t(160), t(163))}}>
        <Words text="مدام باید برگردی ببینی درباره یه نفر حرف می‌زنی یا چند نفر" at={t(161)} size={62} width={1000} />
      </div>
      <div style={{opacity: chips}}>
        {roles.map((r, i) => (
          <Tag key={i} text={r.n} at={t(Math.floor(r.at)) + (r.at % 1) * 8} x={1824 - (i % 2) * 20} y={330 + i * 78} size={40} fill={[C.ink, C.red, C.blue][i % 3]} />
        ))}
      </div>
      <div style={{position: 'absolute', right: 96, top: 330, width: 1000, opacity: prog(f, t(168), 10)}}>
        <Words text="با این همه کار بی‌ربط یه سؤال جالب پیش می‌اد" at={t(168)} size={56} color={C.mid} width={1000} />
      </div>
      <div style={{position: 'absolute', right: 96, top: 470, width: 1000, opacity: prog(f, t(169), 10)}}>
        <Words text="چطور می‌شه روی چند تا چیز کار کرد" at={t(169)} size={76} width={1000} />
      </div>
      <div style={{position: 'absolute', right: 96, top: 660, width: 1000, opacity: prog(f, t(170), 10)}}>
        <Words text="بدون اینکه همه عمرت از این شاخه به اون شاخه ~بپری؟" at={t(170)} size={56} width={1000} />
      </div>
    </>
  );
};

/* ============================================================ VIRTUES (172-183) */
export const Virtues: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const names = ['نظم', 'میانه‌روی', 'پشتکار', 'صداقت'];
  const focus = Math.min(12, Math.max(0, Math.floor((f - t(178)) / 22)));
  const marks = Array.from({length: 13 * 7}, (_, i) => rnd(i + 3) < 0.18);
  return (
    <>
      <FigLabel n="28" text="THIRTEEN VIRTUES" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 110}}><Words text="اینجا فرانکلین ~زرنگ بود" at={t(172)} size={80} /></div>
      <div style={{position: 'absolute', right: 96, top: 230, width: 800}}><Words text="یه دفترچه کوچیک برای بهتر شدن خودش" at={t(173)} size={50} color={C.mid} width={780} /></div>
      <div style={{position: 'absolute', right: 96, top: 380}}><div style={{fontSize: 210, lineHeight: 1, color: C.red, opacity: prog(f, t(175), 10), transform: `translateY(${(1 - prog(f, t(175), 18)) * 30}px)`}}>{toFa(13)}</div></div>
      <div style={{position: 'absolute', right: 380, top: 470}}><Words text="ویژگی" at={t(175) + 4} size={80} /></div>
      <div style={{position: 'absolute', right: 96, top: 660, width: 800}}><Words text="هر هفته فقط روی ~یکی تمرکز می‌کرد" at={t(178)} size={56} width={780} /></div>
      <Print src="photos/virtues.jpg" x={700} y={96} w={250} h={330} at={t(172)} from="t" rot={5} border={6} />
      <Cutout x={120} y={200} w={760} h={640} at={t(175)} from="l" rot={-1}>
        <svg viewBox="0 0 760 640" style={{position: 'absolute', inset: 0}}>
          <rect width={760} height={640} fill={C.white} />
          {Array.from({length: 13}, (_, r) => (
            <g key={r}>
              <rect x={24} y={44 + r * 44} width={712} height={44} fill={r === focus && f > t(178) ? C.red : 'none'} opacity={0.2} />
              <line x1={24} x2={736} y1={88 + r * 44} y2={88 + r * 44} stroke={C.ink} strokeWidth={1.5} opacity={0.5} />
              <text x={738} y={80 + r * 44} textAnchor="end" fontSize={34} direction="rtl" fill={C.ink} fontFamily={F.fa} opacity={prog(f, t(176) + r * 2, 10)}>{r < 4 ? names[r] : toFa(r + 1)}</text>
              {Array.from({length: 7}, (_, c) => {
                const on = marks[r * 7 + c] && prog(f, t(182) + (r * 7 + c) * 0.4, 6) > 0 && (r === focus ? true : rnd(r * 7 + c) < 0.7);
                return <g key={c}><line x1={40 + c * 58} x2={40 + c * 58} y1={44} y2={88 + 12 * 44} stroke={C.ink} strokeWidth={1} opacity={0.2} />{on && <circle cx={69 + c * 58} cy={66 + r * 44} r={9} fill={C.ink} />}</g>;
              })}
            </g>
          ))}
          <text x={730} y={30} textAnchor="end" fontSize={26} fill={C.mid} fontFamily={F.fa}>{'شنبه … جمعه'}</text>
        </svg>
      </Cutout>
      <div style={{position: 'absolute', right: 96, top: 760, width: 800, opacity: prog(f, t(182), 10)}}><Words text="هر شب یه نشونه برای هر لغزش ثبت می‌کرد" at={t(182)} size={44} width={780} color={C.mid} /></div>
    </>
  );
};

/* ============================================================ GARDEN (184-191) */
export const Garden: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const A = win(f, t(184), t(187));
  const col = (f > t(191)) ? Math.min(7, Math.floor((f - t(191)) / 5)) : -1;
  const overwhelmed = prog(f, t(189), 10) * (1 - prog(f, t(191), 6));
  return (
    <>
      <FigLabel n="29" text="THE GARDEN" y={150} align="left" x={72} />
      <div style={{opacity: A}}>
        <div style={{position: 'absolute', right: 96, top: 130, width: 1600}}><Words text="به‌جای اینکه بنویسه چی باید یاد بگیرم" at={t(185)} size={70} color={C.mid} width={1600} /></div>
        <Svg><DrawPath d="M200 250 L1824 250" at={t(185) + 20} dur={20} len={1700} stroke={C.red} width={8} /></Svg>
        <div style={{position: 'absolute', right: 96, top: 350, width: 1600}}><Words text="لغزش‌هاش رو ~می‌نوشت" at={t(186)} size={150} width={1600} /></div>
      </div>
      <div style={{position: 'absolute', right: 96, top: 120, width: 760, opacity: prog(f, t(187), 10)}}><Words text="مثل باغبونی که باغچه‌ش پر از علفه" at={t(187)} size={58} width={760} /></div>
      <div style={{position: 'absolute', right: 96, top: 360, width: 760}}><Words text="اگه بخواد همه علف‌ها رو یه‌جا بکنه از پسش برنمیاد" at={t(189)} size={52} width={760} color={C.mid} /></div>
      <div style={{position: 'absolute', right: 96, top: 600, width: 760}}><Words text="پس هر بار سراغ یه ~تیکه باغچه می‌ره" at={t(191)} size={56} width={760} /></div>
      <Svg style={{opacity: prog(f, t(187), 12)}}>
        <rect x={120} y={200} width={900} height={620} fill={C.ink} opacity={0.1} />
        {Array.from({length: 8 * 5}, (_, i) => {
          const c = i % 8, r = Math.floor(i / 8);
          const x = 1000 - c * 110 - 50, y = 260 + r * 120;
          const gone = col >= 0 && c === 7 - col + 0 && false;
          const cleared = col >= 0 && c >= 7 - col;
          const sway = Math.sin(f / 8 + i) * 4;
          return (
            <g key={i} transform={`translate(${x} ${y})`} opacity={cleared ? 0.12 : 1}>
              <path d={`M0 70 Q${-6 + sway} 36 ${-22 + sway} 8 M0 70 Q${sway} 30 ${sway} -10 M0 70 Q${6 + sway} 36 ${24 + sway} 10`} stroke={overwhelmed > 0 ? C.red : C.ink} strokeWidth={8} fill="none" strokeLinecap="round" />
              <line x1={-26} x2={26} y1={74} y2={74} stroke={C.ink} strokeWidth={3} opacity={0.5} />
            </g>
          );
        })}
        {col >= 0 && <rect x={1000 - 110 * (col + 1) + 5} y={220} width={110 * (col + 1) - 10} height={580} fill="none" stroke={C.blue} strokeWidth={5} />}
        <rect x={120} y={200} width={900} height={620} fill="none" stroke={C.red} strokeWidth={6} opacity={overwhelmed} />
      </Svg>
    </>
  );
};
