import { Fragment } from 'react';
import { AbsoluteFill, Easing, interpolate, interpolateColors, random, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

type Props = ThemedTemplateProps & {
  text?: string;
  reference?: string;
  pages?: string[];
  wordSeconds?: number[];
  referenceSeconds?: number;
  revealSeconds?: number;
  wordStaggerSeconds?: number;
  stars?: boolean;
};

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
const STARS = Array.from({ length: 110 }, (_, index) => ({
  x: random(`verse-star-x-${index}`), y: random(`verse-star-y-${index}`),
  size: 2 + random(`verse-star-size-${index}`) * 5, period: 0.4 + (index % 9) * 0.1,
}));

function luminance(color: string): number {
  const channels = (interpolateColors(0, [0, 1], [color, color]).match(/[\d.]+/g) ?? []).slice(0, 3).map(value => {
    const channel = Number(value) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function NarratedVerse({
  theme, text = 'The heavens declare the glory of God; and the firmament sheweth his handywork.',
  reference = 'Psalm 19:1 (KJV)', pages, wordSeconds,
  referenceSeconds = 0.2, revealSeconds = 1.2, wordStaggerSeconds = 0.25, stars = true,
}: Props) {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const appearance = resolveTemplateAppearance(theme, {
    headingFont: 'Urbanist, sans-serif', bodyFont: 'Open Sans, sans-serif',
    headingWeight: 700, headingSize: 42, bodySize: 28, secondarySize: 28,
    headingLineHeight: 1.18, bodyLineHeight: 1.1, borderRadius: 999, safeMargin: 0.08,
  });
  useTemplateFonts(appearance);
  const portrait = height > width;
  const scale = Math.min(width / (portrait ? 540 : 960), height / (portrait ? 960 : 540));
  const time = frame / fps;
  const ramp = (start: number, seconds: number, easing = easeOut) => interpolate(time, [start, start + seconds], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing,
  });
  const limit = portrait ? 90 : 110;
  const chunks: string[] = [];
  for (const word of text.trim().split(/\s+/).filter(Boolean)) {
    const previous = chunks.at(-1);
    if (previous && previous.length + word.length + 1 <= limit) chunks[chunks.length - 1] = `${previous} ${word}`;
    else chunks.push(word);
  }
  const pageWords = (pages?.filter(page => page.trim()) ?? chunks).map(page => page.trim().split(/\s+/));
  const firstIndex = pageWords.map((_, page) => pageWords.slice(0, page).reduce((sum, words) => sum + words.length, 0));
  const total = pageWords.reduce((sum, words) => sum + words.length, 0);
  if (wordSeconds && wordSeconds.length !== total) throw new Error(`wordSeconds needs one time per verse word (${total}).`);
  const wordStart = (index: number) => wordSeconds?.[index] ?? revealSeconds + 0.6 + index * wordStaggerSeconds;
  const pageStart = (page: number) => wordStart(firstIndex[page]) - 0.35;
  let page = 0;
  while (page + 1 < pageWords.length && time >= pageStart(page + 1)) page++;
  const pageOut = page + 1 < pageWords.length ? interpolate(time, [pageStart(page + 1) - 0.3, pageStart(page + 1)], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }) : 1;
  const referenceFrame = Math.round(referenceSeconds * fps);
  const referenceIn = frame < referenceFrame ? 0 : spring({ frame: frame - referenceFrame, fps, config: { damping: 12, stiffness: 150, mass: 0.7 } });
  const toTop = ramp(revealSeconds, 0.6, easeInOut);
  // Stars only read as a night sky on a dark surface.
  const night = stars && luminance(appearance.cardBackground) < 0.2;

  return <AbsoluteFill data-template="narrated-verse" style={{ background: appearance.cardBackground, color: appearance.textColor, overflow: 'hidden' }}>
    {night && STARS.map((star, index) => <div key={index} style={{ position: 'absolute', left: star.x * width,
      top: ((star.y * (height + 100) - time * 3.75 * scale) % (height + 100) + height + 100) % (height + 100) - 50,
      width: star.size * scale / 2, height: star.size * scale / 2, borderRadius: '50%', background: appearance.textColor,
      opacity: 0.8 * (0.3 + 0.7 * Math.abs(Math.sin(time / star.period + index))) }} />)}
    <AbsoluteFill style={{ boxSizing: 'border-box', padding: `${height * (portrait ? 0.25 : 0.29)}px ${width * 0.08}px ${height * 0.1}px`,
      alignItems: 'center', justifyContent: 'center' }}>
      <div data-page={page} style={{ fontFamily: appearance.headingFont, fontWeight: appearance.headingWeight, fontSize: (portrait ? 42 : 34) * scale,
        lineHeight: 1.18, letterSpacing: 0, textAlign: 'center', textWrap: 'balance', overflowWrap: 'anywhere', opacity: pageOut }}>
        {pageWords[page].map((word, offset) => {
          const index = firstIndex[page] + offset;
          const shown = ramp(wordStart(index), 7 / 30);
          return <Fragment key={index}>{offset > 0 ? ' ' : null}<span data-word={index} style={{ display: 'inline-block', opacity: shown,
            translate: `0px ${(1 - shown) * 12 * scale}px`, filter: `blur(${(1 - shown) * 4 * scale}px)` }}>{word}</span></Fragment>;
        })}
      </div>
    </AbsoluteFill>
    {referenceIn > 0 && <div data-reference style={{ position: 'absolute', left: '50%', top: height * (0.5 - 0.33 * toTop), translate: '-50% -50%',
      scale: String((0.5 + 0.5 * referenceIn) * (1.35 - 0.35 * toTop)), opacity: Math.min(1, referenceIn * 1.4),
      padding: `${7 * scale}px ${16 * scale}px`, borderRadius: 999, background: appearance.textColor, color: appearance.cardBackground,
      fontFamily: appearance.headingFont, fontWeight: appearance.headingWeight, fontSize: 28 * scale, lineHeight: 1.1, letterSpacing: 0, whiteSpace: 'nowrap' }}>{reference}</div>}
  </AbsoluteFill>;
}
