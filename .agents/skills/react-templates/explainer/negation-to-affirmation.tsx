import { Fragment, type CSSProperties } from 'react';
import { AbsoluteFill, Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

type Props = ThemedTemplateProps & {
  label?: string;
  negation?: string;
  turn?: string;
  affirmation?: string;
  revealSeconds?: number;
  wordStaggerSeconds?: number;
  wordSeconds?: number[];
  strikeSeconds?: number;
  turnSeconds?: number;
  affirmationSeconds?: number;
};

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

export function NegationToAffirmation({
  theme, label = 'He did not think:',
  negation = '“Now that I know how gravity works, I no longer need God”',
  turn = 'On the contrary',
  affirmation = 'Knowing the order of the universe led him to admire his Creator even more.',
  revealSeconds = 0.5, wordStaggerSeconds = 0.14, wordSeconds,
  strikeSeconds = 2.6, turnSeconds = 3.3, affirmationSeconds = 4.4,
}: Props) {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const appearance = resolveTemplateAppearance(theme, {
    headingFont: 'Urbanist, sans-serif', bodyFont: 'Open Sans, sans-serif',
    headingWeight: 700, headingSize: 31, bodySize: 29, secondarySize: 20,
    headingLineHeight: 1.16, bodyLineHeight: 1.16, borderRadius: 24, safeMargin: 0.08,
  });
  useTemplateFonts(appearance);
  const words = negation.trim().split(/\s+/).filter(Boolean);
  if (wordSeconds && wordSeconds.length !== words.length) {
    throw new Error(`wordSeconds needs one time per negation word (${words.length}).`);
  }
  const portrait = height > width;
  const scale = Math.min(width / (portrait ? 540 : 960), height / (portrait ? 960 : 540));
  const time = frame / fps;
  const ramp = (start: number, seconds: number, easing = easeOut) => interpolate(time, [start, start + seconds], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing,
  });
  const pop = (start: number) => {
    const startFrame = Math.round(start * fps);
    return frame < startFrame ? 0 : spring({ frame: frame - startFrame, fps, config: { damping: 12, stiffness: 150, mass: 0.7 } });
  };
  const cardIn = pop(0);
  const strike = ramp(strikeSeconds, 0.33);
  const drop = ramp(turnSeconds + 0.13, 0.87, Easing.in(Easing.quad));
  const turnIn = pop(turnSeconds);
  const turnOut = ramp(affirmationSeconds, 0.47, easeInOut);
  const affirmationIn = pop(affirmationSeconds + 0.1);

  const cardWidth = (portrait ? 448 : 700) * scale;
  const accent = appearance.accentColors[0] ?? appearance.textColor;
  const affirmationColor = appearance.accentTextMix === 1 ? accent
    : interpolateColors(appearance.accentTextMix, [0, 1], [appearance.textColor, accent]);
  const pill: CSSProperties = {
    borderRadius: 999, background: appearance.textColor, color: appearance.cardBackground,
    fontFamily: appearance.headingFont, fontWeight: appearance.headingWeight, lineHeight: 1.1, letterSpacing: 0,
  };
  const labelPill: CSSProperties = {
    ...pill, position: 'absolute', left: 24 * scale, top: 0, translate: '0px -50%',
    padding: `${6 * scale}px ${13 * scale}px`, fontSize: 20 * scale, whiteSpace: 'nowrap',
  };
  const card = (opacity: number, size: number, dy: number, rotate: number): CSSProperties => ({
    position: 'absolute', left: '50%', top: '50%', width: cardWidth, boxSizing: 'border-box',
    padding: `${34 * scale}px ${28 * scale}px ${28 * scale}px`, borderRadius: 24 * scale,
    background: appearance.cardBackground, border: `${Math.max(1, scale)}px solid ${appearance.borderColor}`,
    fontFamily: appearance.headingFont, fontWeight: appearance.headingWeight, letterSpacing: 0,
    textAlign: 'center', overflowWrap: 'anywhere',
    opacity, scale: String(size), rotate: `${rotate}deg`, translate: `-50% calc(-50% + ${dy}px)`,
  });

  return <AbsoluteFill data-template="negation-to-affirmation" style={{ background: appearance.background, overflow: 'hidden' }}>
    {drop < 1 && <div data-negation style={card(Math.min(1, cardIn * 1.4) * (1 - drop), 0.6 + 0.4 * cardIn, drop * height * 0.6, 10 * drop)}>
      <div style={labelPill}>{label}</div>
      <div style={{ position: 'relative', fontSize: (portrait ? 31 : 32) * scale, lineHeight: 1.16, color: appearance.textColor }}>
        {words.map((word, index) => {
          const shown = ramp(wordSeconds?.[index] ?? revealSeconds + index * wordStaggerSeconds, 7 / 30);
          return <Fragment key={index}>{index > 0 ? ' ' : null}<span data-word={index} style={{
            display: 'inline-block', opacity: shown, translate: `0px ${(1 - shown) * 12 * scale}px`, filter: `blur(${(1 - shown) * 4 * scale}px)`,
          }}>{word}</span></Fragment>;
        })}
        {strike > 0 && <div data-strike style={{ position: 'absolute', left: '-3%', top: '50%', width: `${strike * 106}%`,
          height: 7 * scale, borderRadius: 3.5 * scale, background: appearance.negativeColor,
          rotate: '-4deg', transformOrigin: '0% 50%', translate: '0px -50%' }} />}
      </div>
    </div>}
    {time >= turnSeconds && turnOut < 1 && <div data-turn style={{
      ...pill, position: 'absolute', left: '50%', top: '50%', maxWidth: cardWidth, textAlign: 'center',
      padding: `${11 * scale}px ${27 * scale}px`, fontSize: (portrait ? 48 : 46) * scale,
      opacity: Math.min(1, turnIn * 1.4) * (1 - turnOut), scale: String((0.5 + 0.5 * turnIn) * (1 - 0.5 * turnOut)),
      translate: `-50% calc(-50% - ${turnOut * 40 * scale}px)`,
    }}>{turn}</div>}
    {affirmationIn > 0 && <div data-affirmation style={card(Math.min(1, affirmationIn * 1.4), 0.85 + 0.15 * affirmationIn, 0, 0)}>
      <div style={labelPill}>{turn}</div>
      <div style={{ fontSize: (portrait ? 29 : 30) * scale, lineHeight: 1.16, color: affirmationColor }}>{affirmation}</div>
    </div>}
  </AbsoluteFill>;
}
