'use client';

import { useActionState } from 'react';
import { TERMS } from '@/data/books';
import { TERM_LABEL } from '@/lib/format';
import type { LoanFormState } from '@/lib/loan-validate';
import type { Book } from '@/types';

interface LoanFormProps {
  books: Book[];
  defaultBookId?: number;
  action: (prev: LoanFormState, formData: FormData) => Promise<LoanFormState>;
}

const initialState: LoanFormState = { errors: {}, values: {} };

export function LoanForm({ books, defaultBookId, action }: LoanFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const values = state.values;
  const hasFinished = state.ok === true || Boolean(state.message);

  const selectedBookId =
    values.bookId ??
    (defaultBookId !== undefined && !hasFinished
      ? String(defaultBookId)
      : '');

  const formKey = `${JSON.stringify(values)}|${state.ok ? 'ok' : ''}|${state.message ?? ''}`;

  return (
    <form action={formAction} className="stack" key={formKey}>
      <div className="field">
        <label htmlFor="bookId">Sách</label>
        <select id="bookId" name="bookId" defaultValue={selectedBookId}>
          <option value="">-- Chọn sách --</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title} ({book.copies} bản)
            </option>
          ))}
        </select>
        {state.errors.bookId ? <p role="alert">{state.errors.bookId}</p> : null}
      </div>

      <div className="field">
        <label htmlFor="pickupDate">Ngày lấy sách</label>
        <input
          id="pickupDate"
          name="pickupDate"
          type="date"
          defaultValue={values.pickupDate ?? ''}
        />
        {state.errors.pickupDate ? (
          <p role="alert">{state.errors.pickupDate}</p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="term">Thời hạn mượn</label>
        <select id="term" name="term" defaultValue={values.term ?? ''}>
          <option value="">-- Chọn thời hạn --</option>
          {TERMS.map((term) => (
            <option key={term} value={term}>
              {TERM_LABEL[term]}
            </option>
          ))}
        </select>
        {state.errors.term ? <p role="alert">{state.errors.term}</p> : null}
      </div>

      <div className="field">
        <label htmlFor="quantity">Số quyển</label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min={1}
          defaultValue={values.quantity ?? '1'}
        />
        {state.errors.quantity ? (
          <p role="alert">{state.errors.quantity}</p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="reason">Lý do mượn</label>
        <textarea
          id="reason"
          name="reason"
          defaultValue={values.reason ?? ''}
        />
        {state.errors.reason ? <p role="alert">{state.errors.reason}</p> : null}
      </div>

      <button type="submit" disabled={pending}>
        Gửi yêu cầu
      </button>

      {state.message ? (
        <p
          className={state.ok ? 'success' : undefined}
          role={state.ok ? 'status' : 'alert'}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
