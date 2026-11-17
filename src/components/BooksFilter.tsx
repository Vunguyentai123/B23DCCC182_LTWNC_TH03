'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { useRouter } from 'next/navigation';
import { Filter, LoaderCircle, Search } from 'lucide-react';
import { CATEGORIES } from '@/data/books';

interface BooksFilterProps {
  initialQ: string;
  initialCategory: string;
}

export function BooksFilter({ initialQ, initialCategory }: BooksFilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [q, setQ] = useState(initialQ);
  const [category, setCategory] = useState(initialCategory);
  const firstRender = useRef(true);

  const goToResults = useCallback(
    (nextQ: string, nextCategory: string): void => {
      const params = new URLSearchParams();
      if (nextQ.trim()) params.set('q', nextQ.trim());
      if (nextCategory) params.set('category', nextCategory);
      const query = params.toString();
      startTransition(() => {
        router.replace(query ? `/books?${query}` : '/books', {
          scroll: false,
        });
      });
    },
    [router, startTransition],
  );

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      goToResults(q, category);
    }, 300);

    return () => clearTimeout(timer);
  }, [q, category, goToResults]);

  return (
    <form
      className="filters"
      method="get"
      action="/books"
      autoComplete="off"
      onSubmit={(event) => {
        event.preventDefault();
        goToResults(q, category);
      }}
    >
      <div className="field search-field">
        <label htmlFor="q">Tìm sách</label>
        <div className="search-input-wrap">
          <Search className="search-input-icon" size={18} aria-hidden="true" />
          <input
            id="q"
            name="q"
            type="search"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Nhập tên sách cần tìm..."
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="category">Chuyên mục</label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="">Tất cả</option>
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">
        <Filter size={16} aria-hidden="true" />
        Lọc
      </button>
      {isPending ? (
        <span className="search-pending">
          <LoaderCircle className="spin-icon" size={14} aria-hidden="true" />
          Đang tìm...
        </span>
      ) : null}
    </form>
  );
}
