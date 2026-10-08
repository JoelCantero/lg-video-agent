import React from 'react';
import { Html5Audio, interpolate, Sequence, staticFile, useVideoConfig } from 'remotion';
import { toFrame } from '../data/timeline';
import { effectVolume, soundEffects, type SoundEffect } from '../data/transitions';
import { clamp } from '../theme';

const TAIL_FRAMES = 4;

// The effect's attack lands on the cut frame; it fades out before the next spoken word.
export const TransitionSound: React.FC<{
  readonly sfx: SoundEffect;
  readonly cutFrame: number;
  readonly nextVoice: number | null;
}> = ({ sfx, cutFrame, nextVoice }) => {
  const { fps } = useVideoConfig();
  const { attack, end } = soundEffects[sfx];
  const trimBefore = Math.floor(attack * fps);
  const from = cutFrame - (Math.round(attack * fps) - trimBefore);
  const naturalEnd = cutFrame + Math.ceil((end - attack) * fps) + TAIL_FRAMES;
  const limit = nextVoice === null ? naturalEnd : Math.min(naturalEnd, toFrame(nextVoice) - 2);
  const duration = Math.max(TAIL_FRAMES + 2, limit - from);
  const volume = effectVolume(sfx);

  return (
    <Sequence name={`So · ${sfx}`} from={from} durationInFrames={duration} premountFor={fps}>
      <Html5Audio
        src={staticFile(`sfx/${sfx}.mp3`)}
        trimBefore={trimBefore}
        volume={(f) => volume * interpolate(f, [duration - TAIL_FRAMES, duration], [1, 0], clamp)}
      />
    </Sequence>
  );
};
