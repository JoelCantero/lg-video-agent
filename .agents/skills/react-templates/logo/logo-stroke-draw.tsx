import { useId } from 'react';
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { useTemplateFonts } from '../fonts';
import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import elgIcon from './elg-icon-data.json';
import elgWordmark from './elg-wordmark-data.json';

type Props = ThemedTemplateProps & { companyName?: string; logo?: 'original' | 'elg' };

export function LogoStrokeDraw({ theme, logo = 'original', companyName = 'Company Name' }: Props) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gradientId = `logo-fill-${useId().replace(/:/g, '')}`;
  const appearance = resolveTemplateAppearance(theme, {
    background: '#111827', textColor: 'white', bodyFont: 'Inter, sans-serif', bodyWeight: 400,
  });
  useTemplateFonts(appearance);
  const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
  const isElg = logo === 'elg';
  const whiteArtwork = isElg && appearance.textColor === '#ffffff';
  const hexPerimeter = 300;
  const triPerimeter = 150;
  const hexOffset = interpolate(frame, [0, fps * (isElg ? 1.4 : 1.2)], [hexPerimeter, 0], clamp);
  const triOffset = interpolate(frame, [fps * 0.4, fps * 1.6], [triPerimeter, 0], clamp);
  const fillOpacity = interpolate(frame, [fps * (isElg ? 1.4 : 1.6), fps * (isElg ? 1.8 : 2.2)], [0, 1], isElg ? { ...clamp, easing: Easing.inOut(Easing.cubic) } : clamp);
  const nameOpacity = interpolate(frame, [fps * (isElg ? 1.8 : 2.0), fps * (isElg ? 2.2 : 2.5)], [0, 1], clamp);
  const hexPoints = '60,10 103.3,35 103.3,85 60,110 16.7,85 16.7,35';
  const triPoints = '60,30 85.98,75 34.02,75';

  return <div style={{
    width: '100%', height: '100%', background: appearance.background,
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    alignItems: 'center', overflow: 'hidden',
  }}>
    <>
    {isElg ?
      <svg aria-label="Icona ELG" width="120" height="120" viewBox={elgIcon.viewBox} style={{
        display: 'block', flexShrink: 0,
        ...Object.fromEntries(Array.from({ length: 7 }, (_, index) => [
          `--elg-stroke-${index}`,
          interpolate(frame, [fps * 0.1 * index, fps * (0.1 * index + 0.8)], [1, 0], { ...clamp, easing: Easing.inOut(Easing.quad) }),
        ])),
      }}>
        <style>{`#${gradientId}-icon path { fill-opacity: ${fillOpacity}; stroke: none; } #${gradientId}-outline path { stroke: ${whiteArtwork ? '#ffffff' : `url(#${gradientId})`}; stroke-opacity: ${1 - fillOpacity}; stroke-width: 2px; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: ${hexOffset / hexPerimeter}; } ${whiteArtwork ? `#${gradientId}-icon path, #${gradientId}-wordmark path, #${gradientId}-wordmark rect { fill: #ffffff !important; }` : ''}`}</style>
        <g id={`${gradientId}-icon`} dangerouslySetInnerHTML={{ __html: elgIcon.markup
          .replace(/id="egl"/g, `id="${gradientId}"`).replace(/url\(#egl\)/g, `url(#${gradientId})`) }} />
        <g id={`${gradientId}-outline`} dangerouslySetInnerHTML={{ __html: elgIcon.outlineMarkup }} />
      </svg>
      :
    <svg width="120" height="120" viewBox="0 0 120 120">
      <defs><linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4361ee" />
        <stop offset="100%" stopColor="#7209b7" />
      </linearGradient></defs>
      <polygon points={hexPoints} fill={`url(#${gradientId})`} opacity={fillOpacity * 0.3} />
      <polygon points={hexPoints} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray={hexPerimeter} strokeDashoffset={hexOffset} strokeLinejoin="round" />
      <polygon points={triPoints} fill={`url(#${gradientId})`} opacity={fillOpacity} />
      <polygon points={triPoints} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray={triPerimeter} strokeDashoffset={triOffset} strokeLinejoin="round" />
    </svg>}
    {isElg ? <svg id={`${gradientId}-wordmark`} role="img" aria-label="Església la Garriga" width="240" height={240 * 541 / 4495} viewBox={elgWordmark.viewBox} style={{
      display: 'block', flexShrink: 0, maxWidth: '84%', marginTop: '1.5rem', opacity: nameOpacity,
      fillRule: 'evenodd', clipRule: 'evenodd', strokeLinejoin: 'round', strokeMiterlimit: 2,
    }} dangerouslySetInnerHTML={{ __html: elgWordmark.markup
      .replace(/id="([^"]+)"/g, `id="${gradientId}-wordmark-$1"`)
      .replace(/url\(#([^)]+)\)/g, `url(#${gradientId}-wordmark-$1)`) }} /> : <p style={{
      color: appearance.textColor, fontSize: '1.8rem', fontWeight: appearance.bodyWeight,
      fontFamily: appearance.bodyFont, marginTop: '1.5rem', opacity: nameOpacity,
    }}>{companyName}</p>}
    </>
  </div>;
}