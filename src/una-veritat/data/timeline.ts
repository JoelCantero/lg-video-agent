import { createTimeline, type CaptionWord } from '../../templates/elg-narrated-video/timeline';
import captions from './captions-reviewed.json';

export const FPS = 30;
export const words: CaptionWord[] = captions.words;

// Decoded length of public/private/una-veritat.wav (ffprobe); speech ends at 213.72 s.
export const AUDIO_SECONDS = 215.11;
export const AUDIO_SRC = 'private/una-veritat.wav';

/** Scene ranges in narration seconds; every cut sits in the middle of a pause. */
export const scenes = {
  opening: { start: 0, end: 6.77 },
  oppressor: { start: 6.77, end: 23.1 },
  distrust: { start: 23.1, end: 31.57 },
  relativism: { start: 31.57, end: 57.63 },
  problem: { start: 57.63, end: 77.4 },
  contradiction: { start: 77.4, end: 89.87 },
  need: { start: 89.87, end: 107.44 },
  question: { start: 107.44, end: 114.44 },
  philippians: { start: 114.44, end: 133.12 },
  descent: { start: 133.12, end: 146.55 },
  hands: { start: 146.55, end: 159.95 },
  name: { start: 159.95, end: 172.88 },
  light: { start: 172.88, end: 195.16 },
  gospel: { start: 195.16, end: 214.3 },
  logo: { start: 214.3, end: 217.3 },
} as const;

export type SceneName = keyof typeof scenes;

export const { toFrame, sceneDuration, sceneCues } = createTimeline<SceneName>(words, scenes, FPS);

/** First word index of every caption page, grouped by meaning (one or two lines). */
export const captionPageStarts = [
  0, 5, 10, 16, 19, 24, 30, 37, 44, 48, 52, 58, 64, 69, 72, 78, 83, 89, 93, 98, 105, 109, 117, 123,
  129, 133, 138, 143, 148, 151, 157, 163, 167, 173, 177, 182, 187, 193, 198, 199, 204, 209, 213, 219,
  222, 229, 234, 242, 249, 254, 260, 268, 306, 311, 319, 328, 333, 341, 346, 355, 360, 363, 372, 379,
  384, 392, 397, 402, 409, 417, 420, 427, 433, 438, 444, 451, 455, 463, 468, 472, 476, 482, 490, 495,
  501, 506, 509, 513, 518, 523, 528, 534,
];

/** Word ranges whose literal text is on screen (title, quote, verse, question, references): no captions. */
export const onScreenTextRanges: ReadonlyArray<readonly [number, number]> = [
  [0, 4],
  [199, 203],
  [242, 248],
  [254, 259],
  [268, 305],
  [341, 345],
  [417, 419],
  [495, 500],
];
