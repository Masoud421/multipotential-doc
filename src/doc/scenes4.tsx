import React from 'react';
import {Mark, Print, TIcon, asset} from './assets';
import {useCurrentFrame} from 'remotion';
import {C, F, toFa} from './theme';
import {eBack, eInOut, lerp, prog, rnd, win} from './anim';
import {Cutout, DrawPath, GrowLine, SText, Slab, Svg, Tag, Words, useCue} from './ui';
import {BrushIcon, CameraIcon, ChartIcon, ClockIcon, CodeIcon, FigLabel, FlameIcon, Franklin, MusicIcon, NotebookIcon, PatentIcon, PenIcon, TelescopeIcon} from './figures';

const StepHead: React.FC<{n: string; word: string; at: number; color?: string}> = ({n, word, at, color = C.red}) => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{position: 'absolute', right: 96, top: 100, fontFamily: F.mono, fontSize: 22, letterSpacing: 6, color: C.mid, opacity: prog(f, at, 10)}}>STEP {n}</div>
      <div style={{position: 'absolute', right: 96, top: 130}}><Words text={`قدم *${word}`} at={at} size={118} hlColor={color} /></div>
    </>
  );
};

/* ============================================================ STEP 1 (192-200) */
export const Step1: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const chips = [{n: 'نوشتن', at: 198}, {n: 'روانشناسی', at: 199}, {n: 'تدوین', at: 199.5}];
  const intro = win(f, t(192), t(194));
  return (
    <>
      <FigLabel n="30" text="PRACTICAL" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 120, width: 1300, opacity: intro}}><Words text="حالا بذار روشش رو کاربردی کنم" at={t(192)} size={86} width={1300} /></div>
      <div style={{position: 'absolute', right: 96, top: 320, opacity: win(f, t(193), t(194))}}><Words text="سه تا ~قدم داره" at={t(193)} size={110} /></div>
      <div style={{opacity: prog(f, t(194), 8)}}>
        <StepHead n="01" word="اول" at={t(194)} />
        <div style={{position: 'absolute', right: 96, top: 300, width: 800}}><Words text="همه علاقه‌هات رو بنویس" at={t(195)} size={60} width={800} /></div>
        <div style={{position: 'absolute', right: 96, top: 400, width: 800}}><Words text="ولی برای یک ماه فقط یه پروژه اصلی انتخاب کن" at={t(196) + 4} size={52} width={800} color={C.mid} /></div>
        <Svg>
          <rect x={96} y={150} width={400} height={0} />
          {[0, 1, 2].map((i) => <rect key={i} x={1560 - i * 56} y={560} width={44} height={44} fill={i === 0 ? C.red : 'none'} stroke={C.ink} strokeWidth={3} opacity={prog(f, t(194) + 6, 8)} />)}
        </Svg>
        {chips.map((c, i) => (
          <Tag key={i} text={c.n} at={t(Math.floor(c.at)) + (c.at % 1) * 10} x={470} y={300 + i * 110} size={48} fill={[C.ink, C.blue, C.red][i]} align="right" />
        ))}
        <Svg>
          {chips.map((c, i) => <GrowLine key={i} x1={490} y1={330 + i * 110} x2={580} y2={460} at={t(200)} dur={14} stroke={C.mid} width={3} />)}
        </Svg>
        <Cutout x={580} y={330} w={400} h={260} at={t(200)} from="l" rot={-2}>
          <div style={{position: 'absolute', inset: 0, background: C.red, color: C.white, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 52, textAlign: 'center', lineHeight: 1.3, direction: 'rtl'}}>
            <div style={{width: 0, height: 0, borderLeft: `40px solid ${C.white}`, borderTop: '24px solid transparent', borderBottom: '24px solid transparent', marginBottom: 16}} />
            ویدیوی آموزشی<br />کوتاه
          </div>
        </Cutout>
      </div>
    </>
  );
};

