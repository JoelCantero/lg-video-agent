import React from 'react';
import { AbsoluteFill, Html5Audio, Sequence, Series, staticFile, useVideoConfig } from 'remotion';
import { Captions } from '../templates/elg-narrated-video/components/Captions';
import { SceneSweep, SWEEP_FRAMES } from '../templates/elg-narrated-video/components/SceneSweep';
import { TransitionSound } from '../templates/elg-narrated-video/components/TransitionSound';
import { useBrandFonts } from '../templates/elg-narrated-video/fonts';
import { MUSIC_FADE_IN_FRAMES, MUSIC_FRAMES, MUSIC_SRC, MUSIC_START_FRAME, MUSIC_VOLUMES } from './data/music';
import { AUDIO_SRC, captionPageStarts, onScreenTextRanges, sceneDuration, scenes, toFrame, words } from './data/timeline';
import { sfx, transitions } from './data/transitions';
import { ContradictionScene } from './scenes/ContradictionScene';
import { DescentScene } from './scenes/DescentScene';
import { DistrustScene } from './scenes/DistrustScene';
import { GospelScene } from './scenes/GospelScene';
import { HandsScene } from './scenes/HandsScene';
import { LightScene } from './scenes/LightScene';
import { LogoScene } from './scenes/LogoScene';
import { NameScene } from './scenes/NameScene';
import { NeedScene } from './scenes/NeedScene';
import { OpeningScene } from './scenes/OpeningScene';
import { OppressorScene } from './scenes/OppressorScene';
import { PhilippiansScene } from './scenes/PhilippiansScene';
import { ProblemScene } from './scenes/ProblemScene';
import { QuestionScene } from './scenes/QuestionScene';
import { RelativismScene } from './scenes/RelativismScene';

export const UNA_VERITAT_DURATION = toFrame(scenes.logo.end);

export const UnaVeritat: React.FC = () => {
  useBrandFonts();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence name="01 · Obertura" durationInFrames={sceneDuration('opening')} premountFor={fps}>
          <OpeningScene />
        </Series.Sequence>
        <Series.Sequence name="02 · Opressor" durationInFrames={sceneDuration('oppressor')} premountFor={fps}>
          <OppressorScene />
        </Series.Sequence>
        <Series.Sequence name="03 · Desconfiança" durationInFrames={sceneDuration('distrust')} premountFor={fps}>
          <DistrustScene />
        </Series.Sequence>
        <Series.Sequence name="04 · Relativisme" durationInFrames={sceneDuration('relativism')} premountFor={fps}>
          <RelativismScene />
        </Series.Sequence>
        <Series.Sequence name="05 · Problema" durationInFrames={sceneDuration('problem')} premountFor={fps}>
          <ProblemScene />
        </Series.Sequence>
        <Series.Sequence name="06 · Contradicció" durationInFrames={sceneDuration('contradiction')} premountFor={fps}>
          <ContradictionScene />
        </Series.Sequence>
        <Series.Sequence name="07 · Necessitem" durationInFrames={sceneDuration('need')} premountFor={fps}>
          <NeedScene />
        </Series.Sequence>
        <Series.Sequence name="08 · Pregunta" durationInFrames={sceneDuration('question')} premountFor={fps}>
          <QuestionScene />
        </Series.Sequence>
        <Series.Sequence name="09 · Filipencs 2:6-7" durationInFrames={sceneDuration('philippians')} premountFor={fps}>
          <PhilippiansScene />
        </Series.Sequence>
        <Series.Sequence
          name="10 · Descens"
          durationInFrames={sceneDuration('descent')}
          premountFor={fps}
          style={{
            scale: 1.006
          }}
        >
          <DescentScene />
        </Series.Sequence>
        <Series.Sequence name="11 · Mans" durationInFrames={sceneDuration('hands')} premountFor={fps}>
          <HandsScene />
        </Series.Sequence>
        <Series.Sequence name="12 · Nom" durationInFrames={sceneDuration('name')} premountFor={fps}>
          <NameScene />
        </Series.Sequence>
        <Series.Sequence name="13 · Llum" durationInFrames={sceneDuration('light')} premountFor={fps}>
          <LightScene />
        </Series.Sequence>
        <Series.Sequence name="14 · Evangeli" durationInFrames={sceneDuration('gospel')} premountFor={fps}>
          <GospelScene />
        </Series.Sequence>
        <Series.Sequence name="15 · Logo" durationInFrames={sceneDuration('logo')} premountFor={fps}>
          <LogoScene />
        </Series.Sequence>
      </Series>

      {transitions.map(({ scene, effect, nextVoice }, i) => (
        <React.Fragment key={scene}>
          <Sequence name={`Transició · ${scene}`} from={toFrame(scenes[scene].start) - SWEEP_FRAMES / 2} durationInFrames={SWEEP_FRAMES} premountFor={fps}>
            <SceneSweep direction={i % 2 === 0 ? 1 : -1} />
          </Sequence>
          <TransitionSound
            {...sfx(effect)}
            src={staticFile(sfx(effect).src)}
            cutFrame={toFrame(scenes[scene].start)}
            nextVoiceFrame={nextVoice === null ? undefined : toFrame(nextVoice)}
          />
        </React.Fragment>
      ))}

      <Sequence name="Subtítols" premountFor={fps}>
        <Captions words={words} pageStarts={captionPageStarts} hiddenRanges={onScreenTextRanges} />
      </Sequence>
      <Html5Audio name="Narració" src={staticFile(AUDIO_SRC)} />
      <Sequence name="Música" from={MUSIC_START_FRAME} durationInFrames={MUSIC_FRAMES} premountFor={fps}>
        <Html5Audio
          src={staticFile(MUSIC_SRC)}
          volume={(f) =>
            MUSIC_VOLUMES[Math.min(Math.max(0, Math.round(f) + MUSIC_START_FRAME), MUSIC_VOLUMES.length - 1)] * Math.min(1, f / MUSIC_FADE_IN_FRAMES)
          }
        />
      </Sequence>
    </AbsoluteFill>
  );
};
