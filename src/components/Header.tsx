'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  BookMarked,
  BookOpen,
  House,
  LibraryBig,
  LogIn,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role;

  const isActive = (href: string): boolean =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Menu chính">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <LibraryBig size={24} aria-hidden="true" />
          </span>
          <span className="brand-text">
            <span className="brand-title">Thư viện khoa</span>
            <span className="brand-sub">CNTT PTIT</span>
          </span>
        </Link>

        <div className="nav-links">
          <Link
            href="/"
            className={`nav-link${isActive('/') ? ' active' : ''}`}
            aria-current={isActive('/') ? 'page' : undefined}
          >
            <House size={16} aria-hidden="true" />
            Trang chủ
          </Link>
          <Link
            href="/books"
            className={`nav-link${isActive('/books') ? ' active' : ''}`}
            aria-current={isActive('/books') ? 'page' : undefined}
          >
            <BookOpen size={16} aria-hidden="true" />
            Sách
          </Link>

          {status === 'authenticated' && session?.user ? (
            <>
              <Link
                href="/loans"
                className={`nav-link${isActive('/loans') ? ' active' : ''}`}
                aria-current={isActive('/loans') ? 'page' : undefined}
              >
                <BookMarked size={16} aria-hidden="true" />
                Sách đã mượn
              </Link>
              {role === 'admin' ? (
                <Link
                  href="/admin"
                  className={`nav-link${isActive('/admin') ? ' active' : ''}`}
                  aria-current={isActive('/admin') ? 'page' : undefined}
                >
                  <ShieldCheck size={16} aria-hidden="true" />
                  Quản trị
                </Link>
              ) : null}
            </>
          ) : null}
        </div>

        <div className="nav-user">
          {status === 'authenticated' && session?.user ? (
            <>
              <span className={`user-chip${role === 'admin' ? ' is-admin' : ''}`}>
                <span className="user-avatar" aria-hidden="true">
                  {(session.user.name ?? 'U').charAt(0).toUpperCase()}
                </span>
                <span className="user-greeting-text">
                  Xin chào, {session.user.name ?? ''} ({role})
                </span>
              </span>
              <button
                type="button"
                className="secondary btn-sm"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut size={15} aria-hidden="true" />
                Đăng xuất
              </button>
            </>
          ) : null}

          {status === 'unauthenticated' ? (
            <Link href="/login" className="btn btn-primary btn-sm">
              <LogIn size={15} aria-hidden="true" />
              Đăng nhập
            </Link>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
