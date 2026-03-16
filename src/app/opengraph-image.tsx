import { ImageResponse } from 'next/og';

export const alt = 'Assay — COBOL Documentation Generator';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#060b18',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Subtle grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* Logo - Periodic Element Style */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              background: '#060b18',
              borderRadius: 8,
              border: '2px solid rgba(0, 212, 255, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 10,
                color: 'rgba(0, 212, 255, 0.6)',
                position: 'absolute',
                top: 4,
                left: 6,
              }}
            >
              33
            </span>
            <span
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 26,
                fontWeight: 700,
                color: '#00d4ff',
                marginTop: 4,
              }}
            >
              As
            </span>
          </div>
          <span style={{ fontSize: 28, fontWeight: 600, color: 'white' }}>
            Assay
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.1,
            margin: '0 0 24px 0',
            maxWidth: 900,
          }}
        >
          Your COBOL codebase,{' '}
          <span style={{ color: '#00d4ff' }}>finally understood.</span>
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontSize: 22,
            color: '#8899bb',
            textAlign: 'center',
            margin: '0 0 48px 0',
            maxWidth: 700,
            lineHeight: 1.5,
          }}
        >
          Documentation for legacy COBOL. Business rules, dependency
          maps, dead code detection.
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 48 }}>
          {[
            { value: '1M', label: 'Token Context' },
            { value: '5', label: 'Analysis Passes' },
            { value: '14-Day', label: 'Turnaround' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                {stat.value}
              </span>
              <span style={{ fontSize: 13, color: '#6b7a99', letterSpacing: '0.05em' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(0, 212, 255, 0.06)',
            border: '1px solid rgba(0, 212, 255, 0.15)',
            borderRadius: 999,
            padding: '6px 16px',
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#00d4ff',
            }}
          />
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 11,
              color: '#00d4ff',
              letterSpacing: '0.08em',
            }}
          >
            POWERED BY CLAUDE OPUS 4.6 · SOLAISOFT PTY LTD
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
