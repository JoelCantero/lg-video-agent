import React from 'react';
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { Captions } from './components/Captions';
import { AUDIO_SRC, scenes } from './data/timeline';
import { useBrandFonts } from './fonts';
import { SCENE_START_FRAME, TETERA_DURATION } from './scenes/tetera/motion';
import { TeteraScene } from './scenes/tetera/TeteraScene';

// Direction pilot: the teapot excerpt (39.2 s → 88.6 s of the narration) with real audio and captions.
export const FeICienciaPilotTetera: React.FC = () => {
  useBrandFonts();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        scale: 1.001
      }}
    >
      <Sequence name="Escena · Tetera" durationInFrames={TETERA_DURATION} premountFor={fps}>
        <TeteraScene />
      </Sequence>
      <Sequence name="Subtítols" durationInFrames={TETERA_DURATION} premountFor={fps}>
        <Captions offsetSeconds={scenes.tetera.start} />
      </Sequence>
      <Html5Audio name="Narració" src={staticFile(AUDIO_SRC)} trimBefore={SCENE_START_FRAME} durationInFrames={TETERA_DURATION} />
    </AbsoluteFill>
  );
};
