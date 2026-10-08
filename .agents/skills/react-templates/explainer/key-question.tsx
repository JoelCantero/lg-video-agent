import { Fragment } from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

type Props = ThemedTemplateProps & {
  question?: string;
  keyPhrase?: string;
  revealSeconds?: number;
  wordStaggerSeconds?: number;
  wordSeconds?: number[];
};

export function KeyQuestion({
  theme, question = 'Is science really the only way to know the truth?', keyPhrase = 'the only way',
  revealSeconds = 0.3, wordStaggerSeconds = 0.16, wordSeconds,
}: Props) {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const appearance = resolveTemplateAppearance(theme, {
    headingFont: 'Urbanist, sans-serif', bodyFont: 'Open Sans, sans-serif',
    headingWeight: 700, headingSize: 44, bodySize: 24, secondarySize: 18,
    headingLineHeight: 1.2, bodyLineHeight: 1.1, borderRadius: 18, safeMargin: 0.08,
  });
  useTemplateFonts(appearance);
  const words = question.trim().split(/\s+/).filter(Boolean);
  const phrase = keyPhrase.trim().split(/\s+/).filter(Boolean);
  const first = phrase.length ? words.findIndex((_, index) => phrase.every((word, offset) => words[index + offset] === word)) : -1;
  if (phrase.length && first < 0) throw new Error(`keyPhrase "${keyPhrase}" is not in the question.`);
  if (wordSeconds && wordSeconds.length !== words.length) throw new Error(`wordSeconds needs one time per question word (${words.length}).`);
  const portrait = height > width;
  const scale = Math.min(width / (portrait ? 540 : 960), height / (portrait ? 960 : 540));
  const pop = (start: number) => {
    const startFrame = Math.round(start * fps);
    return frame < startFrame ? 0 : spring({ frame: frame - startFrame, fps, config: { damping: 12, stiffness: 150, mass: 0.7 } });
  };
  const start = (index: number) => wordSeconds?.[index] ?? revealSeconds + index * wordStaggerSeconds;
  const word = (index: number) => {
    const shown = pop(start(index));
    return <span data-word={index} style={{ display: 'inline-block', opacity: Math.min(1, shown * 1.5),
      translate: `${(1 - Math.min(1, shown)) * -20 * scale}px 0px` }}>{words[index]}</span>;
  };
  const run = (from: number, to: number) => Array.from({ length: Math.max(0, to - from) }, (_, offset) => from + offset)
    .map((index, position) => <Fragment key={index}>{position > 0 ? ' ' : null}{word(index)}</Fragment>);
  const end = first < 0 ? words.length : first + phrase.length;
  const pillIn = first < 0 ? 0 : pop(start(first));

  return <AbsoluteFill data-template="key-question" style={{ background: appearance.background, boxSizing: 'border-box',
    padding: `${height * 0.08}px ${width * 0.08}px`, alignItems: 'center', justifyContent: 'center' }}>
    <div data-question style={{ boxSizing: 'border-box', width: '100%', maxWidth: (portrait ? 453 : 760) * scale,
      padding: `${26 * scale}px ${28 * scale}px`, borderRadius: 18 * scale, background: appearance.cardBackground, color: appearance.textColor,
      border: `${Math.max(1, scale)}px solid ${appearance.borderColor}`, fontFamily: appearance.headingFont, fontWeight: appearance.headingWeight,
      fontSize: (portrait ? 44 : 40) * scale, lineHeight: 1.2, letterSpacing: 0, overflowWrap: 'anywhere' }}>
      {run(0, first < 0 ? words.length : first)}
      {first >= 0 && <>{first > 0 ? ' ' : null}<span data-key style={{ display: 'inline-block', padding: `${2 * scale}px ${12 * scale}px ${4 * scale}px`,
        borderRadius: 999, background: appearance.textColor, color: appearance.cardBackground, whiteSpace: 'nowrap',
        opacity: Math.min(1, pillIn * 1.5), scale: String(0.7 + 0.3 * Math.min(1, pillIn)) }}>{run(first, end)}</span>
        {end < words.length ? ' ' : null}{run(end, words.length)}</>}
    </div>
  </AbsoluteFill>;
}
