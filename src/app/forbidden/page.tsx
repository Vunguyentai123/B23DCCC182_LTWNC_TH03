import Link from 'next/link';
import { ArrowLeft, ShieldX } from 'lucide-react';

export const metadata = {
  title: 'Không có quyền truy cập',
  robots: { index: false },
};

export default function ForbiddenPage() {
  return (
    <section className="state-page">
      <span className="state-icon">
        <ShieldX size={32} aria-hidden="true" />
      </span>
      <h1>Bạn không có quyền truy cập trang này</h1>
      <p className="muted">
        Trang này chỉ dành cho quản trị viên của thư viện.
      </p>
      <Link href="/" className="btn btn-primary">
        <ArrowLeft size={16} aria-hidden="true" />
        Quay về trang chủ
      </Link>
    </section>
  );
}
