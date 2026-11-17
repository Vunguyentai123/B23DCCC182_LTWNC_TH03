import { beforeEach, describe, expect, it } from 'vitest';
import { generateBooks, generateLoans } from '@/data/books';
import { db } from './db';
import { cancelLoan, listLoans, parseStatus, submitLoan } from './loans';

const sv01 = { email: 'sv01@ptit.edu.vn', role: 'student' as const };
const sv02 = { email: 'sv02@ptit.edu.vn', role: 'student' as const };
const admin = { email: 'admin@ptit.edu.vn', role: 'admin' as const };

const resetDb = (): void => {
  db.books.splice(0, db.books.length, ...generateBooks(24));
  db.loans.splice(0, db.loans.length, ...generateLoans(37));
  db.nextLoanId = 38;
};

beforeEach(() => {
  resetDb();
});

describe('listLoans', () => {
  it('sv01 có 27 yêu cầu chia 3 trang 10/10/7', () => {
    const first = listLoans(sv01, '', 1);
    expect(first.total).toBe(27);
    expect(first.totalPages).toBe(3);
    expect(first.items).toHaveLength(10);

    const second = listLoans(sv01, '', 2);
    expect(second.page).toBe(2);
    expect(second.items).toHaveLength(10);

    const third = listLoans(sv01, '', 3);
    expect(third.items).toHaveLength(7);
  });

  it('admin thấy tất cả 37 yêu cầu', () => {
    const result = listLoans(admin, '', 1);
    expect(result.total).toBe(37);
    expect(result.totalPages).toBe(4);
  });

  it('trang vượt giới hạn bị kẹp lại', () => {
    expect(listLoans(sv01, '', 99).page).toBe(3);
    expect(listLoans(sv01, '', 0).page).toBe(1);
    expect(listLoans(sv01, '', -5).page).toBe(1);
  });

  it('lọc theo trạng thái và bỏ qua trạng thái không hợp lệ', () => {
    expect(listLoans(sv01, 'pending', 1).total).toBe(9);
    expect(listLoans(admin, 'pending', 1).total).toBe(13);
    expect(listLoans(sv01, 'khong-hop-le', 1).total).toBe(27);
    expect(parseStatus('approved')).toBe('approved');
    expect(parseStatus('khong-hop-le')).toBe('');
  });

  it('sv02 chỉ thấy yêu cầu của chính mình', () => {
    const result = listLoans(sv02, '', 1);
    expect(result.total).toBe(10);
    expect(result.items.every((item) => item.userEmail === sv02.email)).toBe(true);
    expect(result.items[0].bookTitle).toBeTruthy();
  });
});

describe('submitLoan', () => {
  it('báo hết bản với sách id 6 ngày 2026-12-02', () => {
    const result = submitLoan('sv01@ptit.edu.vn', {
      bookId: 6,
      pickupDate: '2026-12-02',
      term: 14,
      quantity: 1,
      reason: 'Mượn để học',
    });

    expect(result).toEqual({ ok: false, message: 'Sách đã hết bản vào ngày này' });
  });

  it('tạo được yêu cầu rồi hủy đúng 3 mã', () => {
    const result = submitLoan('sv01@ptit.edu.vn', {
      bookId: 11,
      pickupDate: '2026-12-03',
      term: 14,
      quantity: 1,
      reason: 'Mượn để học',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.loan.id).toBe(38);
    expect(db.loans[0]).toEqual(result.loan);
    expect(db.nextLoanId).toBe(39);

    expect(cancelLoan(sv02.email, result.loan.id)).toBe('forbidden');
    expect(cancelLoan(sv01.email, result.loan.id)).toBe('ok');
    expect(cancelLoan(sv01.email, result.loan.id)).toBe('not-found');
  });
});
