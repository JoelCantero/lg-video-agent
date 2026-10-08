import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { captionPageStarts, onScreenTextRanges, words } from '../data/timeline';
import { bodyFont, clamp, colors, easeOut } from '../theme';

type Token = { text: string; start: number; end: number };
type Page = { tokens: Token[]; start: number; hideAt: number; continuesIntoNext: boolean };

const HOLD_AFTER_SPEECH = 0.7;
const FADE_SECONDS = 0.16;

const isOnScreenWord = (index: number) => onScreenTextRanges.some(([first, last]) => index >= first && index <= last);

// Words without a leading space (l'|'univers, -se, 19|:1) join the previous token.
const buildPages = (): Page[] => {
  const pages = captionPageStarts.map((first, pageIndex) => {
    const last = (captionPageStarts[pageIndex + 1] ?? words.length) - 1;
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
      return { tokens: page.tokens, start: page.start, hideAt, continuesIntoNext: hideAt >= nextStart, first: page.first };
    })
    .filter((page) => !isOnScreenWord(page.first));
};

const pages = buildPages();

export const Captions: React.FC<{ readonly offsetSeconds: number }> = ({ offsetSeconds }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
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
