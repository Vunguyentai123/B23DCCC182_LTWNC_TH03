import Link from 'next/link';
import { CATEGORIES } from '@/data/books';
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
      <h1>Danh mục sách</h1>

      <form className="filters" method="get" action="/books" autoComplete="off">
        <div className="field">
          <label htmlFor="q">Tìm sách</label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="field">
          <label htmlFor="category">Chuyên mục</label>
          <select id="category" name="category" defaultValue={category}>
            <option value="">Tất cả</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Lọc</button>
      </form>

      <p>Tìm thấy {books.length} sách</p>
      <p>Render lúc: {renderTime()}</p>

      {books.length === 0 ? (
        <p className="notice">Không tìm thấy sách nào</p>
      ) : (
        <table>
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
                  <Link href={`/books/${book.id}`}>{book.title}</Link>
                </td>
                <td>{book.author}</td>
                <td>Số bản: {book.copies}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