/* ============================================================ STEP 2 (201-210) */
export const Step2: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const weeks = [{n: 'تحقیق', I: ChartIcon, at: 204}, {n: 'نوشتن متن', I: PenIcon, at: 205.5}, {n: 'تصویرسازی', I: BrushIcon, at: 207}, {n: 'تدوین', I: CameraIcon, at: 208}];
  const focus = f > t(210) ? 1 : -1;
  return (
    <>
      <FigLabel n="31" text="WEEKLY FOCUS" y={150} align="left" x={72} />
      <StepHead n="02" word="دوم" at={t(201)} color={C.blue} />
      <div style={{position: 'absolute', right: 560, top: 150, width: 1000, opacity: win(f, t(202), t(209))}}>
        <Words text="هر هفته روی یه بخش مشخص از همون پروژه تمرکز کن" at={t(202)} size={52} width={1000} color={C.mid} />
      </div>
      {weeks.map((w, i) => {
        const at = t(Math.floor(w.at)) + (w.at % 1) * 10;
        const p = prog(f, at, 20, eBack);
        const x = 1500 - i * 410;
        const hot = focus === 1 && i === 2;
        return (
          <div key={i} style={{position: 'absolute', left: x - 190, top: 360, width: 380, height: 370, transform: `translateY(${(1 - p) * 60}px)`, opacity: Math.min(1, p * 2)}}>
            <div style={{position: 'absolute', inset: 0, background: hot ? C.red : C.white, border: `3px solid ${C.ink}`}} />
            <div style={{position: 'absolute', right: 20, top: 14, fontSize: 36, color: hot ? C.paper : C.mid, direction: 'rtl'}}>هفته {toFa(i + 1)}</div>
            <div style={{position: 'absolute', left: 90, top: 80}}><w.I s={200} ink={hot ? C.paper : C.ink} accent={hot ? C.ink : C.red} /></div>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 20, textAlign: 'center', fontSize: 54, direction: 'rtl', color: hot ? C.white : C.ink}}>{w.n}</div>
          </div>
        );
      })}
      <Svg>
        <GrowLine x1={1690} y1={330} x2={1690 - 1560 * prog(f, t(204), t(208) - t(204), eInOut)} y2={330} at={t(204)} dur={1} stroke={C.red} width={8} />
      </Svg>
      <div style={{position: 'absolute', right: 96, top: 770, width: 1500, opacity: prog(f, t(208), 8)}}>
        <Words text="لازم نیست دقیقا همین‌ها باشه، فقط تقسیمش کن" at={t(208)} size={44} width={1500} color={C.mid} />
      </div>
    </>
  );
};

/* ============================================================ STEP 3 (211-222) */
export const Step3: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const chat = win(f, t(216), t(218));
  return (
    <>
      <FigLabel n="32" text="NIGHTLY NOTES" y={150} align="left" x={72} />
      <StepHead n="03" word="سوم" at={t(211)} color={C.ink} />
      <div style={{position: 'absolute', right: 96, top: 300, width: 800}}><Words text="از دفترچه فرانکلین الهام بگیر" at={t(212)} size={56} width={800} /></div>
      <Cutout x={130} y={170} w={760} h={640} at={t(213)} from="l" rot={-1.5}>
        <div style={{position: 'absolute', inset: 0, background: C.white}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 36, background: C.ink}} />
          <div style={{position: 'absolute', right: 40, top: 30, fontSize: 40, direction: 'rtl', color: C.mid}}>امشب</div>
          <div style={{position: 'absolute', right: 40, left: 90, top: 100, display: 'flex', gap: 20, direction: 'rtl', opacity: prog(f, t(213), 10)}}>
            <div style={{flex: 1, borderTop: `6px solid ${C.blue}`, paddingTop: 10, fontSize: 40}}>چی خوب پیش رفت</div>
            <div style={{flex: 1, borderTop: `6px solid ${C.red}`, paddingTop: 10, fontSize: 40}}>کجا اشتباه کردم</div>
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{position: 'absolute', right: 40, top: 200 + i * 70, height: 10, width: 260 * prog(f, t(214) + i * 12, 18), background: C.ink, opacity: 0.8}} />
          ))}
          {[0, 1].map((i) => (
            <div key={i} style={{position: 'absolute', left: 90 + 0, top: 200 + i * 70, height: 10, width: 220 * prog(f, t(214) + 6 + i * 14, 18), background: C.red}} />
          ))}
          <div style={{position: 'absolute', right: 40, left: 90, top: 440, fontSize: 40, direction: 'rtl', color: C.red, opacity: prog(f, t(219), 10), borderTop: `2px dashed ${C.mid}`, paddingTop: 20, lineHeight: 1.4}}>
            گرون خریدم؛ قبل از خرید باید بیشتر تحقیق کنم
          </div>
          <div style={{position: 'absolute', left: 90, bottom: 24, fontSize: 36, color: C.blue, opacity: prog(f, t(221), 10), direction: 'rtl'}}>یه هفته بعد: هنوز یادمه ✓</div>
        </div>
      </Cutout>
      <div style={{position: 'absolute', right: 96, top: 420, width: 800, opacity: win(f, t(213), t(216))}}><Words text="هر شب یادداشت کن چی خوب پیش رفت و کجا اشتباه کردی" at={t(213)} size={50} width={800} color={C.mid} /></div>
      <div style={{position: 'absolute', right: 96, top: 560, width: 800, opacity: win(f, t(215), t(216))}}><Words text="یه دفترچه ساده کافیه" at={t(215)} size={68} width={800} /></div>
      <div style={{position: 'absolute', right: 96, top: 420, width: 800, opacity: chat}}><Words text="یا یه گروه خصوصی توی پیام‌رسان که فقط خودت توشی" at={t(216)} size={52} width={800} /></div>
      <div style={{position: 'absolute', right: 96, top: 440, width: 800, opacity: prog(f, t(218), 8) * (1 - prog(f, t(221), 8))}}><Words text="حتی اشتباه‌های ~کوچیک رو هم بنویس" at={t(218)} size={62} width={800} /></div>
      <div style={{position: 'absolute', right: 96, top: 640, width: 800, opacity: prog(f, t(221), 8)}}><Words text="همین یادآوری دفعه بعد ~دستت رو می‌گیره" at={t(222)} size={58} width={800} /></div>
    </>
  );
};

