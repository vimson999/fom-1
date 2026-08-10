import { ImageResponse } from 'next/og';

export const alt = 'Fields of Mistria Guide — curated fan guides and item references';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const rows = [
  { color: '#d7a849', width: '100%' },
  { color: '#95aa68', width: '92%' },
  { color: '#5f845f', width: '84%' },
  { color: '#315e48', width: '76%' },
  { color: '#173e31', width: '68%' }
];

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 78px 58px',
        color: '#173e31',
        background: '#fbf6e9'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 930 }}>
        <div style={{ display: 'flex', color: '#8a692a', fontSize: 27, fontWeight: 700, letterSpacing: 5 }}>
          INDEPENDENT FAN GUIDE
        </div>
        <div style={{ display: 'flex', marginTop: 22, fontSize: 79, fontWeight: 800, lineHeight: 1.04 }}>
          Fields of Mistria
        </div>
        <div style={{ display: 'flex', marginTop: 20, color: '#456253', fontSize: 31 }}>
          Source-based guides and curated item references
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, width: '100%' }}>
        {rows.map((row) => (
          <div key={row.color} style={{ display: 'flex', width: row.width, height: 15, background: row.color }} />
        ))}
      </div>
    </div>,
    size
  );
}
