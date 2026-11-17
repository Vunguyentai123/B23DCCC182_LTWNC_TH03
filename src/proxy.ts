import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export default auth((request) => {
  const { nextUrl } = request;
  const session = request.auth;

  if (!session?.user) {
    const loginUrl = new URL('/login', nextUrl);
    loginUrl.searchParams.set(
      'callbackUrl',
      `${nextUrl.pathname}${nextUrl.search}`,
    );
    return NextResponse.redirect(loginUrl);
  }

  if (nextUrl.pathname.startsWith('/admin') && session.user.role !== 'admin') {
    return NextResponse.redirect(new URL('/forbidden', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/loans/:path*', '/admin/:path*'],
};
