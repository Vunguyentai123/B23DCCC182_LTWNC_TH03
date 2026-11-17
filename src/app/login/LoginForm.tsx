'use client';

import { useActionState } from 'react';
import { LogIn } from 'lucide-react';
import type { LoginState } from '@/types';
import { loginAction } from './actions';

const initialState: LoginState = {};

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="stack auth-form">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
      </div>

      <div className="field">
        <label htmlFor="password">Mật khẩu</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {state.error ? (
        <p className="alert alert-error" role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" disabled={pending}>
        <LogIn size={17} aria-hidden="true" />
        Đăng nhập
      </button>
    </form>
  );
}
