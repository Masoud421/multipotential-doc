import React from 'react';
import {Composition} from 'remotion';
import {DocVideo} from './doc/DocVideo';
import {DURATION} from './doc/timing';
import {FPS, H, W} from './doc/theme';

export const RootDoc: React.FC = () => (
  <Composition id="MultipotentialDoc" component={DocVideo} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);
