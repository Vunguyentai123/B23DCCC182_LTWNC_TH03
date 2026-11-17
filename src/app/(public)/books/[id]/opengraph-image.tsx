import { ImageResponse } from 'next/og';
import { loadBookById } from '@/lib/books';

export const alt = 'Thư viện khoa CNTT PTIT';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface OpengraphImageProps {
  params: Promise<{ id: string }>;
}

export default async function OpengraphImage({ params }: OpengraphImageProps) {
  const { id } = await params;
  const book = await loadBookById(Number(id));

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0f172a',
          color: '#f8fafc',
          padding: '64px',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, color: '#93c5fd' }}>
          Thư viện khoa CNTT PTIT
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            {book?.title ?? 'Không tìm thấy sách'}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 24,
              fontSize: 34,
              color: '#cbd5e1',
            }}
          >
            {book?.author ?? ''}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 28,
            color: '#94a3b8',
          }}
        >
          <div style={{ display: 'flex' }}>{book?.category ?? ''}</div>
          <div style={{ display: 'flex' }}>
            {book ? `${book.copies} bản` : ''}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
