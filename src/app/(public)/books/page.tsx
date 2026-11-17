import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { BooksFilter } from '@/components/BooksFilter';
import { loadBooksShift } from '@/lib/books';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Danh mục sách',
};

interface BooksPageProps {
  searchParams: Promise<{ category?: string | string[]; q?: string | string[] }>;
}

const firstValue = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? (value[0] ?? '') : (value ?? '');

const renderTime = (): string => {
  const now = new Date();
  const pad = (value: number): string => String(value).padStart(2, '0');
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const params = await searchParams;
  const q = firstValue(params.q);
  const category = firstValue(params.category);
  const books = await loadBooksShift({ category, q });

  return (
    <section>
      <header className="page-head">
        <p className="eyebrow">Kho sách</p>
        <h1>Danh mục sách</h1>
        <p className="page-subtitle">
          Tìm nhanh theo tên sách hoặc chọn một chuyên mục bên dưới.
        </p>
      </header>

      <div className="panel filter-panel">
        <BooksFilter initialQ={q} initialCategory={category} />
      </div>

      <div className="results-meta">
        <p className="result-count">Tìm thấy {books.length} sách</p>
        <p className="render-time">Render lúc: {renderTime()}</p>
      </div>

      {books.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">
            <SearchX size={28} aria-hidden="true" />
          </span>
          <p>Không tìm thấy sách nào</p>
          <p className="muted">
            Thử từ khóa khác hoặc bỏ chọn chuyên mục để xem toàn bộ danh mục.
          </p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>Số bản</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>
                    <Link className="book-link" href={`/books/${book.id}`}>
                      {book.title}
                    </Link>
                  </td>
                  <td className="muted">{book.author}</td>
                  <td>
                    <span className="copy-badge">Số bản: {book.copies}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
