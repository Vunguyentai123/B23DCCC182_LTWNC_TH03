import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Inbox } from 'lucide-react';
import { auth } from '@/auth';
import { LoanForm } from '@/components/LoanForm';
import { LoansTable } from '@/components/LoansTable';
import { loadBooksShift } from '@/lib/books';
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
      <header className="page-head">
        <p className="eyebrow">Tủ sách của bạn</p>
        <h1>Sách đã mượn</h1>
        <p className="page-subtitle">
          Theo dõi trạng thái yêu cầu mượn và gửi yêu cầu mới.
        </p>
      </header>

      <p className="user-greeting">
        <span className="user-greeting-dot" aria-hidden="true" />
        Xin chào, <strong>{session.user.name ?? email}</strong> ({role})
      </p>

      {canReview ? (
        <p className="alert alert-info">
          Bạn là quản trị viên: có thể duyệt ngay trong bảng bên dưới hoặc mở{' '}
          <Link href="/admin">trang Quản trị</Link>.
        </p>
      ) : null}

      <div className="panel filter-panel">
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
      </div>

      <div className="results-meta">
        <p className="result-count">{result.total} yêu cầu</p>
        <p className="render-time">
          Hiển thị {result.items.length} / {result.total}
        </p>
      </div>

      <div className="panel table-panel">
        {result.total === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">
              <Inbox size={28} aria-hidden="true" />
            </span>
            <p>Chưa có yêu cầu mượn nào</p>
            <p className="muted">
              Các yêu cầu bạn gửi sẽ xuất hiện tại đây để theo dõi trạng thái.
            </p>
          </div>
        ) : (
          <LoansTable
            loans={result.items}
            email={email}
            canCreate={can(role, 'loan:create')}
            canReview={canReview}
            cancelAction={cancelLoanAction}
            reviewAction={reviewLoan}
          />
        )}
      </div>

      <div className="pagination">
        {result.page > 1 ? (
          <Link href={pageHref(result.page - 1)}>Trước</Link>
        ) : (
          <span className="page-disabled">Trước</span>
        )}
        <span className="page-status">
          Trang {result.page}/{result.totalPages}
        </span>
        {result.page < result.totalPages ? (
          <Link href={pageHref(result.page + 1)}>Sau</Link>
        ) : (
          <span className="page-disabled">Sau</span>
        )}
      </div>

      {can(role, 'loan:create') ? (
        <section className="panel form-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Gửi yêu cầu</p>
              <h2>Gửi yêu cầu mượn</h2>
            </div>
            <p className="muted">
              Chọn sách, ngày lấy và thời hạn mượn phù hợp.
            </p>
          </div>
          <LoanForm
            books={books}
            defaultBookId={defaultBookId}
            action={createLoanAction}
          />
        </section>
      ) : null}
    </section>
  );
}
