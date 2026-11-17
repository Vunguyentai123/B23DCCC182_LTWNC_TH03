import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
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
      <h1>Duyệt yêu cầu mượn</h1>

      <p className="user-greeting">
        Xin chào, <strong>{session?.user?.name ?? session?.user?.email ?? ''}</strong>{' '}
        ({role})
      </p>

      <p>
        Chờ duyệt: {pending.length} | Đã duyệt: {approved} | Từ chối: {rejected}
      </p>

      <h2>Yêu cầu đang chờ duyệt</h2>

      {pending.length === 0 ? (
        <p className="notice">Không có yêu cầu nào đang chờ duyệt</p>
      ) : (
        <table>
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
                  <td>{book?.title ?? 'Không rõ'}</td>
                  <td>{formatDate(loan.pickupDate)}</td>
                  <td>{TERM_LABEL[loan.term]}</td>
                  <td>{loan.userEmail}</td>
                  <td>
                    <div className="row-actions">
                      <form action={reviewLoan.bind(null, loan.id, 'approved')}>
                        <button type="submit">Duyệt</button>
                      </form>
                      <form action={reviewLoan.bind(null, loan.id, 'rejected')}>
                        <button type="submit" className="secondary">
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
      )}
    </section>
  );
}
