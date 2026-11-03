import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, toFa} from './theme';
import {eBack, eInOut, lerp, prog, win} from './anim';
import {Cutout, DrawPath, GrowLine, SText, Slab, Svg, Tag, Words, useCue, useScene} from './ui';
import {BellIcon, FigLabel, FlameIcon, PatentIcon, SendIcon, ThumbIcon} from './figures';
import {DURATION} from './timing';
import {Mark, TIcon} from './assets';

/* ============================================================ NEEDS (283-289) */
export const Needs: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const needs = [
    {n: 'پول', q: 'چقدر درآمد ثابت لازم دارم؟', c: C.red, at: 287, v: 0.7},
    {n: 'معنا', q: 'چقدر می‌خوام کارم معنا داشته باشه؟', c: C.blue, at: 288, v: 0.85},
    {n: 'تنوع', q: 'و واقعا چقدر تنوع می‌خوام؟', c: C.ink, at: 289, v: 0.5},
  ];
  const tri = [[420, 250], [160, 700], [680, 700]] as const;
  return (
    <>
      <FigLabel n="41" text="THREE NEEDS" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 110, width: 1400}}><Words text="خب کدوم مدل مال ~توئه؟" at={t(283)} size={92} width={1400} /></div>
      <div style={{position: 'absolute', right: 96, top: 260, width: 900, opacity: win(f, t(284), t(287))}}><Words text="واپنیک سه تا نیاز رو مطرح می‌کنه" at={t(284)} size={54} width={900} color={C.mid} /></div>
      <Svg>
        <path d={`M${tri[0].join(' ')} L${tri[1].join(' ')} L${tri[2].join(' ')}Z`} fill="none" stroke={C.ink} strokeWidth={4} opacity={prog(f, t(284), 14)} />
        {needs.map((n, i) => {
          const p = prog(f, t(285) - 4 + i * 6, 16, eBack);
          return (
            <g key={i}>
              <circle cx={tri[i][0]} cy={tri[i][1]} r={60 * p} fill={n.c} />
              <text x={tri[i][0]} y={tri[i][1] + 18} textAnchor="middle" fontSize={50} fill={C.white} fontFamily={F.fa} opacity={p}>{n.n}</text>
            </g>
          );
        })}
        {needs.map((n, i) => {
          const y = 400 + i * 130 + 65;
          const p = prog(f, t(n.at), 24, eInOut);
          return (
            <g key={`s${i}`} opacity={prog(f, t(n.at), 8)}>
              <line x1={1000} x2={1500} y1={y + 30} y2={y + 30} stroke={C.ink} strokeWidth={3} />
              <circle cx={1500 - 500 * n.v * p} cy={y + 30} r={20} fill={n.c} />
            </g>
          );
        })}
      </Svg>
      {needs.map((n, i) => (
        <div key={i} style={{position: 'absolute', right: 96, top: 400 + i * 130, width: 800}}>
          <Words text={n.q} at={t(n.at)} size={44} width={800} />
        </div>
      ))}
      <div style={{position: 'absolute', right: 96, top: 340, opacity: prog(f, t(286), 8)}}><Words text="از خودت بپرس" at={t(286)} size={52} color={C.mid} /></div>
    </>
  );
};

/* ============================================================ CHOOSE (290-298) */
export const Choose: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const rows = [
    {at: 290, cond: 'امنیت مالی اولویتته', model: 'اینشتین', c: C.ink, n: 3, ic: 'certificate'},
    {at: 292, cond: 'برون‌گرایی و دوست داری چند مهارت (مخصوصا اجتماعی) رو با هم استفاده کنی', model: 'آغوش گروهی', c: C.red, n: 1, ic: 'users-group'},
    {at: 295, cond: 'از چند کار مستقل انرژی می‌گیری', model: 'اسلش', c: C.blue, n: 2, ic: 'slash'},
    {at: 297, cond: 'ترجیح می‌دی هر دوره از زندگیت تمرکز عمیق داشته باشی', model: 'ققنوس', c: C.red, n: 4, ic: 'flame'},
  ];
  return (
    <>
      <FigLabel n="42" text="PICK YOUR MODEL" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 100}}><Words text="اگه…" at={t(290)} size={64} color={C.mid} /></div>
      {rows.map((r, i) => {
        const y = 200 + i * 155;
        const p = prog(f, t(r.at), 18, eInOut);
        return (
          <div key={i}>
            <Slab at={t(r.at)} x={96} y={y} w={1728} h={135} color={C.white} dir="r" />
            <div style={{position: 'absolute', right: 130, top: y + 14, width: 1100}}><Words text={r.cond} at={t(r.at) + 4} size={r.cond.length > 40 ? 38 : 50} width={1100} lh={1.25} /></div>
            <Svg><path d={`M${700} ${y + 68} H${520}`} stroke={C.ink} strokeWidth={4} opacity={p} /><path d={`M${520} ${y + 68} l24 -14 v28Z`} fill={C.ink} opacity={p} /></Svg>
            <div style={{position: 'absolute', left: 96, top: y, width: 400, height: 135, background: r.c, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, gap: 14, direction: 'rtl', transform: `scaleX(${prog(f, t(r.at) + 10, 14, eBack)})`, transformOrigin: 'left center'}}>
              <TIcon name={r.ic} s={58} color={C.white} />
              {r.model}
            </div>
          </div>
        );
      })}
    </>
  );
};

