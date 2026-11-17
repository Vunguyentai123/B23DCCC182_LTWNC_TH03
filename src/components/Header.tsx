'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export function Header() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Menu chính">
        <Link href="/">Trang chủ</Link>
        <Link href="/books">Sách</Link>

        {status === 'authenticated' && session?.user ? (
          <>
            <span>
              Xin chào, {session.user.name ?? ''} ({role})
            </span>
            <Link href="/loans">Sách đã mượn</Link>
            {role === 'admin' ? <Link href="/admin">Quản trị</Link> : null}
            <button
              type="button"
              className="secondary"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              Đăng xuất
            </button>
          </>
        ) : null}

        {status === 'unauthenticated' ? <Link href="/login">Đăng nhập</Link> : null}
      </nav>
    </header>
  );
}