/* ============================================================ WARNING (223-227) */
export const Warning: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const cells = 7 * 6;
  const fillN = Math.floor(prog(f, t(226), 50) * cells);
  return (
    <>
      <FigLabel n="33" text="WARNING" y={150} align="left" x={72} />
      <Svg>
        <g transform={`translate(1650 250) scale(${prog(f, t(223), 18, eBack)})`}>
          <path d="M0 -110 L120 100 H-120Z" fill={C.red} /><rect x={-9} y={-40} width={18} height={80} fill={C.white} /><circle cy={72} r={11} fill={C.white} />
        </g>
      </Svg>
      <div style={{position: 'absolute', right: 96, top: 440}}><Words text="یه ~هشدار" at={t(223)} size={110} /></div>
      <div style={{position: 'absolute', right: 96, top: 600, width: 900}}><Words text="این دفترچه نباید تبدیل بشه به سرگرمی جدیدت" at={t(224)} size={56} width={900} /></div>
      <div style={{position: 'absolute', right: 96, top: 780, width: 900, opacity: win(f, t(225), t(226))}}><Words text="هدف اینه که کار پیش بره" at={t(225)} size={52} width={900} color={C.blue} /></div>
      <Svg>
        {Array.from({length: cells}, (_, i) => {
          const c = i % 7, r = Math.floor(i / 7);
          return <rect key={i} x={150 + c * 120} y={170 + r * 92} width={108} height={80} fill={i < fillN ? [C.red, C.blue, C.ink, C.gray][(i * 7) % 4] : 'none'} stroke={C.ink} strokeWidth={2} opacity={prog(f, t(224) + i * 0.5, 8)} />;
        })}
        <DrawPath d="M130 150 L1000 730" at={t(227)} dur={14} len={1100} stroke={C.red} width={14} cap="butt" />
        <DrawPath d="M1000 150 L130 730" at={t(227) + 8} dur={14} len={1100} stroke={C.red} width={14} cap="butt" />
      </Svg>
      <div style={{position: 'absolute', left: 150, top: 740, opacity: prog(f, t(226), 10)}}><Words text="سه ساعت طراحی یه جدول خوشگل" at={t(226)} size={44} width={900} color={C.mid} /></div>
    </>
  );
};

