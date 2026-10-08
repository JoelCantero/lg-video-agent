import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Atom, Coffee, Plus } from 'lucide-react';
import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

type Props = ThemedTemplateProps & {
  question?: string;
  leftTitle?: string;
  leftText?: string;
  rightTitle?: string;
  rightText?: string;
  conclusion?: string;
  leftIcon?: 'atom' | 'cup' | 'none';
  rightIcon?: 'atom' | 'cup' | 'none';
  secondEnterSeconds?: number;
  connectSeconds?: number;
};

export function ComplementaryPanels({
  theme, question = 'The same question',
  leftTitle = 'How does it happen?', leftText = 'Flame, energy and molecules explain the boiling.',
  rightTitle = 'Why?', rightText = 'Someone wants to make a cup of tea.',
  conclusion = 'Two explanations that complement each other',
  leftIcon = 'atom', rightIcon = 'cup', secondEnterSeconds = 0.65, connectSeconds = 1.65,
}: Props) {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const appearance = resolveTemplateAppearance(theme, {
    headingFont: 'Urbanist, sans-serif', bodyFont: 'Open Sans, sans-serif',
    headingWeight: 700, headingSize: 36, bodySize: 23, secondarySize: 18,
    headingLineHeight: 1.1, bodyLineHeight: 1.35, borderRadius: 8, safeMargin: 0.08,
  });
  useTemplateFonts(appearance);
  const portrait = height > width;
  const scale = Math.min(width / (portrait ? 540 : 960), height / (portrait ? 960 : 540));
  const progress = (seconds: number) => interpolate(frame / fps, [seconds, seconds + 0.5], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });
  const joined = progress(Math.max(connectSeconds, secondEnterSeconds + 0.5));
  const icon = (kind: 'atom' | 'cup' | 'none') => kind === 'none' ? null
    : kind === 'atom' ? <Atom size={42 * scale} strokeWidth={1.5} /> : <Coffee size={42 * scale} strokeWidth={1.5} />;
  return <AbsoluteFill data-template="complementary-panels" style={{
    background: appearance.background, color: appearance.textColor, boxSizing: 'border-box',
    padding: `${height * 0.08}px ${width * 0.08}px`, justifyContent: 'center', fontFamily: appearance.bodyFont,
  }}>
    <div style={{ width: '100%', maxWidth: 1120 * scale, alignSelf: 'center' }}>
      <h1 style={{ fontFamily: appearance.headingFont, fontWeight: appearance.headingWeight, fontSize: 36 * scale,
        lineHeight: 1.1, letterSpacing: 0, margin: `0 0 ${36 * scale}px`, padding: 12 * scale,
        background: appearance.cardBackground, textAlign: 'center', overflowWrap: 'anywhere' }}>{question}</h1>
      <div data-panels style={{ display: 'grid', gridTemplateColumns: portrait ? '1fr' : '1fr 1fr', gap: 32 * scale, position: 'relative' }}>
        {[{ title: leftTitle, text: leftText, kind: leftIcon, at: 0 }, { title: rightTitle, text: rightText, kind: rightIcon, at: secondEnterSeconds }].map((panel, index) => {
          const revealed = progress(panel.at);
          return <section data-panel={index} key={index} style={{
            minWidth: 0, minHeight: (portrait ? 214 : 230) * scale, padding: 24 * scale, boxSizing: 'border-box',
            border: `${scale}px solid ${appearance.textColor}`, borderRadius: 8 * scale,
            background: appearance.cardBackground, color: appearance.textColor,
            opacity: revealed, transform: `translateY(${(1 - revealed) * 16 * scale}px)`,
          }}>
            <div style={{ height: 42 * scale, marginBottom: 18 * scale }}>{icon(panel.kind)}</div>
            <h2 style={{ fontFamily: appearance.headingFont, fontWeight: appearance.headingWeight, fontSize: 30 * scale,
              lineHeight: 1.1, margin: `0 0 ${12 * scale}px`, letterSpacing: 0, overflowWrap: 'anywhere' }}>{panel.title}</h2>
            <p style={{ fontSize: 23 * scale, lineHeight: 1.35, margin: 0, letterSpacing: 0, overflowWrap: 'anywhere' }}>{panel.text}</p>
          </section>;
        })}
        <div data-connection style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          opacity: joined, width: 44 * scale, height: 44 * scale, display: 'grid', placeItems: 'center',
          background: appearance.cardBackground, color: appearance.textColor, border: `${scale}px solid ${appearance.textColor}`, borderRadius: '50%' }}>
          <Plus size={28 * scale} aria-label="Complementary" />
        </div>
      </div>
      <p data-conclusion style={{ fontSize: 23 * scale, fontWeight: 700, lineHeight: 1.35, letterSpacing: 0,
        textAlign: 'center', padding: 12 * scale, background: appearance.cardBackground,
        margin: `${32 * scale}px 0 0`, opacity: joined, overflowWrap: 'anywhere' }}>{conclusion}</p>
    </div>
  </AbsoluteFill>;
}