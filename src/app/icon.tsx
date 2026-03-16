import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#060b18',
          borderRadius: 4,
          border: '1.5px solid rgba(0, 212, 255, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px',
        }}
      >
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 4,
            fontWeight: 400,
            color: 'rgba(0, 212, 255, 0.7)',
            position: 'absolute',
            top: 2,
            left: 3,
          }}
        >
          33
        </span>
        <span
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 14,
            fontWeight: 700,
            color: '#00d4ff',
            marginTop: 1,
          }}
        >
          As
        </span>
      </div>
    ),
    { ...size }
  );
}