/* ============================================================ GOOD NEWS (228-234) */
export const GoodNews: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  return (
    <>
      <FigLabel n="34" text="GOOD NEWS" y={150} align="left" x={72} />
      <Cutout x={140} y={190} w={380} h={494} at={t(228)} from="l" rot={-2}><Franklin w={380} id="fr3" /></Cutout>
      <Svg>
        <path d="M540 260 H1000 V430 H640 L580 480 L596 430 H540Z" fill={C.white} stroke={C.ink} strokeWidth={4} opacity={prog(f, t(229), 12)} />
      </Svg>
      <div style={{position: 'absolute', left: 560, top: 280, width: 420, opacity: prog(f, t(229), 12), direction: 'rtl', fontSize: 40, textAlign: 'center', lineHeight: 1.4}}>اجرای نقشه سخت‌تر از چیزی بود که فکر می‌کردم</div>
      <div style={{position: 'absolute', right: 96, top: 110, width: 800}}><Words text="حتی خود فرانکلین هم اعتراف کرد" at={t(228)} size={64} width={800} /></div>
      <div style={{position: 'absolute', right: 96, top: 330}}><Words text="مخصوصا ~نظم" at={t(230)} size={110} /></div>
      <Svg>
        {Array.from({length: 7}, (_, i) => <rect key={i} x={1700 - i * 100} y={540} width={86} height={60} fill="none" stroke={C.ink} strokeWidth={3} />)}
        {Array.from({length: 7}, (_, i) => <circle key={i} cx={1657 - i * 100} cy={570} r={14 * prog(f, t(230) + 12 + i * 3, 10, eBack)} fill={C.red} />)}
      </Svg>
      <div style={{position: 'absolute', right: 96, top: 640, opacity: prog(f, t(231), 8)}}><Words text="و این خودش *خبر خوبیه" at={t(231)} size={70} hlColor={C.blue} /></div>
      <div style={{position: 'absolute', left: 120, top: 730, width: 1100, opacity: prog(f, t(232), 8)}}><Words text="اگه گاهی جا موندی مشکل از تو نیست؛ واقع‌بینانه ازش استفاده کن" at={t(232)} size={50} width={1100} color={C.mid} /></div>
    </>
  );
};

/* ============================================================ MODELS INTRO (235-242) */
export const Models: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const A = win(f, t(235), t(238) + 8);
  const no = win(f, t(238), t(239) + 8);
  const B = prog(f, t(239), 10);
  return (
    <>
      <FigLabel n="35" text="FOUR MODELS" y={150} align="left" x={72} />
      <div style={{opacity: A}}>
        <div style={{position: 'absolute', right: 96, top: 120, width: 1500}}><Words text="علاقه‌های ما حتما باید توی یه شغل جمع بشن؟" at={t(236)} size={86} width={1500} /></div>
        <Svg>
          {Array.from({length: 9}, (_, i) => {
            const a = rnd(i + 1) * 6, p = prog(f, t(236) + 20 + i * 4, 60, eInOut);
            return <circle key={i} cx={lerp(1700 - (i % 5) * 220, 960, p * 0.95)} cy={lerp(640 + (i % 2) * 90 - 80, 640, p * 0.8)} r={36} fill={[C.red, C.blue, C.ink][i % 3]} />;
          })}
          <rect x={780} y={560} width={360} height={170} fill="none" stroke={C.ink} strokeWidth={5} />
          <SText x={960} y={660} at={t(236)} size={64} color={C.mid}>یه شغل؟</SText>
        </Svg>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontSize: 560, lineHeight: 1.1, color: C.red, opacity: no, transform: `scale(${0.7 + 0.3 * prog(f, t(238), 12, eBack)})`}}>نه</div>
      <div style={{opacity: B}}>
        <div style={{position: 'absolute', right: 96, top: 120, width: 1400}}><Words text="امیلی واپنیک توی کتابش چهار مدل رو معرفی می‌کنه" at={t(239)} size={66} width={1400} /></div>
        <div style={{position: 'absolute', right: 96, top: 330, width: 1400}}><Words text="و جالبه که نمی‌گه حتما همه مهارت‌هات رو ترکیب کنی" at={t(241)} size={48} width={1400} color={C.mid} /></div>
        <Svg>
          {[C.red, C.blue, C.ink, C.white].map((c, i) => {
            const p = prog(f, t(240) + i * 6, 18, eBack);
            return (
              <g key={i} transform={`translate(${1500 - i * 400} 600) scale(${p})`}>
                <rect x={-150} y={-150} width={300} height={300} fill={c} stroke={C.ink} strokeWidth={4} />
                <text y={60} textAnchor="middle" fontSize={190} fill={c === C.white ? C.ink : C.white} fontFamily={F.fa}>{toFa(i + 1)}</text>
              </g>
            );
          })}
        </Svg>
      </div>
    </>
  );
};

