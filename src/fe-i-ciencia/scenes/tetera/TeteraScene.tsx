import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandBackground } from '../../components/BrandBackground';
import { NameCard } from '../../components/NameCard';
import { Pill } from '../../components/Pill';
import { useBrandFonts } from '../../fonts';
import { Cup } from '../../illustrations/Cup';
import { ProcessInterior } from '../../illustrations/ProcessInterior';
import { Teapot, TEAPOT_VIEWBOX } from '../../illustrations/Teapot';
import { UniverseInterior } from '../../illustrations/UniverseInterior';
import { clamp, colors, easeInOut, easeOut, headingFont, pop, settle } from '../../theme';
import {
  bump,
  c,
  cameraAt,
  cupAt,
  FUSED,
  fuseAt,
  LEFT_CLOSE,
  lensAt,
  purposeDiscAt,
  ramp,
  RIGHT_CLOSE,
  spoutTip,
} from './motion';

const QUESTION = 'Per què està bullint aquesta aigua?';
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const Floating: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly scale?: number;
  readonly opacity?: number;
  readonly rotate?: number;
  readonly dx?: number;
  readonly anchor?: 'center' | 'right';
  readonly children: React.ReactNode;
}> = ({ x, y, scale = 1, opacity = 1, rotate = 0, dx = 0, anchor = 'center', children }) => (
  <div
    style={{
      position: 'absolute',
      top: y,
      display: 'flex',
      ...(anchor === 'center'
        ? { left: x, translate: `calc(-50% + ${dx}px) -50%` }
        : { right: 1080 - x, translate: `${dx}px -50%`, transformOrigin: 'right center' }),
      scale: `${Math.max(0, scale)}`,
      rotate: `${rotate}deg`,
      opacity: Math.max(0, Math.min(1, opacity)),
    }}
  >
    {children}
  </div>
);

