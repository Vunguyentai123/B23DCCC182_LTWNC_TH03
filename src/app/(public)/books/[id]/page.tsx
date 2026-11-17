import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { loadBookById, loadBooksShift } from '@/lib/books';

export const revalidate = 60;

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const books = await loadBooksShift();
  return books.slice(0, 12).map((book) => ({ id: String(book.id) }));
}

export async function generateMetadata({
  params,
}: BookDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const book = await loadBookById(Number(id));

  if (!book) {
    return { title: 'Không tìm thấy sách' };
  }

  return {
    title: `${book.title} – ${book.author}`,
    description: `Sách ${book.category}, thư viện có ${book.copies} bản`,
  };
}

const updatedTime = (): string => {
  const now = new Date();
  const pad = (value: number): string => String(value).padStart(2, '0');
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;
  const book = await loadBookById(Number(id));

  if (!book) {
    notFound();
  }

  return (
    <article className="card">
      <h1>{book.title}</h1>
      <p>Tác giả: {book.author}</p>
      <p>Chuyên mục: {book.category}</p>
      <p>Số bản: {book.copies}</p>
      <p>Cập nhật lúc: {updatedTime()}</p>
      <p>
        <Link href={`/loans?book=${book.id}`}>Mượn sách này</Link>
      </p>
    </article>
  );
}
