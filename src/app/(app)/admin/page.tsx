import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Check, CircleCheck, X } from 'lucide-react';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { formatDate, TERM_LABEL } from '@/lib/format';
import { can } from '@/lib/permissions';
import { reviewLoan } from './actions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quản trị',
  robots: { index: false },
};

export default async function AdminPage() {
  const session = await auth();
  const role = session?.user?.role;

  if (!can(role, 'loan:review')) {
    redirect('/forbidden');
  }

  const pending = db.loans.filter((loan) => loan.status === 'pending');
  const approved = db.loans.filter((loan) => loan.status === 'approved').length;
  const rejected = db.loans.filter((loan) => loan.status === 'rejected').length;

  return (
    <section>
      <header className="page-head">
        <p className="eyebrow">Bảng điều khiển thủ thư</p>
        <h1>Duyệt yêu cầu mượn</h1>
        <p className="page-subtitle">
          Kiểm tra và xử lý các yêu cầu mượn sách đang chờ.
        </p>
      </header>

      <p className="user-greeting">
        <span className="user-greeting-dot" aria-hidden="true" />
        Xin chào,{' '}
        <strong>{session?.user?.name ?? session?.user?.email ?? ''}</strong>{' '}
        ({role})
      </p>

      <p className="stats-line">
        Chờ duyệt: {pending.length} | Đã duyệt: {approved} | Từ chối: {rejected}
      </p>

      <div className="panel table-panel">
        <div className="panel-head">
          <h2>Yêu cầu đang chờ duyệt</h2>
          <p className="muted">{pending.length} yêu cầu cần xử lý</p>
        </div>

        {pending.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">
              <CircleCheck size={28} aria-hidden="true" />
            </span>
            <p>Không có yêu cầu nào đang chờ duyệt</p>
            <p className="muted">Mọi yêu cầu đã được xử lý.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sách</th>
                  <th>Ngày lấy</th>
                  <th>Thời hạn</th>
                  <th>Người mượn</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((loan) => {
                  const book = db.books.find((item) => item.id === loan.bookId);
                  return (
                    <tr key={loan.id}>
                      <td className="book-cell">{book?.title ?? 'Không rõ'}</td>
                      <td>{formatDate(loan.pickupDate)}</td>
                      <td>{TERM_LABEL[loan.term]}</td>
                      <td>
                        <span className="email-chip">{loan.userEmail}</span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <form
                            action={reviewLoan.bind(null, loan.id, 'approved')}
                          >
                            <button type="submit" className="btn-sm">
                              <Check size={15} aria-hidden="true" />
                              Duyệt
                            </button>
                          </form>
                          <form
                            action={reviewLoan.bind(null, loan.id, 'rejected')}
                          >
                            <button
                              type="submit"
                              className="secondary btn-sm"
                            >
                              <X size={15} aria-hidden="true" />
                              Từ chối
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
