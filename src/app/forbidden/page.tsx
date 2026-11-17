import Link from 'next/link';

export const metadata = {
  title: 'Không có quyền truy cập',
  robots: { index: false },
};

export default function ForbiddenPage() {
  return (
    <section className="notice">
      <h1>Bạn không có quyền truy cập trang này</h1>
      <p>
        <Link href="/">Quay về trang chủ</Link>
      </p>
    </section>
  );
}