const CheckBadge: React.FC<{ readonly x: number; readonly y: number; readonly scale: number; readonly opacity: number }> = ({
  x,
  y,
  scale,
  opacity,
}) => (
  <g transform={`translate(${x} ${y}) scale(${Math.max(0, scale)})`} opacity={opacity}>
    <circle r={50} fill={colors.white} />
    <path d="M -22 2 L -6 18 L 24 -16" fill="none" stroke={colors.teal} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

const processLabels = [
  { text: 'Flama', at: c.flame, x: -0.66, y: 0.74 },
  { text: 'Energia', at: c.energy, x: 0.62, y: 0.36 },
  { text: 'Molècules', at: c.molecules, x: -0.5, y: 0.14 },
  { text: "Punt d'ebullició", at: c.boilingPoint, x: 0, y: -0.6 },
];

const faithQuestions = [
  { text: 'Per què existeix?', at: c.whyExists, y: 640 },
  { text: 'Quin sentit té?', at: c.meaning, y: 790 },
  { text: 'Qui hi ha darrere?', at: c.behind, y: 940 },
];

const crackPoints = Array.from({ length: 9 }, (_, i) => `${540 + (i % 2 === 0 ? -16 : 16)},${660 + i * 35}`).join(' ');

export const TeteraScene: React.FC = () => {
  useBrandFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const camera = cameraAt(frame);
  const lens = lensAt(frame, fps, camera);
  const purposeDisc = purposeDiscAt(frame, fps);
  const fuse = fuseAt(frame, fps);
  const universe = ramp(frame, c.sameWay, 24);
  const comparisonOut = 1 - universe;
  const splitX = frame >= c.whichCorrect ? 540 : 99999;

  const cardIn = pop(frame, fps, c.lennox, 14);
  const cardLift = settle(frame, fps, c.invitation, 24);
  const cardOut = ramp(frame, c.teapot - 8, 14);

  const lensDraw = interpolate(frame, [c.invitation, c.invitation + 20], [0, 1], { ...clamp, easing: easeOut });
  const handleGrow = interpolate(frame, [c.invitation + 12, c.invitation + 26], [0, 1], { ...clamp, easing: easeOut });
  const handleFade = 1 - ramp(frame, c.however, 16);
  const inside = interpolate(frame, [c.someone + 14, c.someone + 34], [0, 1], clamp);
  const ringWidth = (r: number) => Math.min(34, Math.max(10, r * 0.09));

  const appear = pop(frame, fps, c.teapot, 13);
  const teapotExit = ramp(frame, c.whichCorrect, 20);
  const heat = interpolate(frame, [c.teapot, c.flame, c.boilingPoint], [0.35, 0.85, 1], clamp);
  const steam = interpolate(
    frame,
    [c.teapot + 6, c.boiling, c.boilingPoint, c.however + 30, c.want, c.want + 10],
    [0.25, 0.6, 1, 0.55, 0.55, 0.15],
    clamp,
  );
  const jiggle = interpolate(
    frame,
    [c.boiling - 6, c.boiling + 6, c.question, c.boilingPoint, c.perfect + 12, c.however + 18],
    [0, 1, 0.45, 1, 1, 0],
    clamp,
  );
  const burner = 1 - ramp(frame, c.however, 24);
  const tilt = interpolate(frame, [c.want, c.want + 22, c.cup + 22, c.whichCorrect + 12], [0, 32, 32, 0], {
    ...clamp,
    easing: easeInOut,
  });

  const energy = interpolate(frame, [c.energy - 12, c.energy + 4], [0, 1], clamp);
  const absorb = interpolate(frame, [c.absorbs, c.absorbs + 30], [0, 1], clamp);
  const agitation = interpolate(frame, [c.molecules - 8, c.move + 8], [0.15, 1], clamp);
  const boil = interpolate(frame, [c.boilingPoint - 14, c.boilingPoint + 10], [0, 1], clamp);
  const labelsOut = 1 - ramp(frame, c.perfect, 8);

  const bubbleIn = pop(frame, fps, c.question, 13);
  const toHeader = ramp(frame, c.someone, 14);
  const headerOut = ramp(frame, c.sameWay, 12);
  const headerPulse = bump(frame, c.sameQuestion, 6, 14);

  const cup = cupAt(frame, fps);
  const cupIn = pop(frame, fps, c.purpose, 12);
  const cupFill = interpolate(frame, [c.cup - 4, c.cup + 24], [0, 1], clamp);
  const cupSteam = interpolate(frame, [c.cup + 14, c.cup + 34], [0, 1], clamp);
  const tip = spoutTip(camera, tilt);
  const rim = { x: cup.x, y: cup.y - 60 * (cup.w / 270) + 6 };
  const streamHead = interpolate(frame, [c.want + 16, c.want + 26], [0, 1], clamp);
  const streamTail = interpolate(frame, [c.cup + 18, c.cup + 28], [0, 1], clamp);

  const questionMark = pop(frame, fps, c.whichCorrect + 10, 10) * (1 - ramp(frame, c.both, 6));
  const leftBadgeIn = pop(frame, fps, c.perfect + 2, 10);
  const rightBadgeIn = pop(frame, fps, c.both, 10);
  const bothPulse = 1 + 0.25 * bump(frame, c.both, 6, 12);
  const leftBadgeAngle = toRadians(interpolate(frame, [c.whichCorrect, c.whichCorrect + 26], [-45, -135], { ...clamp, easing: easeInOut }));
  const crackHead = interpolate(frame, [c.notContradict + 8, c.notContradict + 14], [0, 1], clamp);
  const crackTail = interpolate(frame, [c.contradict + 8, c.contradict + 18], [0, 1], clamp);
  const plusIn = pop(frame, fps, c.complement + 12, 10);
  const howLabel = pop(frame, fps, c.how, 12);
  const finalityLabel = pop(frame, fps, c.finality, 12);
  const leftLabelX = frame < c.complement ? lens.cx : LEFT_CLOSE.cx;
  const rightLabelX = frame < c.complement ? purposeDisc.cx : RIGHT_CLOSE.cx;

  const grid = interpolate(frame, [c.howWorks, c.universe + 12], [0, 1], clamp);
  const halo = settle(frame, fps, c.behind, 24);
  const scienceIn = pop(frame, fps, c.science, 12);
  const howWorksIn = pop(frame, fps, c.howWorks, 12);
  const faithIn = pop(frame, fps, c.faith, 12);

  const highlightStart = toRadians(200);
  const highlightEnd = toRadians(250);
  const highlightRadius = lens.r * 0.72;

  return (
    <AbsoluteFill>
      <BrandBackground />

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: TEAPOT_VIEWBOX.width,
          height: TEAPOT_VIEWBOX.height,
          transformOrigin: '0 0',
          translate: `${camera.x}px ${camera.y}px`,
          scale: `${camera.s}`,
        }}
      >
        <div
          style={{
            width: TEAPOT_VIEWBOX.width,
            height: TEAPOT_VIEWBOX.height,
            transformOrigin: '400px 702px',
            scale: `${(0.35 + 0.65 * appear) * (1 - 0.3 * teapotExit)}`,
            opacity: Math.min(1, appear * 1.6) * (1 - teapotExit),
          }}
        >
          <Teapot frame={frame} heat={heat} steam={steam} jiggle={jiggle} burner={burner} tilt={tilt} />
        </div>
      </div>

      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <clipPath id="tetera-lens-clip">
            <circle cx={lens.cx} cy={lens.cy} r={lens.r} />
          </clipPath>
          <clipPath id="tetera-purpose-clip">
            <circle cx={purposeDisc.cx} cy={purposeDisc.cy} r={purposeDisc.r} />
          </clipPath>
          <clipPath id="tetera-left-half">
            <rect x={-2000} y={-2000} width={splitX + 2000} height={6000} />
          </clipPath>
          <clipPath id="tetera-right-half">
            <rect x={splitX} y={-2000} width={6000} height={6000} />
          </clipPath>
        </defs>

        {halo > 0.001 ? <circle cx={lens.cx} cy={lens.cy} r={lens.r + 44 * halo} fill={colors.white} opacity={0.92 * halo} /> : null}

        {frame >= c.whichCorrect ? (
          <g clipPath="url(#tetera-right-half)">
            <g clipPath="url(#tetera-purpose-clip)">
              <circle cx={purposeDisc.cx} cy={purposeDisc.cy} r={purposeDisc.r} fill={colors.teal} />
              {universe > 0 ? (
                <g opacity={universe}>
                  <UniverseInterior cx={purposeDisc.cx} cy={purposeDisc.cy} r={purposeDisc.r} frame={frame} grid={0} />
                </g>
              ) : null}
            </g>
            <circle
              cx={purposeDisc.cx}
              cy={purposeDisc.cy}
              r={purposeDisc.r}
              fill="none"
              stroke={colors.ink}
              strokeWidth={ringWidth(purposeDisc.r)}
            />
          </g>
        ) : null}

        {lensDraw > 0 ? (
          <g>
            <g clipPath="url(#tetera-left-half)">
              <g clipPath="url(#tetera-lens-clip)">
                <circle cx={lens.cx} cy={lens.cy} r={lens.r} fill={colors.white} opacity={0.16 * lensDraw * (1 - inside)} />
                {inside > 0 && universe < 1 ? (
                  <g opacity={inside * (1 - universe)}>
                    <ProcessInterior
                      cx={lens.cx}
                      cy={lens.cy}
                      r={lens.r}
                      frame={frame}
                      heat={heat}
                      energy={energy}
                      absorb={absorb}
                      agitation={agitation}
                      boil={boil}
                    />
                  </g>
                ) : null}
                {universe > 0 ? (
                  <g opacity={universe}>
                    <UniverseInterior cx={lens.cx} cy={lens.cy} r={lens.r} frame={frame} grid={grid} />
                  </g>
                ) : null}
              </g>
              <circle
                cx={lens.cx}
                cy={lens.cy}
                r={lens.r}
                fill="none"
                stroke={colors.ink}
                strokeWidth={ringWidth(lens.r)}
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - lensDraw}
              />
            </g>
            <path
              d={`M ${lens.cx + highlightRadius * Math.cos(highlightStart)} ${lens.cy + highlightRadius * Math.sin(highlightStart)} A ${highlightRadius} ${highlightRadius} 0 0 1 ${lens.cx + highlightRadius * Math.cos(highlightEnd)} ${lens.cy + highlightRadius * Math.sin(highlightEnd)}`}
              fill="none"
              stroke={colors.white}
              strokeWidth={lens.r * 0.06}
              strokeLinecap="round"
              opacity={0.75 * lensDraw * (1 - inside)}
            />
            {handleGrow * handleFade > 0 ? (
              <line
                x1={lens.cx + lens.r * Math.SQRT1_2}
                y1={lens.cy + lens.r * Math.SQRT1_2}
                x2={lens.cx + lens.r * (1 + 0.85 * handleGrow) * Math.SQRT1_2}
                y2={lens.cy + lens.r * (1 + 0.85 * handleGrow) * Math.SQRT1_2}
                stroke={colors.ink}
                strokeWidth={Math.min(48, Math.max(14, lens.r * 0.2))}
                strokeLinecap="round"
                opacity={handleFade}
              />
            ) : null}
          </g>
        ) : null}

        {fuse > 0 ? (
          <line
            x1={540}
            y1={lens.cy - lens.r}
            x2={540}
            y2={lens.cy + lens.r}
            stroke={colors.white}
            strokeWidth={6}
            opacity={Math.min(1, fuse) * (1 - 0.4 * universe)}
          />
        ) : null}

        {crackHead > crackTail ? (
          <polyline
            points={crackPoints}
            fill="none"
            stroke={colors.white}
            strokeWidth={10}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={`${crackHead - crackTail} 2`}
            strokeDashoffset={-crackTail}
          />
        ) : null}

        {streamHead > streamTail ? (
          <path
            d={`M ${tip.x} ${tip.y} Q ${tip.x + 36} ${tip.y + 18} ${rim.x} ${rim.y}`}
            fill="none"
            stroke={colors.white}
            strokeWidth={16}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={`${streamHead - streamTail} 2`}
            strokeDashoffset={-streamTail}
          />
        ) : null}

        {frame >= c.purpose && universe < 1 ? (
          <g clipPath={frame >= c.whichCorrect ? 'url(#tetera-right-half)' : undefined}>
            <Cup
              x={cup.x}
              y={cup.y}
              width={cup.w * (0.4 + 0.6 * cupIn)}
              fill={cupFill}
              steam={cupSteam}
              frame={frame}
              opacity={Math.min(1, cupIn * 1.5) * comparisonOut}
            />
          </g>
        ) : null}

        {frame >= c.perfect && universe < 1 ? (
          <CheckBadge
            x={lens.cx + lens.r * Math.cos(leftBadgeAngle)}
            y={lens.cy + lens.r * Math.sin(leftBadgeAngle)}
            scale={leftBadgeIn * bothPulse}
            opacity={comparisonOut}
          />
        ) : null}
        {frame >= c.both && universe < 1 ? (
          <CheckBadge
            x={purposeDisc.cx + purposeDisc.r * Math.SQRT1_2}
            y={purposeDisc.cy - purposeDisc.r * Math.SQRT1_2}
            scale={rightBadgeIn * bothPulse}
            opacity={comparisonOut}
          />
        ) : null}

        {frame >= c.complement + 12 && universe < 1 ? (
          <g transform={`translate(540 ${FUSED.cy - FUSED.r}) scale(${Math.max(0, plusIn)})`} opacity={comparisonOut}>
            <circle r={46} fill={colors.white} />
            <path d="M -20 0 L 20 0 M 0 -20 L 0 20" stroke={colors.teal} strokeWidth={12} strokeLinecap="round" />
          </g>
        ) : null}
      </svg>

      {frame >= c.lennox && frame < c.teapot + 8 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 640,
            display: 'flex',
            justifyContent: 'center',
            opacity: Math.min(1, cardIn * 1.4) * (1 - cardOut),
            translate: `${-140 * cardOut}px ${(1 - Math.min(1, cardIn)) * 70 - 330 * cardLift}px`,
            scale: `${(0.9 + 0.1 * cardIn) * (1 - 0.22 * cardLift)}`,
          }}
        >
          <NameCard role="Teòleg i matemàtic" name="John Lennox" nameAt={c.lennoxName} />
        </div>
      ) : null}

      {frame >= c.question && frame < c.someone + 16 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 300,
            display: 'flex',
            justifyContent: 'center',
            transformOrigin: '50% 100%',
            opacity: Math.min(1, bubbleIn * 1.4) * (1 - toHeader),
            scale: `${(0.6 + 0.4 * bubbleIn) * (1 - 0.3 * toHeader)}`,
            translate: `0px ${-70 * toHeader}px`,
          }}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: 860,
              padding: '30px 50px 34px',
              borderRadius: 44,
              background: colors.white,
              color: colors.teal,
              fontFamily: headingFont,
              fontWeight: 700,
              fontSize: 68,
              lineHeight: 1.12,
              letterSpacing: 0,
              textAlign: 'center',
              textWrap: 'balance',
              boxShadow: '0 24px 60px rgba(18, 24, 12, 0.2)',
            }}
          >
            {QUESTION}
            <svg width={84} height={58} viewBox="0 0 84 58" style={{ position: 'absolute', left: '34%', bottom: -54 }}>
              <path d="M 0 0 L 84 0 L 14 58 Z" fill={colors.white} />
            </svg>
          </div>
        </div>
      ) : null}

      {frame >= c.someone && headerOut < 1 ? (
        <Floating x={540} y={294} opacity={toHeader * (1 - headerOut)} scale={(0.9 + 0.1 * toHeader) * (1 + 0.08 * headerPulse)}>
          <Pill tone="ink" size={44}>
            {QUESTION}
          </Pill>
        </Floating>
      ) : null}

      {frame >= c.flame && labelsOut > 0
        ? processLabels.map((label) => {
            if (frame < label.at) return null;
            const p = pop(frame, fps, label.at, 12);
            return (
              <Floating
                key={label.text}
                x={lens.cx + label.x * lens.r}
                y={lens.cy + label.y * lens.r}
                scale={p}
                opacity={Math.min(1, p * 1.5) * labelsOut}
              >
                <Pill size={44}>{label.text}</Pill>
              </Floating>
            );
          })
        : null}

      {questionMark > 0.001 ? (
        <Floating x={540} y={800} scale={questionMark} rotate={Math.sin((frame - c.whichCorrect) / 4) * 8}>
          <Pill size={84}>?</Pill>
        </Floating>
      ) : null}

      {frame >= c.how && comparisonOut > 0 ? (
        <Floating x={leftLabelX} y={lens.cy + lens.r + 70} scale={howLabel} opacity={Math.min(1, howLabel * 1.5) * comparisonOut}>
          <Pill size={44}>Com passa</Pill>
        </Floating>
      ) : null}
      {frame >= c.finality && comparisonOut > 0 ? (
        <Floating
          x={rightLabelX}
          y={purposeDisc.cy + purposeDisc.r + 70}
          scale={finalityLabel}
          opacity={Math.min(1, finalityLabel * 1.5) * comparisonOut}
        >
          <Pill size={44}>Quina finalitat té</Pill>
        </Floating>
      ) : null}

      {frame >= c.science ? (
        <Floating x={280} y={380} scale={scienceIn} opacity={Math.min(1, scienceIn * 1.5)}>
          <Pill size={60}>Ciència</Pill>
        </Floating>
      ) : null}
      {frame >= c.howWorks ? (
        <Floating x={330} y={1190} scale={howWorksIn} opacity={Math.min(1, howWorksIn * 1.5)}>
          <Pill size={46}>Com funciona</Pill>
        </Floating>
      ) : null}
      {frame >= c.faith ? (
        <Floating x={800} y={380} scale={faithIn} opacity={Math.min(1, faithIn * 1.5)}>
          <Pill size={60}>Fe</Pill>
        </Floating>
      ) : null}
      {faithQuestions.map((question) => {
        if (frame < question.at) return null;
        const p = pop(frame, fps, question.at, 12);
        return (
          <Floating
            key={question.text}
            x={1000}
            y={question.y}
            anchor="right"
            dx={(1 - Math.min(1, p)) * -140}
            scale={p}
            opacity={Math.min(1, p * 1.5)}
          >
            <Pill size={44}>{question.text}</Pill>
          </Floating>
        );
      })}
    </AbsoluteFill>
  );
};
