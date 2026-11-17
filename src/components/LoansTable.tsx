'use client';

import { useOptimistic } from 'react';
import { Check, Trash2, X } from 'lucide-react';
import { formatDate, STATUS_LABEL, TERM_LABEL } from '@/lib/format';
import type { LoanItem } from '@/lib/loans';

interface LoansTableProps {
  loans: LoanItem[];
  email: string;
  canCreate: boolean;
  canReview: boolean;
  cancelAction: (id: number) => Promise<void>;
  reviewAction: (id: number, status: 'approved' | 'rejected') => Promise<void>;
}

export function LoansTable({
  loans,
  email,
  canCreate,
  canReview,
  cancelAction,
  reviewAction,
}: LoansTableProps) {
  const [optimisticLoans, removeLoan] = useOptimistic(
    loans,
    (currentLoans, cancelledId: number) =>
      currentLoans.filter((loan) => loan.id !== cancelledId),
  );

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Tên sách</th>
            <th>Ngày lấy</th>
            <th>Thời hạn</th>
            <th>Số quyển</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {optimisticLoans.map((loan) => {
            const canCancel =
              canCreate &&
              loan.userEmail === email &&
              loan.status === 'pending';

            return (
              <tr key={loan.id}>
                <td className="book-cell">{loan.bookTitle}</td>
                <td>{formatDate(loan.pickupDate)}</td>
                <td>{TERM_LABEL[loan.term]}</td>
                <td>
                  <span className="qty-badge">{loan.quantity} quyển</span>
                </td>
                <td>
                  <span className={`status-badge status-${loan.status}`}>
                    {STATUS_LABEL[loan.status]}
                  </span>
                </td>
                <td>
                  {canReview && loan.status === 'pending' ? (
                    <div className="row-actions">
                      <form
                        action={async () => {
                          await reviewAction(loan.id, 'approved');
                        }}
                      >
                        <button type="submit" className="btn-sm">
                          <Check size={15} aria-hidden="true" />
                          Duyệt
                        </button>
                      </form>
                      <form
                        action={async () => {
                          await reviewAction(loan.id, 'rejected');
                        }}
                      >
                        <button type="submit" className="secondary btn-sm">
                          <X size={15} aria-hidden="true" />
                          Từ chối
                        </button>
                      </form>
                    </div>
                  ) : canCancel ? (
                    <form
                      action={async () => {
                        // Dòng biến mất ngay; nếu server báo lỗi, useOptimistic
                        // tự quay lại danh sách gốc.
                        removeLoan(loan.id);
                        try {
                          await cancelAction(loan.id);
                        } catch {
                          // Không làm gì: trạng thái optimistic sẽ tự hoàn tác.
                        }
                      }}
                    >
                      <button type="submit" className="secondary btn-sm">
                        <Trash2 size={15} aria-hidden="true" />
                        Hủy
                      </button>
                    </form>
                  ) : (
                    <span className="muted">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
