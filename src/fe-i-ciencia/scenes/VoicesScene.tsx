import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandBackground } from '../components/BrandBackground';
import { Floating } from '../components/Floating';
import { NameCard } from '../components/NameCard';
import { Pill } from '../components/Pill';
import { sceneCues } from '../data/timeline';
import { useBrandFonts } from '../fonts';
import { UniverseInterior } from '../illustrations/UniverseInterior';
import { clamp, colors, easeInOut, easeOut, headingFont, pop, settle } from '../theme';

const at = sceneCues('voices');
const c = {
  stephen: at(33),
  astrophysicist: at(37),
  universe: at(48),
  explain: at(50),
  necessity: at(53),
  god: at(55),
  meaning: at(56),
  // «el filòsof» is not spoken in this recording: the card enters in the pause before «Alex».
  the: at(60, -0.45),
  alex: at(60),
  atheism: at(67),
  conclusion: at(70),
  comprehension: at(74),
};

const GRID = [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75];

export const VoicesScene: React.FC = () => {
  useBrandFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ramp = (start: number, duration: number) =>
    interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing: easeInOut });

  const discIn = settle(frame, fps, 0, 22);
  const toRosenberg = settle(frame, fps, c.meaning, 30);
  const pulse = interpolate(frame, [c.universe, c.universe + 6, c.universe + 18], [0, 1, 0], clamp);
  const cx = 540;
  const cy = 900 - 180 * toRosenberg;
  const r = (200 + 130 * discIn - 140 * toRosenberg) * (1 + 0.04 * pulse);
  const grid = interpolate(frame, [c.explain, c.explain + 34], [0, 1], { ...clamp, easing: easeOut });
  const scanLens = interpolate(frame, [c.explain + 8, c.explain + 30], [0, 1], { ...clamp, easing: easeOut });

  const hawkingIn = pop(frame, fps, c.stephen, 14);
  const hawkingOut = ramp(c.meaning - 6, 14);
  const rosenbergIn = pop(frame, fps, c.the, 14);

  const godIn = pop(frame, fps, c.necessity, 12);
  const godOut = ramp(c.meaning - 4, 26);
  const atheismIn = pop(frame, fps, c.atheism, 12);
  const arrow = interpolate(frame, [c.conclusion, c.conclusion + 16], [0, 1], { ...clamp, easing: easeOut });
  const comprehensionIn = pop(frame, fps, c.comprehension, 12);
  const arrowTop = cy + r + 22;
  const arrowBottom = 1130;

  return (
    <AbsoluteFill>
      <BrandBackground />

      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <clipPath id="voices-disc">
            <circle cx={cx} cy={cy} r={r} />
          </clipPath>
        </defs>
        <g opacity={Math.min(1, discIn * 1.4)}>
          <g clipPath="url(#voices-disc)">
            <UniverseInterior cx={cx} cy={cy} r={r} frame={frame} grid={0} />
            {GRID.map((v, i) => (
              <React.Fragment key={v}>
                <line x1={cx + v * r} y1={cy - r} x2={cx + v * r} y2={cy + r} stroke={colors.white} strokeWidth={3} opacity={0.45} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, Math.max(0, grid * 1.6 - i * 0.08))} />
                <line x1={cx - r} y1={cy + v * r} x2={cx + r} y2={cy + v * r} stroke={colors.white} strokeWidth={3} opacity={0.45} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, Math.max(0, grid * 1.6 - i * 0.08))} />
              </React.Fragment>
            ))}
            <circle cx={cx + 0.28 * r} cy={cy - 0.2 * r} r={0.3 * r} fill="none" stroke={colors.white} strokeWidth={Math.max(6, 0.045 * r)} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - scanLens} />
          </g>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={colors.ink} strokeWidth={Math.max(10, r * 0.06)} />
        </g>
        {arrow > 0 ? (
          <g>
            <line x1={540} y1={arrowTop} x2={540} y2={arrowTop + (arrowBottom - arrowTop) * arrow} stroke={colors.white} strokeWidth={12} strokeLinecap="round" />
            <polyline points={`514,${arrowBottom - 30} 540,${arrowBottom + 2} 566,${arrowBottom - 30}`} fill="none" stroke={colors.white} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" opacity={arrow >= 1 ? 1 : 0} />
          </g>
        ) : null}
      </svg>

      {frame >= c.stephen && hawkingOut < 1 ? (
        <Floating x={540} y={366} scale={0.85 + 0.15 * hawkingIn} opacity={Math.min(1, hawkingIn * 1.4) * (1 - hawkingOut)} dx={(1 - Math.min(1, hawkingIn)) * -120 - 160 * hawkingOut}>
          <NameCard role="Astrofísic" name="Stephen Hawking" nameAt={c.stephen} roleAt={c.astrophysicist} nameSize={80} />
        </Floating>
      ) : null}

      {frame >= c.necessity && godOut < 1 ? (
        <Floating x={300} y={1300} scale={0.6 + 0.4 * godIn} opacity={Math.min(1, godIn * 1.4) * (1 - godOut)} dx={-60 * godOut} dy={30 * godOut}>
          <div
            style={{
              padding: '12px 40px',
              borderRadius: 999,
              border: `5px dashed ${colors.white}`,
              fontFamily: headingFont,
              fontWeight: 700,
              fontSize: 56,
              lineHeight: 1.1,
              color: colors.white,
            }}
          >
            Déu
          </div>
        </Floating>
      ) : null}

      {frame >= c.the ? (
        <Floating x={540} y={366} scale={0.85 + 0.15 * rosenbergIn} opacity={Math.min(1, rosenbergIn * 1.4)} dx={(1 - Math.min(1, rosenbergIn)) * 120}>
          <NameCard role="Filòsof" name="Alex Rosenberg" nameAt={c.alex} nameSize={80} />
        </Floating>
      ) : null}

      {frame >= c.atheism ? (
        <Floating x={540} y={1190} scale={0.6 + 0.4 * atheismIn} opacity={Math.min(1, atheismIn * 1.4)}>
          <Pill size={72} tone="ink">
            Ateïsme
          </Pill>
        </Floating>
      ) : null}

      {frame >= c.comprehension ? (
        <Floating x={540} y={cy} scale={0.6 + 0.4 * comprehensionIn} opacity={Math.min(1, comprehensionIn * 1.4)}>
          <Pill size={44}>Comprensió científica de la realitat</Pill>
        </Floating>
      ) : null}
    </AbsoluteFill>
  );
};
