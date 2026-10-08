import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { bodyFont, clamp, colors, easeOut } from '../theme';
import type { CaptionWord } from '../timeline';

type Token = { text: string; start: number; end: number };
type Page = { tokens: Token[]; start: number; hideAt: number; continuesIntoNext: boolean };

const HOLD_AFTER_SPEECH = 0.7;
const FADE_SECONDS = 0.16;

// Words without a leading space (l'|'univers, -se, 19|:1) join the previous token.
const buildPages = (
  words: CaptionWord[],
  pageStarts: number[],
  hiddenRanges: ReadonlyArray<readonly [number, number]>,
): Page[] => {
  const pages = pageStarts.map((first, pageIndex) => {
    const last = (pageStarts[pageIndex + 1] ?? words.length) - 1;
    const tokens: Token[] = [];
    for (let i = first; i <= last; i++) {
      const word = words[i];
      const previous = tokens[tokens.length - 1];
      if (previous && !word.text.startsWith(' ')) {
        previous.text += word.text;
        previous.end = Math.max(previous.end, word.end);
      } else {
        tokens.push({ text: word.text.trim(), start: word.start, end: word.end });
      }
    }
    return { first, tokens, start: words[first].start, end: Math.max(...tokens.map((t) => t.end)) };
  });
  return pages
    .map((page, pageIndex) => {
      const nextStart = pages[pageIndex + 1]?.start ?? Infinity;
      const hideAt = Math.min(nextStart, page.end + HOLD_AFTER_SPEECH);
      return { first: page.first, tokens: page.tokens, start: page.start, hideAt, continuesIntoNext: hideAt >= nextStart };
    })
    .filter((page) => !hiddenRanges.some(([first, last]) => page.first >= first && page.first <= last));
};

/** Word-by-word captions on a solid contrast plate (≥4.5:1), max two lines. */
export const Captions: React.FC<{
  readonly words: CaptionWord[];
  /** First word index of each page, grouped by meaning and pauses. */
  readonly pageStarts: number[];
  /** Word ranges whose literal text is already on screen (titles, verses): no captions. */
  readonly hiddenRanges?: ReadonlyArray<readonly [number, number]>;
  readonly offsetSeconds?: number;
}> = ({ words, pageStarts, hiddenRanges = [], offsetSeconds = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pages = useMemo(() => buildPages(words, pageStarts, hiddenRanges), [words, pageStarts, hiddenRanges]);
  const time = frame / fps + offsetSeconds;
  const page = pages.find((candidate) => time >= candidate.start && time < candidate.hideAt);
  if (!page) return null;

  const enter = interpolate(time, [page.start, page.start + FADE_SECONDS], [0, 1], { ...clamp, easing: easeOut });
  const exit = page.continuesIntoNext ? 1 : interpolate(time, [page.hideAt - FADE_SECONDS, page.hideAt], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 372 }}>
      <div
        style={{
          maxWidth: 940,
          padding: '18px 34px 20px',
          borderRadius: 30,
          background: colors.ink,
          color: colors.white,
          fontFamily: bodyFont,
          fontWeight: 700,
          fontSize: 50,
          lineHeight: 1.3,
          letterSpacing: 0,
          textAlign: 'center',
          textWrap: 'balance',
          opacity: Math.min(enter, exit),
          translate: `0px ${(1 - enter) * 18}px`,
        }}
      >
        {page.tokens.map((token, i) => {
          const active = time >= token.start && time < token.end;
          const spoken = time >= token.start;
          return (
            <React.Fragment key={i}>
              {i > 0 ? ' ' : null}
              <span
                style={{
                  borderRadius: 12,
                  padding: '0 8px',
                  margin: '0 -8px',
                  background: active ? colors.teal : 'transparent',
                  opacity: spoken ? 1 : 0.55,
                }}
              >
                {token.text}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
