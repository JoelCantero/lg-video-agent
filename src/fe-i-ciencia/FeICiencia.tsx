import React from 'react';
import { AbsoluteFill, Html5Audio, Sequence, Series, staticFile, useVideoConfig } from 'remotion';
import { Captions } from './components/Captions';
import { SceneSweep, SWEEP_FRAMES } from './components/SceneSweep';
import { TransitionSound } from './components/TransitionSound';
import { AUDIO_SRC, sceneDuration, scenes, toFrame } from './data/timeline';
import { MUSIC_SRC, musicVolumes } from './data/music';
import { transitions } from './data/transitions';
import { useBrandFonts } from './fonts';
import { AnalogiesScene } from './scenes/AnalogiesScene';
import { ChristScene } from './scenes/ChristScene';
import { ColossiansScene } from './scenes/ColossiansScene';
import { CreationScene } from './scenes/CreationScene';
import { LogoScene } from './scenes/LogoScene';
import { NewtonScene } from './scenes/NewtonScene';
import { OpeningScene } from './scenes/OpeningScene';
import { PsalmScene } from './scenes/PsalmScene';
import { QuestionScene } from './scenes/QuestionScene';
import { TeteraScene } from './scenes/tetera/TeteraScene';
import { UniverseScene } from './scenes/UniverseScene';
import { VoicesScene } from './scenes/VoicesScene';

export const FE_I_CIENCIA_DURATION = toFrame(scenes.logo.end);
const MUSIC_VOLUMES = musicVolumes(FE_I_CIENCIA_DURATION);

export const FeICiencia: React.FC = () => {
  useBrandFonts();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence name="01 · Obertura" durationInFrames={sceneDuration('opening')} premountFor={fps}>
          <OpeningScene />
        </Series.Sequence>
        <Series.Sequence name="02 · Veus" durationInFrames={sceneDuration('voices')} premountFor={fps}>
          <VoicesScene />
        </Series.Sequence>
        <Series.Sequence name="03 · Pregunta" durationInFrames={sceneDuration('question')} premountFor={fps}>
          <QuestionScene />
        </Series.Sequence>
        <Series.Sequence name="04 · Tetera" durationInFrames={sceneDuration('tetera')} premountFor={fps}>
          <TeteraScene />
        </Series.Sequence>
        <Series.Sequence name="05 · Newton" durationInFrames={sceneDuration('newton')} premountFor={fps}>
          <NewtonScene />
        </Series.Sequence>
        <Series.Sequence name="06 · Salm 19:1" durationInFrames={sceneDuration('psalm')} premountFor={fps}>
          <PsalmScene />
        </Series.Sequence>
        <Series.Sequence name="07 · Creació" durationInFrames={sceneDuration('creation')} premountFor={fps}>
          <CreationScene />
        </Series.Sequence>
        <Series.Sequence name="08 · Analogies" durationInFrames={sceneDuration('analogies')} premountFor={fps}>
          <AnalogiesScene />
        </Series.Sequence>
        <Series.Sequence name="09 · Univers" durationInFrames={sceneDuration('universe')} premountFor={fps}>
          <UniverseScene />
        </Series.Sequence>
        <Series.Sequence name="10 · Crist" durationInFrames={sceneDuration('christ')} premountFor={fps}>
          <ChristScene />
        </Series.Sequence>
        <Series.Sequence name="11 · Colossencs" durationInFrames={sceneDuration('colossians')} premountFor={fps}>
          <ColossiansScene />
        </Series.Sequence>
        <Series.Sequence name="12 · Logo" durationInFrames={sceneDuration('logo')} premountFor={fps}>
          <LogoScene />
        </Series.Sequence>
      </Series>

      {transitions.map(({ scene, sfx, nextVoice }, i) => (
        <React.Fragment key={scene}>
          <Sequence
            name={`Transició · ${scene}`}
            from={toFrame(scenes[scene].start) - SWEEP_FRAMES / 2}
            durationInFrames={SWEEP_FRAMES}
            premountFor={fps}
          >
            <SceneSweep direction={i % 2 === 0 ? 1 : -1} />
          </Sequence>
          <TransitionSound sfx={sfx} cutFrame={toFrame(scenes[scene].start)} nextVoice={nextVoice} />
        </React.Fragment>
      ))}

      <Sequence name="Subtítols" premountFor={fps}>
        <Captions offsetSeconds={0} />
      </Sequence>
      <Html5Audio name="Narració" src={staticFile(AUDIO_SRC)} />
      <Html5Audio
        name="Música"
        src={staticFile(MUSIC_SRC)}
        durationInFrames={FE_I_CIENCIA_DURATION}
        volume={(f) => MUSIC_VOLUMES[Math.min(Math.max(0, Math.round(f)), MUSIC_VOLUMES.length - 1)]}
      />
    </AbsoluteFill>
  );
};
