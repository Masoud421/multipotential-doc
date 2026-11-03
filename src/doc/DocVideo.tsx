import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile} from 'remotion';
import {C} from './theme';
import {SPANS} from './timing';
import {Hud, SceneShell, Subtitles, Tone} from './ui';
import * as S1 from './scenes1';
import * as S2 from './scenes2';
import * as S3 from './scenes3';
import * as S4 from './scenes4';
import * as S5 from './scenes5';

type Cfg = {Comp: React.FC; tone?: Tone; zoom?: number; pan?: [number, number]; wipeColor?: string};

const Placeholder: React.FC = () => null;

const MAP: Record<string, Cfg> = {
  hook: {Comp: S1.Hook, zoom: 0.03},
  premise: {Comp: S1.Premise, tone: 'gray'},
  agenda: {Comp: S1.Agenda, pan: [-30, 0]},
  welcome: {Comp: S1.Welcome, zoom: 0.08, wipeColor: C.red},
  paradox: {Comp: S1.Paradox},
  stat: {Comp: S1.Stat, tone: 'ink', wipeColor: C.red},
  combine: {Comp: S1.Combine, tone: 'gray'},
  question: {Comp: S1.Question},
  halflife: {Comp: S1.HalfLife, tone: 'gray'},
  three: {Comp: S1.Three},
  c1: {Comp: S2.C1},
  newport: {Comp: S2.Newport, tone: 'gray'},
  reframe: {Comp: S2.Reframe},
  experiment: {Comp: S2.Experiment, pan: [-40, 0]},
  verdict: {Comp: S2.Verdict, tone: 'gray'},
  c2: {Comp: S2.C2},
  c2combine: {Comp: S2.C2Combine, tone: 'gray'},
  app: {Comp: S2.AppScene},
  hopping: {Comp: S2.Hopping, tone: 'gray'},
  exercise: {Comp: S2.Exercise},
  cta1: {Comp: S2.Cta1, tone: 'ink', wipeColor: C.blue},
  dip: {Comp: S3.Dip},
  jump: {Comp: S3.Jump, tone: 'gray'},
  twoq: {Comp: S3.TwoQ},
  rule: {Comp: S3.Rule, tone: 'gray'},
  recap: {Comp: S3.Recap},
  gap: {Comp: S3.Gap, tone: 'gray'},
  franklin: {Comp: S3.FranklinScene, zoom: 0.04},
  virtues: {Comp: S3.Virtues},
  garden: {Comp: S3.Garden, tone: 'gray'},
  step1: {Comp: S4.Step1},
  step2: {Comp: S4.Step2, tone: 'gray'},
  step3: {Comp: S4.Step3},
  warning: {Comp: S4.Warning, tone: 'gray', wipeColor: C.red},
  goodnews: {Comp: S4.GoodNews},
  models: {Comp: S4.Models, tone: 'gray'},
  hug: {Comp: S4.Hug},
  slash: {Comp: S4.Slash, tone: 'gray'},
  einstein: {Comp: S4.Einstein},
  phoenix: {Comp: S4.Phoenix, tone: 'gray'},
  ai: {Comp: S4.AI},
  needs: {Comp: S5.Needs},
  choose: {Comp: S5.Choose, tone: 'gray'},
  action: {Comp: S5.Action},
  outro: {Comp: S5.Outro, tone: 'ink', wipeColor: C.red},
};

/** Loads the supplied Persian font (public/fonts/ZFJahan.ttf) before any frame renders. */
const useFont = () => {
  const [handle] = useState(() => delayRender('Loading ZFJahan font'));
  useEffect(() => {
    const face = new FontFace('ZFJahan', `url(${staticFile('fonts/ZFJahan.ttf')})`);
    face
      .load()
      .then((f) => document.fonts.add(f))
      .catch((e) => console.error('Font failed to load', e))
      .finally(() => continueRender(handle));
  }, [handle]);
};

const OVERLAP = 22; // frames a scene stays under the next scene's wipe

/** Burned-in subtitles are off in this cut (set true to bring them back). */
export const SHOW_SUBTITLES = false;
/** Gentle sound-effects bed (public/audio/sfx.wav, built by scripts/make-sfx.py). */
export const SFX_VOLUME = 1;

export const DocVideo: React.FC = () => {
  useFont();
  return (
    <AbsoluteFill style={{background: C.paper}}>
      <Audio src={staticFile('voice.wav')} />
      <Audio src={staticFile('audio/sfx.wav')} volume={SFX_VOLUME} />
      {SPANS.map((s, i) => {
        const cfg = MAP[s.id] ?? {Comp: Placeholder};
        const {Comp} = cfg;
        const last = i === SPANS.length - 1;
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.to - s.from + (last ? 0 : OVERLAP)} name={s.id}>
            <SceneShell index={i} from={s.from} to={s.to} tone={cfg.tone} zoom={cfg.zoom} pan={cfg.pan} wipeColor={cfg.wipeColor}>
              <Comp />
            </SceneShell>
          </Sequence>
        );
      })}
      <Hud />
      {SHOW_SUBTITLES ? <Subtitles /> : null}
    </AbsoluteFill>
  );
};
