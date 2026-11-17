import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Check, LibraryBig } from 'lucide-react';
import { auth } from '@/auth';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Đăng nhập',
  robots: { index: false },
};

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  if (session?.user) {
    redirect('/');
  }

  const params = await searchParams;
  const rawCallbackUrl = Array.isArray(params.callbackUrl)
    ? params.callbackUrl[0]
    : params.callbackUrl;
  const callbackUrl =
    rawCallbackUrl && rawCallbackUrl.startsWith('/') ? rawCallbackUrl : '/loans';

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="auth-aside">
          <span className="brand-mark brand-mark-lg">
            <LibraryBig size={30} aria-hidden="true" />
          </span>
          <p className="eyebrow">Thư viện khoa CNTT PTIT</p>
          <h2>Mượn sách dễ dàng hơn</h2>
          <ul className="auth-points">
            <li>
              <Check size={15} aria-hidden="true" />
              Tra cứu 24 đầu sách theo chuyên mục
            </li>
            <li>
              <Check size={15} aria-hidden="true" />
              Gửi yêu cầu mượn trực tuyến
            </li>
            <li>
              <Check size={15} aria-hidden="true" />
              Theo dõi trạng thái duyệt mọi lúc
            </li>
          </ul>
        </div>

        <div className="auth-form-wrap">
          <p className="eyebrow">Chào mừng trở lại</p>
          <h1>Đăng nhập</h1>
          <p className="page-subtitle">
            Dùng tài khoản được cấp để tiếp tục mượn sách.
          </p>

          <LoginForm callbackUrl={callbackUrl} />
        </div>
      </div>
    </section>
  );
}
