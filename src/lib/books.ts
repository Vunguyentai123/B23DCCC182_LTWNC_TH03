import { db } from './db';
import type { Book } from '@/types';

export interface BookFilters {
  category?: string;
  q?: string;
}

/**
 * Lấy danh sách sách trong thư viện, có lọc theo chuyên mục và tên sách.
 * Chờ 800ms để giả lập truy vấn chậm từ cơ sở dữ liệu.
 */
export async function loadBooksShift(filters: BookFilters = {}): Promise<Book[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const category = filters.category?.trim() ?? '';
  const q = filters.q?.trim().toLowerCase() ?? '';

  return db.books.filter((book) => {
    const matchesCategory = category === '' || book.category === category;
    const matchesTitle = q === '' || book.title.toLowerCase().includes(q);
    return matchesCategory && matchesTitle;
  });
}

/** Lấy một đầu sách theo id. */
export async function loadBookById(id: number): Promise<Book | undefined> {
  return db.books.find((book) => book.id === id);
}
