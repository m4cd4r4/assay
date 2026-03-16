'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          background: '#060b18',
          color: '#e4e8f0',
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          margin: 0,
          textAlign: 'center',
          padding: '24px',
        }}
      >
        <div>
          <p
            style={{
              color: '#00d4ff',
              fontFamily: 'monospace',
              fontSize: '11px',
              letterSpacing: '0.1em',
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}
          >
            {error.digest ? `Error ${error.digest}` : 'Critical Error'}
          </p>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>
            Assay is temporarily unavailable
          </h2>
          <p style={{ color: '#8899bb', fontSize: '14px', marginBottom: '32px' }}>
            The application encountered a critical error.
          </p>
          <button
            onClick={reset}
            style={{
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.2)',
              color: '#00d4ff',
              padding: '10px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
