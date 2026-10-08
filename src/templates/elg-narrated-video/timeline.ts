/** Word with timestamps in seconds (reviewed mlx-whisper captions). */
export type CaptionWord = { text: string; start: number; end: number };
export type SceneRange = { start: number; end: number };

/** Frame helpers for a narrated video whose audio starts at frame 0. */
export const createTimeline = <S extends string>(words: CaptionWord[], scenes: Record<S, SceneRange>, fps = 30) => {
  const toFrame = (seconds: number) => Math.round(seconds * fps);
  return {
    toFrame,
    sceneDuration: (name: S) => toFrame(scenes[name].end) - toFrame(scenes[name].start),
    /** Frame of a caption word relative to the start of a scene. */
    sceneCues:
      (name: S) =>
      (word: number, offsetSeconds = 0) =>
        toFrame(words[word].start + offsetSeconds) - toFrame(scenes[name].start),
  };
};
