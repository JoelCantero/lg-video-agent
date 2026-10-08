import React from 'react';
import { colors, headingFont } from '../theme';
import { WordReveal } from './WordReveal';

export type VerseLine = Array<readonly [text: string, word: number]>;

/** Literal verse lines; each word appears when the narration says it. */
export const VerseLines: React.FC<{
  readonly lines: VerseLine[];
  readonly cue: (word: number) => number;
  readonly top: number;
  readonly size?: number;
  readonly opacity?: number;
}> = ({ lines, cue, top, size = 84, opacity = 1 }) => (
  <div
    style={{
      position: 'absolute',
      left: 80,
      right: 80,
      top,
      textAlign: 'center',
      fontFamily: headingFont,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.18,
      letterSpacing: 0,
      color: colors.white,
      opacity,
    }}
  >
    {lines.map((line, li) => (
      <div key={li}>
        {line.map(([text, word], i) => (
          <React.Fragment key={word}>
            {i > 0 ? ' ' : null}
            <WordReveal at={cue(word)}>{text}</WordReveal>
          </React.Fragment>
        ))}
      </div>
    ))}
  </div>
);