/* ============================================================ HUG (243-251) */
export const Hug: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const m = prog(f, t(247), 30, eInOut);
  const items = [{n: 'طراحی', c: C.red, a: -2.4}, {n: 'برنامه‌نویسی', c: C.blue, a: 0.2}, {n: 'روانشناسی رفتاری', c: C.ink, a: 2.8}];
  return (
    <>
      <FigLabel n="36" text="MODEL 01 / GROUP HUG" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 100, fontFamily: F.mono, fontSize: 22, letterSpacing: 6, color: C.mid}}>MODEL 01</div>
      <div style={{position: 'absolute', right: 96, top: 130}}><Words text="آغوش *گروهی" at={t(243)} size={118} hlColor={C.red} /></div>
      <div style={{position: 'absolute', right: 96, top: 300, width: 800}}><Words text="چند علاقه مختلف توی یه حرفه جمع می‌شن" at={t(244)} size={54} width={800} /></div>
      <Svg>
        <g transform="translate(420 470)" style={{mixBlendMode: 'multiply'}}>
          {items.map((it, i) => {
            const p = prog(f, t(245) + i * 8, 20, eBack);
            const ang = (i / 3) * Math.PI * 2 - Math.PI / 2;
            const r = lerp(150, 52, m);
            return <circle key={i} cx={Math.cos(ang) * r} cy={Math.sin(ang) * r} r={120 * p} fill={it.c} opacity={0.82} />;
          })}
        </g>
        {[[420, 280], [740, 660], [110, 660]].map(([x, y], i) => (
          <SText key={i} x={x} y={y} at={t(245) + 6 + i * 8} size={36} color={C.ink} anchor="middle">{items[i].n}</SText>
        ))}
        <g opacity={prog(f, t(247), 12)}><rect x={150} y={720} width={540} height={84} fill={C.ink} /><text x={420} y={780} textAnchor="middle" fontSize={50} fill={C.paper} fontFamily={F.fa}>طراحی محصول دیجیتال</text></g>
      </Svg>
      <div style={{position: 'absolute', right: 96, top: 450, width: 800, opacity: prog(f, t(248), 10)}}><Words text="هر سه مهارتش توی همون پروژه به کار می‌اد" at={t(248)} size={50} width={800} color={C.mid} /></div>
      <div style={{position: 'absolute', right: 96, top: 600, width: 800}}><Words text="برای تست، یه مسئله پیدا کن که حداقل با دو تا از علاقه‌هات ~حل بشه" at={t(250)} size={50} width={800} /></div>
    </>
  );
};

/* ============================================================ SLASH (252-260) */
export const Slash: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const days = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  const swallow = prog(f, t(260), 30, eInOut);
  return (
    <>
      <FigLabel n="37" text="MODEL 02 / SLASH" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 100, fontFamily: F.mono, fontSize: 22, letterSpacing: 6, color: C.mid}}>MODEL 02</div>
      <div style={{position: 'absolute', right: 96, top: 130}}><Words text="اسلش" at={t(252)} size={118} /></div>
      <div style={{position: 'absolute', right: 380, top: 160, fontSize: 200, color: C.red, lineHeight: 1, transform: `translateX(${(1 - prog(f, t(252) + 6, 16)) * 80}px)`, opacity: prog(f, t(252) + 6, 10), fontFamily: F.serif}}>/</div>
      <div style={{position: 'absolute', right: 96, top: 320, width: 800}}><Words text="شغل‌های موازی" at={t(253)} size={64} width={800} /></div>
      <div style={{position: 'absolute', right: 96, top: 420, width: 800, opacity: win(f, t(254), t(257))}}><Words text="بعضی علاقه‌ها اصلا به هم ربط ندارن" at={t(254)} size={50} width={800} color={C.mid} /></div>
      <Svg>
        {days.map((d, i) => {
          const x = 1720 - i * 235 + 0;
          const p = prog(f, t(255) + i * 4, 14, eBack);
          const teach = i < 3;
          const sw = i === 6 ? swallow : 0;
          return (
            <g key={i} transform={`translate(${x - 200} 560)`} opacity={p}>
              <rect width={210} height={190 * p} fill={teach ? C.ink : i === 5 ? C.blue : i === 6 ? C.red : i === 4 ? C.blue : C.red} opacity={i === 5 ? 1 - swallow * 0.8 : 1} />
              <text x={105} y={120} textAnchor="middle" fontSize={64} fill={C.white} fontFamily={F.fa}>{teach ? 'معلم' : i === 3 || i === 5 ? 'موسیقی' : 'عکاسی'}</text>
              <text x={105} y={-16} textAnchor="middle" fontSize={32} fill={C.mid} fontFamily={F.fa}>{d}</text>
            </g>
          );
        })}
        <g transform={`translate(${1720 - 5 * 235 - 200} 560)`}><rect width={210 + swallow * 240} height={190} fill={C.red} opacity={swallow} transform={`translate(${-swallow * 240} 0)`} /></g>
      </Svg>
      <div style={{position: 'absolute', right: 96, top: 780, width: 1500, opacity: prog(f, t(257), 8) * (1 - prog(f, t(258), 8))}}><Words text="لازم نیست زورکی وصلشون کنی" at={t(257)} size={52} width={1500} /></div>
      <div style={{position: 'absolute', right: 96, top: 780, width: 1700, opacity: prog(f, t(258), 8)}}><Words text="برنامه‌ریزی و مدیریت مالی خوب می‌خواد؛ و نباید یکی دیگه رو ~خفه کنه" at={t(258)} size={46} width={1700} /></div>
    </>
  );
};

