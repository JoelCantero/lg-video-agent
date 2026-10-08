import type { CaptionWord } from './timeline';

/** Linear gain that moves a source measured at sourceLufs to targetLufs. */
export const gainForLoudness = (sourceLufs: number, targetLufs: number) => 10 ** ((targetLufs - sourceLufs) / 20);

/** Effect volume levelled to a target 10 ms loudness without peaking above a ceiling (dBFS). */
export const effectVolume = (
  effect: { peakDb: number; loudestDb: number },
  targetLoudestDb: number,
  peakCeilingDb: number,
) => 10 ** (Math.min(targetLoudestDb - effect.loudestDb, peakCeilingDb - effect.peakDb) / 20);

/**
 * Per-frame music volumes: levels are in LU relative to the narration, ducked while
 * words are spoken, lifted in pauses and optionally under an outro without speech.
 */
export const duckedMusicVolumes = ({
  words,
  fps,
  durationInFrames,
  musicLufs,
  narrationLufs,
  underSpeech = -16,
  inPauses = -12,
  outro,
  fadeInFrames = 30,
  fadeOutFrames = 45,
  smoothingFrames = 9,
}: {
  words: CaptionWord[];
  fps: number;
  durationInFrames: number;
  musicLufs: number;
  narrationLufs: number;
  underSpeech?: number;
  inPauses?: number;
  outro?: { startFrame: number; level: number };
  fadeInFrames?: number;
  fadeOutFrames?: number;
  smoothingFrames?: number;
}): number[] => {
  const speaking = new Array<number>(durationInFrames).fill(0);
  for (const word of words) {
    const first = Math.max(0, Math.floor((word.start - 0.25) * fps));
    const last = Math.min(durationInFrames, Math.ceil((word.end + 0.45) * fps));
    for (let f = first; f < last; f++) speaking[f] = 1;
  }
  return speaking.map((_, f) => {
    let sum = 0;
    let count = 0;
    for (let k = f - smoothingFrames; k <= f + smoothingFrames; k++) {
      if (k >= 0 && k < durationInFrames) {
        sum += speaking[k];
        count++;
      }
    }
    const speech = sum / count;
    const lift = outro ? Math.min(1, Math.max(0, (f - outro.startFrame) / 24)) : 0;
    const level = (underSpeech * speech + inPauses * (1 - speech)) * (1 - lift) + (outro?.level ?? 0) * lift;
    const fade = Math.min(1, f / fadeInFrames, (durationInFrames - 1 - f) / fadeOutFrames);
    return gainForLoudness(musicLufs, narrationLufs + level) * Math.max(0, fade);
  });
};
