import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
} from 'remotion';

type EsglesiaVideoProps = {
  title: string;
  subtitle: string;
};

export const EsglesiaVideo = ({ title, subtitle }: EsglesiaVideoProps) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(frame, [0, 60], [1.08, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 35%, #f8e7b5 100%)',
        fontFamily: 'Arial, sans-serif',
        color: '#f8fafc',
      }}
    >
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 25% 20%, rgba(248, 231, 181, 0.38), transparent 28%), radial-gradient(circle at 75% 70%, rgba(148, 163, 184, 0.3), transparent 30%)',
        }}
      />

      <Sequence from={0} durationInFrames={180}>
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity,
            transform: `scale(${scale})`,
            transition: 'transform 0.3s ease',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              maxWidth: 1200,
              padding: 40,
            }}
          >
            <div
              style={{
                fontSize: 28,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#f8e7b5',
                marginBottom: 24,
              }}
            >
              Benvinguts a
            </div>
            <div
              style={{
                fontSize: 104,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
              }}
            >
              {title}
            </div>
            <div
              style={{
                marginTop: 28,
                fontSize: 42,
                color: '#e2e8f0',
                letterSpacing: '0.02em',
              }}
            >
              {subtitle}
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={90} durationInFrames={90}>
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: 90,
          }}
        >
          <div
            style={{
              fontSize: 30,
              color: '#f8fafc',
              background: 'rgba(15, 23, 42, 0.48)',
              borderRadius: 20,
              padding: '18px 28px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: '1px solid rgba(248, 231, 181, 0.4)',
            }}
          >
            La fe ens acompanya
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
