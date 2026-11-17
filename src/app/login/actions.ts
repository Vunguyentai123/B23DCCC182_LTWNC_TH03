'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import type { LoginState } from '@/types';

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const rawCallbackUrl = String(formData.get('callbackUrl') ?? '/loans');
  const callbackUrl = rawCallbackUrl.startsWith('/') ? rawCallbackUrl : '/loans';

  if (!email || !password) {
    return { error: 'Email hoặc mật khẩu không đúng' };
  }

  try {
    await signIn('credentials', { email, password, redirectTo: callbackUrl });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Email hoặc mật khẩu không đúng' };
    }
    throw error;
  }

  return {};
}
