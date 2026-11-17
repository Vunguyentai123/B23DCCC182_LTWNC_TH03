import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { LoanForm } from '@/components/LoanForm';
import { loadBooksShift } from '@/lib/books';
import { formatDate, STATUS_LABEL, TERM_LABEL } from '@/lib/format';
import { listLoans, parseStatus } from '@/lib/loans';
import { can } from '@/lib/permissions';
import { reviewLoan } from '../admin/actions';
import { cancelLoanAction, createLoanAction } from './actions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sách đã mượn',
  robots: { index: false },
};

interface LoansPageProps {
  searchParams: Promise<{
    status?: string | string[];
    page?: string | string[];
    book?: string | string[];
  }>;
}

const firstValue = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? (value[0] ?? '') : (value ?? '');

export default async function LoansPage({ searchParams }: LoansPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login?callbackUrl=%2Floans');
  }

  const role = session.user.role;
  const email = session.user.email ?? '';
  const params = await searchParams;

  const status = parseStatus(firstValue(params.status));
  const page = Number(firstValue(params.page));
  const defaultBook = Number(firstValue(params.book));
  const defaultBookId =
    Number.isInteger(defaultBook) && defaultBook > 0 ? defaultBook : undefined;

  const result = listLoans({ email, role }, status, page);
  const books = can(role, 'loan:create') ? await loadBooksShift() : [];
  const canReview = can(role, 'loan:review');

  const pageHref = (target: number): string => {
    const query = new URLSearchParams();
    if (status) query.set('status', status);
    query.set('page', String(target));
    return `/loans?${query.toString()}`;
  };

  return (
    <section>
      <h1>Sách đã mượn</h1>

      <p className="user-greeting">
        Xin chào, <strong>{session.user.name ?? email}</strong> ({role})
      </p>

      {canReview ? (
        <p className="notice">
          Bạn là quản trị viên: có thể duyệt ngay trong bảng bên dưới hoặc mở{' '}
          <Link href="/admin">trang Quản trị</Link>.
        </p>
      ) : null}

      <form className="filters" method="get" action="/loans">
        <div className="field">
          <label htmlFor="status">Trạng thái</label>
          <select id="status" name="status" defaultValue={status}>
            <option value="">Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>
        <button type="submit">Lọc</button>
      </form>

      {result.total === 0 ? (
        <p className="notice">Chưa có yêu cầu mượn nào</p>
      ) : (
        <table>
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
            {result.items.map((loan) => {
              const canCancel =
                can(role, 'loan:create') &&
                loan.userEmail === email &&
                loan.status === 'pending';

              return (
                <tr key={loan.id}>
                  <td>{loan.bookTitle}</td>
                  <td>{formatDate(loan.pickupDate)}</td>
                  <td>{TERM_LABEL[loan.term]}</td>
                  <td>{loan.quantity} quyển</td>
                  <td>{STATUS_LABEL[loan.status]}</td>
                  <td>
                    {canReview && loan.status === 'pending' ? (
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
                    ) : canCancel ? (
                      <form action={cancelLoanAction.bind(null, loan.id)}>
                        <button type="submit" className="secondary">
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
      )}

      <div className="pagination">
        {result.page > 1 ? (
          <Link href={pageHref(result.page - 1)}>Trước</Link>
        ) : (
          <span>Trước</span>
        )}
        <span>
          Trang {result.page}/{result.totalPages}
        </span>
        {result.page < result.totalPages ? (
          <Link href={pageHref(result.page + 1)}>Sau</Link>
        ) : (
          <span>Sau</span>
        )}
      </div>

      {can(role, 'loan:create') ? (
        <>
          <h2>Gửi yêu cầu mượn</h2>
          <LoanForm
            books={books}
            defaultBookId={defaultBookId}
            action={createLoanAction}
          />
        </>
      ) : null}
    </section>
  );
}
