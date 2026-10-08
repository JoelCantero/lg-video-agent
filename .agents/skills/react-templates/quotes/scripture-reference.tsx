import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Quote } from 'lucide-react';
import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

type Props = ThemedTemplateProps & {
  text?: string;
  reference?: string;
  passages?: string[];
  secondsPerPassage?: number;
};

export function ScriptureReference({ theme,
  text = 'The heavens declare the glory of God; and the firmament sheweth his handywork.',
  reference = 'Psalm 19:1 (KJV)', passages, secondsPerPassage = 8,
}: Props) {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const appearance = resolveTemplateAppearance(theme, {
    headingFont: 'Urbanist, sans-serif', bodyFont: 'Open Sans, sans-serif',
    headingWeight: 700, headingSize: 36, bodySize: 34, secondarySize: 20,
    headingLineHeight: 1.1, bodyLineHeight: 1.35, borderRadius: 8, safeMargin: 0.08,
  });
  useTemplateFonts(appearance);
  const portrait = height > width;
  const scale = Math.min(width / (portrait ? 540 : 960), height / (portrait ? 960 : 540));
  const limit = portrait ? 180 : 140;
  const chunks: string[] = [];
  for (const word of text.trim().split(/\s+/).filter(Boolean)) {
    const previous = chunks.at(-1);
    if (previous && previous.length + word.length + 1 <= limit) chunks[chunks.length - 1] = `${previous} ${word}`;
    else chunks.push(word);
  }
  const pages = passages?.filter(passage => passage.trim().length > 0) ?? chunks;
  if (!Number.isFinite(secondsPerPassage) || secondsPerPassage < 3) throw new Error('secondsPerPassage must be at least 3 seconds.');
  const pageFrames = Math.round(secondsPerPassage * fps);
  if (pages.length > 1 && durationInFrames < pages.length * pageFrames) {
    throw new Error(`ScriptureReference needs at least ${pages.length * pageFrames} frames for all ${pages.length} passages.`);
  }
  const index = Math.min(Math.floor(frame / pageFrames), Math.max(0, pages.length - 1));
  const localFrame = frame - index * pageFrames;
  const opacity = interpolate(localFrame, [0, fps * 0.5], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });
  return <AbsoluteFill data-template="scripture-reference" style={{ background: appearance.background,
    boxSizing: 'border-box', padding: `${height * 0.08}px ${width * 0.08}px`, alignItems: 'center', justifyContent: 'center', color: appearance.textColor }}>
    <div style={{ width: '100%', maxWidth: 760 * scale, minHeight: (portrait ? 620 : 370) * scale,
      boxSizing: 'border-box', padding: 24 * scale, background: appearance.cardBackground, color: appearance.textColor,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: `${3 * scale}px solid ${appearance.textColor}` }}>
      <Quote size={36 * scale} strokeWidth={1.5} aria-hidden="true" />
      <blockquote data-passage={index} style={{ margin: `${20 * scale}px 0`, opacity,
        transform: `translateY(${(1 - opacity) * 12 * scale}px)`, fontFamily: appearance.bodyFont,
        fontWeight: appearance.bodyWeight, fontSize: 34 * scale, lineHeight: 1.35, letterSpacing: 0, overflowWrap: 'anywhere' }}>{pages[index] ?? ''}</blockquote>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 * scale }}>
        <cite style={{ fontFamily: appearance.headingFont, fontWeight: appearance.headingWeight, fontSize: 20 * scale,
          fontStyle: 'normal', letterSpacing: 0, overflowWrap: 'anywhere' }}>{reference}</cite>
        {pages.length > 1 && <span data-page style={{ fontFamily: appearance.bodyFont, fontSize: 16 * scale, flexShrink: 0 }}>{index + 1} / {pages.length}</span>}
      </div>
    </div>
  </AbsoluteFill>;
}