import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get('title') || 'Polpo UI';
  const description =
    searchParams.get('description') ||
    'Chat components for AI agents';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#0F0F0F',
          color: '#F0F0F0',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top bar accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #E2733D, #F07052)',
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              fontSize: '16px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#E2733D',
              fontWeight: 600,
            }}
          >
            @polpo-ai/chat
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '20px',
            maxWidth: '900px',
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '24px',
            color: '#999',
            lineHeight: 1.5,
            maxWidth: '700px',
          }}
        >
          {description}
        </div>

        {/* Bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '18px',
            color: '#666',
          }}
        >
          ui.polpo.sh
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
