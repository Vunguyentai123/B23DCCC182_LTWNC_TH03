import { describe, expect, it } from 'vitest';
import { generateBooks } from '@/data/books';
import {
  toLoanData,
  toLoanInput,
  validateLoan,
  type LoanInput,
} from './loan-validate';

const books = generateBooks(24);

const validInput: LoanInput = {
  bookId: '4',
  pickupDate: '2099-01-01',
  term: '14',
  quantity: '1',
  reason: 'Mượn để học môn lập trình web',
};

describe('validateLoan', () => {
  it('dữ liệu hợp lệ trả về object rỗng', () => {
    expect(validateLoan(validInput, books)).toEqual({});
  });

  it('form trống báo đủ lỗi cho cả 5 trường', () => {
    const errors = validateLoan(
      { bookId: '', pickupDate: '', term: '', quantity: '', reason: '' },
      books,
    );

    expect(Object.keys(errors).sort()).toEqual([
      'bookId',
      'pickupDate',
      'quantity',
      'reason',
      'term',
    ]);
    expect(errors.bookId).toBe('Hãy chọn sách');
    expect(errors.pickupDate).toBe('Hãy chọn ngày');
    expect(errors.term).toBe('Hãy chọn thời hạn');
    expect(errors.reason).toBe('Lý do tối thiểu 10 ký tự');
  });

  it('báo lỗi khi ngày lấy sách ở quá khứ', () => {
    const errors = validateLoan(
      { ...validInput, pickupDate: '2000-01-01' },
      books,
    );

    expect(errors.pickupDate).toBe('Ngày lấy sách không được ở quá khứ');
  });

  it('báo lỗi khi lý do dưới 10 ký tự, kể cả toàn khoảng trắng', () => {
    expect(validateLoan({ ...validInput, reason: '123456789' }, books).reason).toBe(
      'Lý do tối thiểu 10 ký tự',
    );
    expect(validateLoan({ ...validInput, reason: '          ' }, books).reason).toBe(
      'Lý do tối thiểu 10 ký tự',
    );
  });

  it('báo lỗi khi số quyển vượt số bản của sách', () => {
    const errors = validateLoan({ ...validInput, bookId: '1', quantity: '2' }, books);

    expect(errors.quantity).toBe('Vượt số bản của sách (1 bản)');
  });

  it('báo lỗi khi số quyển không phải số nguyên dương', () => {
    expect(validateLoan({ ...validInput, quantity: '0' }, books).quantity).toBe(
      'Số quyển phải từ 1 trở lên',
    );
    expect(validateLoan({ ...validInput, quantity: '1.5' }, books).quantity).toBe(
      'Số quyển phải từ 1 trở lên',
    );
  });

  it('báo lỗi khi thời hạn không hợp lệ', () => {
    expect(validateLoan({ ...validInput, term: '10' }, books).term).toBe(
      'Hãy chọn thời hạn',
    );
  });

  it('báo lỗi khi chọn sách không tồn tại', () => {
    expect(validateLoan({ ...validInput, bookId: '999' }, books).bookId).toBe(
      'Hãy chọn sách',
    );
  });
});

describe('toLoanData', () => {
  it('ép kiểu số từ chuỗi và trim lý do', () => {
    expect(toLoanData({ ...validInput, reason: '  Mượn để học  ' })).toEqual({
      bookId: 4,
      pickupDate: '2099-01-01',
      term: 14,
      quantity: 1,
      reason: 'Mượn để học',
    });
  });
});

describe('toLoanInput', () => {
  it('đọc được FormData và biến trường thiếu thành chuỗi rỗng', () => {
    const formData = new FormData();
    formData.set('bookId', '6');
    formData.set('term', '7');

    expect(toLoanInput(formData)).toEqual({
      bookId: '6',
      pickupDate: '',
      term: '7',
      quantity: '',
      reason: '',
    });
  });
});
