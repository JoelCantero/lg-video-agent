import captions from './captions-reviewed.json';

export type CaptionWord = { text: string; start: number; end: number };

export const FPS = 30;
export const words: CaptionWord[] = captions.words;

// Decoded length of public/private/fe-i-ciencia.wav (ffprobe).
export const AUDIO_SECONDS = 157.72;
export const AUDIO_SRC = 'private/fe-i-ciencia.wav';

export const toFrame = (seconds: number) => Math.round(seconds * FPS);
export const wordStart = (index: number) => words[index].start;
export const wordEnd = (index: number) => words[index].end;

/** Scene ranges in narration seconds; each scene starts where the previous one ends. */
export const scenes = {
  opening: { start: 0, end: 13.3 },
  voices: { start: 13.3, end: 30.3 },
  question: { start: 30.3, end: 39.2 },
  tetera: { start: 39.2, end: 88.6, firstWord: 105, lastWord: 238 },
  newton: { start: 88.6, end: 101.5 },
  psalm: { start: 101.5, end: 108.45 },
  creation: { start: 108.45, end: 113.75 },
  analogies: { start: 113.75, end: 122.72 },
  universe: { start: 122.72, end: 131.35 },
  christ: { start: 131.35, end: 143.5 },
  colossians: { start: 143.5, end: 156 },
  logo: { start: 156, end: 159.6 },
} as const;

export type SceneName = keyof typeof scenes;

export const sceneDuration = (name: SceneName) => toFrame(scenes[name].end) - toFrame(scenes[name].start);

/** Frame of a reviewed caption word relative to the start of a scene. */
export const sceneCues =
  (name: SceneName) =>
  (word: number, offsetSeconds = 0) =>
    toFrame(wordStart(word) + offsetSeconds) - toFrame(scenes[name].start);

/** Voice onset measured in the WAV at 0.83 s; Whisper places the first word at 0.00 s. */
export const FIRST_VOICE_OFFSET = 0.8;

/**
 * First word index of every caption page (editorial grouping by meaning and pauses,
 * at most two lines). Timestamps always come from the reviewed captions.
 */
export const captionPageStarts = [
  0, 7, 15, 18, 27, 33, 35, 44, 52, 56, 63, 73, 80, 90, 94, 98, 105, 111, 120, 129, 135, 138, 146,
  151, 157, 164, 165, 168, 177, 186, 190, 192, 196, 202, 205, 207, 211, 218, 227, 239, 249, 252,
  260, 264, 266, 274, 284, 289, 296, 307, 315, 323, 329, 333, 339, 348, 356, 363, 371, 381, 387,
  397, 404, 411, 418, 424, 432, 440,
];

/** Word ranges whose literal text is the scene's main graphic (title, question, quote, verses): no captions. */
export const onScreenTextRanges: ReadonlyArray<readonly [number, number]> = [
  [0, 6],
  [94, 104],
  [252, 263],
  [289, 306],
  [363, 370],
  [411, 443],
];