/* ============================================================ EINSTEIN (261-270) */
export const Einstein: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const stars = Array.from({length: 18}, (_, i) => [160 + rnd(i) * 1500, 560 + rnd(i + 20) * 190] as const);
  return (
    <>
      <FigLabel n="38" text="MODEL 03 / EINSTEIN" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 100, fontFamily: F.mono, fontSize: 22, letterSpacing: 6, color: C.mid}}>MODEL 03</div>
      <div style={{position: 'absolute', right: 96, top: 130}}><Words text="اینشتین" at={t(261)} size={118} /></div>
      <div style={{position: 'absolute', right: 96, top: 290, width: 900, opacity: win(f, t(262), t(265))}}><Words text="یه شغل اصلی که خرجت رو در می‌یاره" at={t(262)} size={56} width={900} /></div>
      <div style={{position: 'absolute', right: 96, top: 290, width: 900, opacity: prog(f, t(265), 8)}}><Words text="و کنارش وقت کافی برای بقیه علاقه‌هات" at={t(265)} size={56} width={900} color={C.blue} /></div>
      <Print src="photos/einstein.jpg" x={620} y={58} w={250} h={312} at={t(261) + 6} from="t" rot={-3} border={8} pos="center top" />
      <Slab at={t(262)} x={150} y={400} w={1520} h={150} color={C.ink} dir="r" />
      <Slab at={t(265)} x={150} y={560} w={1520} h={210} color={C.blue} dir="r" />
      <Svg>
        {stars.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3 + (i % 3)} fill={C.paper} opacity={prog(f, t(265) + 14 + i * 2, 10) * (0.5 + 0.5 * Math.sin(f / 10 + i))} />)}
        <SText x={1620} y={490} at={t(263)} size={52} color={C.paper} anchor="end">روز: شغل اصلی</SText>
        <SText x={1620} y={680} at={t(266) - 20} size={52} color={C.paper} anchor="end">شب: بقیه علاقه‌ها</SText>
      </Svg>
      <div style={{position: 'absolute', left: 190, top: 418, opacity: prog(f, t(266), 12)}}><PatentIcon s={110} ink={C.paper} accent={C.red} /></div>
      <div style={{position: 'absolute', left: 190, top: 590, opacity: prog(f, t(269), 12), transform: `translateY(${(1 - prog(f, t(269), 18, eBack)) * 40}px)`}}><TelescopeIcon s={150} ink={C.paper} accent={C.red} /></div>
      <div style={{position: 'absolute', right: 96, top: 800, width: 1500, opacity: prog(f, t(266), 8)}}><Words text="اینشتین توی اداره ثبت اختراع کار می‌کرد و فیزیک رو کنارش دنبال می‌کرد" at={t(266)} size={40} width={1500} color={C.mid} /></div>
    </>
  );
};

