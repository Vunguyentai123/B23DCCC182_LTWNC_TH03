import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
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
    <section className="card">
      <h1>Đăng nhập</h1>
      <LoginForm callbackUrl={callbackUrl} />
    </section>
  );
}
