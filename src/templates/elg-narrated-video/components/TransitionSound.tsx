import React from 'react';
import { Html5Audio, interpolate, Sequence, useVideoConfig } from 'remotion';
import { clamp } from '../theme';

const TAIL_FRAMES = 4;

/** Sound effect whose attack lands on the cut frame and fades out before the next spoken word. */
export const TransitionSound: React.FC<{
  readonly src: string;
  /** Seconds of the effect's attack and audible end, measured in the source file. */
  readonly attack: number;
  readonly end: number;
  readonly volume: number;
  readonly cutFrame: number;
  readonly nextVoiceFrame?: number;
}> = ({ src, attack, end, volume, cutFrame, nextVoiceFrame }) => {
  const { fps } = useVideoConfig();
  const trimBefore = Math.floor(attack * fps);
  const from = cutFrame - (Math.round(attack * fps) - trimBefore);
  const naturalEnd = cutFrame + Math.ceil((end - attack) * fps) + TAIL_FRAMES;
  const limit = nextVoiceFrame === undefined ? naturalEnd : Math.min(naturalEnd, nextVoiceFrame - 2);
  const duration = Math.max(TAIL_FRAMES + 2, limit - from);

  return (
    <Sequence name="Transition sound" from={from} durationInFrames={duration} premountFor={fps}>
      <Html5Audio src={src} trimBefore={trimBefore} volume={(f) => volume * interpolate(f, [duration - TAIL_FRAMES, duration], [1, 0], clamp)} />
    </Sequence>
  );
};
