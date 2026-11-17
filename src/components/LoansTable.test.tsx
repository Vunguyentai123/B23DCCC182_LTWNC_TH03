import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { LoanItem } from '@/lib/loans';
import { LoansTable } from './LoansTable';

const loan: LoanItem = {
  id: 38,
  bookId: 6,
  userEmail: 'sv01@ptit.edu.vn',
  pickupDate: '2026-12-02',
  term: 14,
  quantity: 1,
  reason: 'Mượn để học môn mạng',
  status: 'pending',
  bookTitle: 'An toàn mạng',
};

describe('LoansTable', () => {
  it('ẩn dòng ngay khi bấm Hủy trước khi server trả lời', async () => {
    const user = userEvent.setup();
    let finishCancel: (() => void) | undefined;
    const cancelAction = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finishCancel = resolve;
        }),
    );

    render(
      <LoansTable
        loans={[loan]}
        email="sv01@ptit.edu.vn"
        canCreate
        canReview={false}
        cancelAction={cancelAction}
        reviewAction={vi.fn()}
      />,
    );

    expect(screen.getByText('An toàn mạng')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Hủy' }));

    expect(screen.queryByText('An toàn mạng')).not.toBeInTheDocument();
    expect(cancelAction).toHaveBeenCalledWith(38);

    finishCancel?.();
  });
});
