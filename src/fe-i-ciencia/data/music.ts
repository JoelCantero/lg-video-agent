import { FPS, scenes, toFrame, words } from './timeline';

export const MUSIC_SRC = 'private/music/ornave-lofi-vinyl-teapot-553356.mp3';

// Integrated loudness measured with ffmpeg ebur128.
const MUSIC_LUFS = -15.5;
const NARRATION_LUFS = -36.7;

// Music level relative to the narration, in LU.
const UNDER_SPEECH = -16;
const IN_PAUSES = -12;
const UNDER_LOGO = -4;

const FADE_IN_FRAMES = 30;
const FADE_OUT_FRAMES = 45;
const SMOOTHING_FRAMES = 9;

const gain = (relativeLu: number) => 10 ** ((NARRATION_LUFS + relativeLu - MUSIC_LUFS) / 20);

/** Per-frame music volume: ducked while words are spoken, lifted in pauses and under the logo. */
export const musicVolumes = (durationInFrames: number): number[] => {
  const speaking = new Array<number>(durationInFrames).fill(0);
  for (const word of words) {
    const first = Math.max(0, Math.floor((word.start - 0.25) * FPS));
    const last = Math.min(durationInFrames, Math.ceil((word.end + 0.45) * FPS));
    for (let f = first; f < last; f++) speaking[f] = 1;
  }
  const logoStart = toFrame(scenes.logo.start);
  return speaking.map((_, f) => {
    let sum = 0;
    let count = 0;
    for (let k = f - SMOOTHING_FRAMES; k <= f + SMOOTHING_FRAMES; k++) {
      if (k >= 0 && k < durationInFrames) {
        sum += speaking[k];
        count++;
      }
    }
    const speech = sum / count;
    const logo = Math.min(1, Math.max(0, (f - logoStart) / 24));
    const level = (UNDER_SPEECH * speech + IN_PAUSES * (1 - speech)) * (1 - logo) + UNDER_LOGO * logo;
    const fade = Math.min(1, f / FADE_IN_FRAMES, (durationInFrames - 1 - f) / FADE_OUT_FRAMES);
    return gain(level) * Math.max(0, fade);
  });
};