/* ============================================================ PHOENIX (271-277) */
export const Phoenix: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const hills = [
    {x: 1500, label: 'حرفه اول', c: C.ink, at: 272},
    {x: 1000, label: 'حرفه دوم', c: C.blue, at: 273.5},
    {x: 500, label: 'حوزه دیگه', c: C.red, at: 274.5},
  ];
  return (
    <>
      <FigLabel n="39" text="MODEL 04 / PHOENIX" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 100, fontFamily: F.mono, fontSize: 22, letterSpacing: 6, color: C.mid}}>MODEL 04</div>
      <div style={{position: 'absolute', right: 96, top: 130}}><Words text="ققنوس" at={t(271)} size={118} /></div>
      <Svg>
        <line x1={120} x2={1800} y1={760} y2={760} stroke={C.ink} strokeWidth={3} />
        {hills.map((h, i) => {
          const at = t(Math.floor(h.at)) + (h.at % 1) * 10;
          const p = prog(f, at, 30, eInOut);
          return (
            <g key={i}>
              <DrawPath d={`M${h.x + 200} 760 C${h.x + 120} 760 ${h.x + 120} ${760 - 280 * 1} ${h.x} ${760 - 280} C${h.x - 120} ${760 - 280} ${h.x - 120} 760 ${h.x - 200} 760`} at={at} dur={30} len={900} stroke={h.c} width={10} />
              <SText x={h.x} y={810} at={at + 10} size={34} color={C.mid}>{h.label}</SText>
              <SText x={h.x} y={440} at={at + 14} size={32} color={h.c}>{['تجربه جدی', 'عمق', 'شروع تازه'][i]}</SText>
            </g>
          );
        })}
      </Svg>
      <div style={{position: 'absolute', left: 640, top: 186, width: 260, height: 253, opacity: prog(f, t(271) + 10, 16), transform: `translateY(${(1 - prog(f, t(271) + 10, 24, eBack)) * 40 + Math.sin(f / 14) * 4}px)`, backgroundImage: `url(${asset('photos/phoenix.png')})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'}} />
      <Mark kind="star" x={930} y={190} w={64} h={52} at={t(275) + 10} color={C.red} />
      <div style={{position: 'absolute', right: 96, top: 290, width: 900, opacity: win(f, t(272), t(275))}}><Words text="چند سال روی یه حرفه عمیق می‌شی و بعد می‌ری سراغ حوزه دیگه" at={t(272)} size={46} width={900} color={C.mid} /></div>
      <div style={{position: 'absolute', right: 96, top: 290, width: 900, opacity: prog(f, t(275), 8)}}><Words text="این مدل ~کلاسیکه" at={t(275)} size={66} width={900} /></div>
    </>
  );
};

/* ============================================================ AI (278-282) */
export const AI: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const shrink = prog(f, t(281), 40, eInOut);
  return (
    <>
      <FigLabel n="40" text="AI ERA" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 110, width: 1500}}><Words text="توی عصر ~هوش مصنوعی" at={t(278)} size={92} width={1500} /></div>
      <div style={{position: 'absolute', right: 96, top: 250, width: 1500}}><Words text="یادگیری خیلی سریع‌تر شده" at={t(279)} size={56} width={1500} color={C.mid} /></div>
      <Slab at={t(280)} x={200} y={490} w={1580} h={70} color={C.ink} dir="r" />
      <Svg>
        <SText x={1780} y={470} at={t(280)} size={36} color={C.mid} anchor="end">قبلا: چند سال</SText>
        <SText x={1780} y={640} at={t(281)} size={36} color={C.red} anchor="end">حالا: خیلی زودتر</SText>
        <rect x={1780 - 1580 * (1 - shrink * 0.68)} y={660} width={1580 * (1 - shrink * 0.68)} height={70} fill={C.red} opacity={prog(f, t(281), 8)} />
      </Svg>
      <div style={{position: 'absolute', right: 96, top: 780, display: 'flex', gap: 20 + (1 - shrink) * 160, opacity: prog(f, t(282), 10), alignItems: 'center'}}>
        {[0, 1, 2].map((i) => <FlameIcon key={i} s={70} />)}
        <div style={{width: 20}} />
        <Words text="چرخه ققنوس کوتاه‌تر می‌شه" at={t(282)} size={50} width={900} />
      </div>
    </>
  );
};
