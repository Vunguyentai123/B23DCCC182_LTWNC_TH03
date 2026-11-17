import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, BookPlus } from 'lucide-react';
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: { '@type': 'Person', name: book.author },
    genre: book.category,
    inLanguage: 'vi',
    url: `http://localhost:3000/books/${book.id}`,
    publisher: {
      '@type': 'Organization',
      name: 'Thư viện khoa CNTT PTIT',
    },
  };

  return (
    <article className="detail-card">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="book-cover" aria-hidden="true">
        <BookOpen className="book-cover-icon" size={56} strokeWidth={1.2} />
        <span className="book-cover-kicker">Thư viện CNTT</span>
        <strong className="book-cover-title">{book.title}</strong>
        <span className="book-cover-category">{book.category}</span>
      </div>

      <div className="detail-body">
        <p className="eyebrow">{book.category}</p>
        <h1>{book.title}</h1>
        <p className="detail-author">Tác giả: {book.author}</p>

        <div className="detail-meta">
          <p>Chuyên mục: {book.category}</p>
          <p>Số bản: {book.copies}</p>
          <p className="muted">Cập nhật lúc: {updatedTime()}</p>
        </div>

        <div className="detail-actions">
          <Link href={`/loans?book=${book.id}`} className="btn btn-primary">
            <BookPlus size={18} aria-hidden="true" />
            Mượn sách này
          </Link>
          <Link href="/books" className="btn btn-ghost">
            <ArrowLeft size={16} aria-hidden="true" />
            Danh mục sách
          </Link>
        </div>
      </div>
    </article>
  );
}