/* ============================================================ ACTION (299-302) */
export const Action: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const t = (i: number) => cue(i);
  const day = Math.floor(prog(f, t(300), t(302) - t(300) + 20, eInOut) * 14);
  return (
    <>
      <FigLabel n="43" text="TWO WEEKS" y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 110, width: 1400}}><Words text="حالا یه کار ~کوچیک بکن" at={t(299)} size={100} width={1400} /></div>
      <Svg>
        {Array.from({length: 14}, (_, i) => {
          const c = i % 7, r = Math.floor(i / 7);
          const on = i < day;
          return (
            <g key={i}>
              <rect x={1000 - c * 130 + 0} y={400 + r * 150} width={115} height={130} fill={on ? (i >= 11 ? C.red : C.ink) : 'none'} stroke={C.ink} strokeWidth={3} opacity={prog(f, t(300) + i, 8)} />
              <text x={1000 - c * 130 + 57} y={480 + r * 150} textAnchor="middle" fontSize={48} fill={on ? C.paper : C.mid} fontFamily={F.fa}>{toFa(i + 1)}</text>
            </g>
          );
        })}
      </Svg>
      <div style={{position: 'absolute', right: 96, top: 360, width: 700}}><Words text="دو هفته" at={t(300)} size={120} width={700} /></div>
      <div style={{position: 'absolute', right: 96, top: 530, width: 700}}><Words text="مدلی که انتخاب کردی رو توی یه مقیاس کوچیک آزمایش کن" at={t(300) + 14} size={46} width={700} color={C.mid} /></div>
      <div style={{position: 'absolute', left: 150, top: 220, width: 800, opacity: prog(f, t(302), 8)}}><Words text="ببین با زندگی واقعیت چقدر جور درمیاد" at={t(302)} size={60} width={800} /></div>
    </>
  );
};

/* ============================================================ OUTRO (303-313) */
export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const cue = useCue();
  const {dur} = useScene();
  const t = (i: number) => cue(i);
  const actions = [
    {n: 1, I: ThumbIcon, label: 'لایک رو بزن', at: 305, c: C.red},
    {n: 2, I: SendIcon, label: 'برای دوستت بفرست', at: 306, c: C.blue},
    {n: 3, I: BellIcon, label: 'سرک رو سابسکرایب کن', at: 308, c: C.paper},
  ];
  const models = ['آغوش گروهی', 'اسلش', 'اینشتین', 'ققنوس'];
  const fadeOut = prog(f, dur - 40, 30);
  return (
    <>
      <FigLabel n="44" text="THANK YOU" color={C.paper} y={150} align="left" x={72} />
      <div style={{position: 'absolute', right: 96, top: 100, width: 1000}}><Words text="اگه این ویدیو بهت کمک کرد" at={t(303)} size={56} color={C.mid} width={1000} /></div>
      <div style={{position: 'absolute', right: 96, top: 170, width: 1000}}><Words text="سه کار ~کوچیک بکن" at={t(304)} size={96} width={1000} /></div>
      {actions.map((a, i) => (
        <Cutout key={i} x={1380 - i * 440 - 80} y={380} w={400} h={300} at={t(a.at)} from="b" rot={(i - 1) * 3}>
          <div style={{position: 'absolute', inset: 0, background: a.c === C.paper ? C.paper : a.c, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
            <div style={{fontSize: 70, color: a.c === C.paper ? C.ink : C.white, lineHeight: 1}}>{toFa(a.n)}</div>
            <a.I s={110} ink={a.c === C.paper ? C.ink : C.white} accent={a.c === C.paper ? C.red : C.ink} />
            <div style={{fontSize: 40, color: a.c === C.paper ? C.ink : C.white, direction: 'rtl'}}>{a.label}</div>
          </div>
        </Cutout>
      ))}
      <div style={{position: 'absolute', right: 96, top: 720, width: 1700, opacity: prog(f, t(310), 8)}}><Words text="زیر ویدیو بنویس: کدوم مدل به نظرت مال توئه؟" at={t(310)} size={56} width={1700} color={C.paper} /></div>
      <div style={{position: 'absolute', right: 96, top: 700, display: 'flex', gap: 22, direction: 'rtl', opacity: prog(f, t(312), 6)}} />
      <div style={{position: 'absolute', right: 96, top: 790, display: 'flex', gap: 20, direction: 'rtl'}}>
        {models.map((m, i) => (
          <div key={i} style={{background: [C.red, C.blue, C.paper, C.mid][i], color: i === 2 ? C.ink : C.white, fontSize: 40, padding: '2px 26px 10px', opacity: prog(f, t(312) + i * 8, 10), transform: `translateY(${(1 - prog(f, t(312) + i * 8, 14)) * 20}px)`}}>{m}</div>
        ))}
      </div>
      <div style={{position: 'absolute', inset: 0, background: C.ink, opacity: fadeOut, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontSize: 320, color: C.paper, fontFamily: F.fa, opacity: fadeOut}}>سرک</div>
      </div>
    </>
  );
};
