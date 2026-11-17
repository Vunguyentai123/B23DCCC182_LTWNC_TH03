'use client';

import { useActionState } from 'react';
import type { LoginState } from '@/types';
import { loginAction } from './actions';

const initialState: LoginState = {};

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="stack">
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

      {state.error ? <p role="alert">{state.error}</p> : null}

      <button type="submit" disabled={pending}>
        Đăng nhập
      </button>
    </form>
  );
}
