import { LoaderCircle } from 'lucide-react';

export default function BooksLoading() {
  return (
    <div className="loading-state">
      <LoaderCircle className="spin-icon" size={36} aria-hidden="true" />
      <p>Đang tải danh mục sách...</p>
    </div>
  );
}
