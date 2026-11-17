import Link from 'next/link';
import { ArrowRight, CircleCheck, ClipboardList, Search } from 'lucide-react';
import { loadBooksShift } from '@/lib/books';

export default async function HomePage() {
  const books = await loadBooksShift();
  const categories = Array.from(new Set(books.map((book) => book.category)));
  const categoryCount = categories.length;

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Thư viện số · Khoa CNTT</p>
          <h1>Thư viện khoa CNTT PTIT</h1>
          <p className="hero-lead">
            {books.length} đầu sách · {categoryCount} chuyên mục
          </p>
          <p className="hero-text">
            Tra cứu sách theo chuyên mục, xem chi tiết từng đầu sách và gửi yêu
            cầu mượn trực tuyến. Thủ thư sẽ duyệt yêu cầu của bạn trong thời
            gian sớm nhất.
          </p>
          <div className="hero-actions">
            <Link href="/books" className="btn btn-hero">
              Xem danh mục sách
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="hero-panel" aria-label="Thống kê thư viện">
          <div className="stat">
            <span className="stat-value">{books.length}</span>
            <span className="stat-label">Đầu sách</span>
          </div>
          <div className="stat">
            <span className="stat-value">{categoryCount}</span>
            <span className="stat-label">Chuyên mục</span>
          </div>
          <div className="stat">
            <span className="stat-value">7–30</span>
            <span className="stat-label">Ngày mượn</span>
          </div>
          <div className="stat">
            <span className="stat-value">24/7</span>
            <span className="stat-label">Tra cứu</span>
          </div>
        </div>
      </section>

      <div className="feature-grid">
        <article className="feature-card">
          <span className="feature-icon">
            <Search size={22} aria-hidden="true" />
          </span>
          <h2>Tra cứu dễ dàng</h2>
          <p>
            Tìm sách theo tên hoặc chuyên mục, xem số bản của từng đầu sách
            trước khi mượn.
          </p>
        </article>
        <article className="feature-card">
          <span className="feature-icon">
            <ClipboardList size={22} aria-hidden="true" />
          </span>
          <h2>Gửi yêu cầu mượn</h2>
          <p>
            Chọn ngày lấy, thời hạn và số quyển; hệ thống tự kiểm tra tồn kho
            theo từng ngày.
          </p>
        </article>
        <article className="feature-card">
          <span className="feature-icon">
            <CircleCheck size={22} aria-hidden="true" />
          </span>
          <h2>Theo dõi trạng thái</h2>
          <p>
            Xem yêu cầu đang chờ, đã duyệt hoặc bị từ chối ngay trong tài khoản
            của bạn.
          </p>
        </article>
      </div>

      <div className="category-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Khám phá</p>
            <h2>Chuyên mục sách</h2>
          </div>
          <Link href="/books" className="btn btn-ghost btn-sm">
            Xem tất cả sách
          </Link>
        </div>
        <div className="category-pills">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/books?category=${encodeURIComponent(category)}`}
              className="category-pill"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
