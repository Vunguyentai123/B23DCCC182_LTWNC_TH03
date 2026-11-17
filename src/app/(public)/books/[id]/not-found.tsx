import Link from 'next/link';
import { ArrowLeft, BookX } from 'lucide-react';

export default function BookNotFound() {
  return (
    <section className="state-page">
      <span className="state-icon">
        <BookX size={32} aria-hidden="true" />
      </span>
      <h1>Không tìm thấy sách</h1>
      <p className="muted">
        Đầu sách bạn tìm có thể đã bị xóa hoặc đường dẫn không đúng.
      </p>
      <Link href="/books" className="btn btn-primary">
        <ArrowLeft size={16} aria-hidden="true" />
        Quay lại danh mục sách
      </Link>
    </section>
  );
}
