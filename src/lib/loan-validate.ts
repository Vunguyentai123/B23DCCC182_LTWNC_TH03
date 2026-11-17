import type { Book } from '@/types';

export interface LoanInput {
  bookId: string;
  pickupDate: string;
  term: string;
  quantity: string;
  reason: string;
}

export interface LoanData {
  bookId: number;
  pickupDate: string;
  term: 7 | 14 | 30;
  quantity: number;
  reason: string;
}

export type LoanErrors = Partial<Record<keyof LoanInput, string>>;

export interface LoanFormState {
  errors: LoanErrors; // lỗi từng ô
  values: Partial<LoanInput>; // giá trị đã nhập, để hiện lại khi có lỗi
  message?: string; // thông báo chung (thành công hoặc lỗi từ server)
  ok?: boolean; // true nếu message là thông báo thành công
}

/** Ngày hôm nay dạng YYYY-MM-DD theo giờ địa phương. */
export const today = (): string => {
  const now = new Date();
  const pad = (value: number): string => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

const isIsoDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

/** Đổi dữ liệu form (FormData hoặc object) thành LoanInput, thiếu trường thì rỗng. */
export const toLoanInput = (raw: FormData | Record<string, unknown>): LoanInput => {
  const read = (key: keyof LoanInput): string => {
    if (raw instanceof FormData) {
      const value = raw.get(key);
      return typeof value === 'string' ? value : '';
    }

    const value = raw[key];
    return value == null ? '' : String(value);
  };

  return {
    bookId: read('bookId'),
    pickupDate: read('pickupDate'),
    term: read('term'),
    quantity: read('quantity'),
    reason: read('reason'),
  };
};

/** Kiểm tra toàn bộ quy tắc của một yêu cầu mượn. */
export const validateLoan = (input: LoanInput, books: Book[]): LoanErrors => {
  const errors: LoanErrors = {};

  const book = books.find((item) => String(item.id) === input.bookId.trim());
  if (input.bookId.trim() === '' || !book) {
    errors.bookId = 'Hãy chọn sách';
  }

  const pickupDate = input.pickupDate.trim();
  if (pickupDate === '' || !isIsoDate(pickupDate)) {
    errors.pickupDate = 'Hãy chọn ngày';
  } else if (pickupDate < today()) {
    errors.pickupDate = 'Ngày lấy sách không được ở quá khứ';
  }

  if (!['7', '14', '30'].includes(input.term.trim())) {
    errors.term = 'Hãy chọn thời hạn';
  }

  const rawQuantity = input.quantity.trim();
  const quantity = Number(rawQuantity);
  if (rawQuantity === '' || !Number.isInteger(quantity) || quantity < 1) {
    errors.quantity = 'Số quyển phải từ 1 trở lên';
  } else if (book && quantity > book.copies) {
    errors.quantity = `Vượt số bản của sách (${book.copies} bản)`;
  }

  if (input.reason.trim().length < 10) {
    errors.reason = 'Lý do tối thiểu 10 ký tự';
  }

  return errors;
};

/** Ép kiểu dữ liệu đã hợp lệ để đưa vào tầng nghiệp vụ. */
export const toLoanData = (input: LoanInput): LoanData => ({
  bookId: Number(input.bookId),
  pickupDate: input.pickupDate.trim(),
  term: Number(input.term) as 7 | 14 | 30,
  quantity: Number(input.quantity),
  reason: input.reason.trim(),
});
