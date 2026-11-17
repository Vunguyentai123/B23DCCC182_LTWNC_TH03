import type { MetadataRoute } from 'next';
import { loadBooksShift } from '@/lib/books';

const BASE_URL = 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const books = await loadBooksShift();

  return [
    { url: BASE_URL },
    { url: `${BASE_URL}/books` },
    ...books.map((book) => ({ url: `${BASE_URL}/books/${book.id}` })),
  ];
}
