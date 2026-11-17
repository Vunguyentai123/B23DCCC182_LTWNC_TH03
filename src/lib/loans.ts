import { db } from './db';
import { can } from './permissions';
import type { LoanData } from './loan-validate';
import type { Loan, LoanStatus, Role } from '@/types';

export interface Viewer {
  email: string;
  role: Role;
}

export interface LoanItem extends Loan {
  bookTitle: string;
}

export interface LoanListResult {
  items: LoanItem[];
  total: number;
  page: number;
  totalPages: number;
}

export type SubmitLoanResult =
  | { ok: true; loan: Loan }
  | { ok: false; message: string };

export type CancelLoanResult = 'not-found' | 'forbidden' | 'not-pending' | 'ok';

const PAGE_SIZE = 10;

/** Chỉ nhận 3 trạng thái hợp lệ, giá trị khác coi như không lọc. */
export function parseStatus(value: string | undefined | null): LoanStatus | '' {
  if (value === 'pending' || value === 'approved' || value === 'rejected') {
    return value;
  }
  return '';
}

/** Danh sách yêu cầu mượn theo quyền của người xem, có lọc và phân trang. */
export function listLoans(
  viewer: Viewer,
  status?: string,
  page = 1,
): LoanListResult {
  const canViewAll = can(viewer.role, 'loan:view-all');
  const canViewOwn = can(viewer.role, 'loan:view-own');

  const visible = canViewAll
    ? db.loans
    : canViewOwn
      ? db.loans.filter((loan) => loan.userEmail === viewer.email)
      : [];

  const statusFilter = parseStatus(status);
  const filtered = statusFilter
    ? visible.filter((loan) => loan.status === statusFilter)
    : visible;

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const requestedPage = Number.isFinite(page) ? Math.trunc(page) : 1;
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);

  const items = filtered
    .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    .map((loan) => ({
      ...loan,
      bookTitle:
        db.books.find((book) => book.id === loan.bookId)?.title ?? 'Không rõ',
    }));

  return { items, total, page: currentPage, totalPages };
}

/** Tạo yêu cầu mượn mới nếu còn đủ bản vào ngày lấy sách. */
export function submitLoan(email: string, data: LoanData): SubmitLoanResult {
  const book = db.books.find((item) => item.id === data.bookId);
  if (!book) {
    return { ok: false, message: 'Sách không tồn tại' };
  }

  const used = db.loans
    .filter(
      (loan) =>
        loan.bookId === data.bookId &&
        loan.pickupDate === data.pickupDate &&
        loan.status !== 'rejected',
    )
    .reduce((sum, loan) => sum + loan.quantity, 0);

  if (used + data.quantity > book.copies) {
    return { ok: false, message: 'Sách đã hết bản vào ngày này' };
  }

  const loan: Loan = {
    id: db.nextLoanId++,
    bookId: data.bookId,
    userEmail: email,
    pickupDate: data.pickupDate,
    term: data.term,
    quantity: data.quantity,
    reason: data.reason,
    status: 'pending',
  };

  db.loans.unshift(loan);

  return { ok: true, loan };
}

/** Hủy một yêu cầu mượn đang chờ duyệt của chính người dùng. */
export function cancelLoan(email: string, id: number): CancelLoanResult {
  const index = db.loans.findIndex((loan) => loan.id === id);
  if (index === -1) return 'not-found';

  const loan = db.loans[index];
  if (loan.userEmail !== email) return 'forbidden';
  if (loan.status !== 'pending') return 'not-pending';

  db.loans.splice(index, 1);
  return 'ok';
}
