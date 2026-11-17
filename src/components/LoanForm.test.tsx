import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Book } from '@/types';
import type { LoanFormState } from '@/lib/loan-validate';
import { LoanForm } from './LoanForm';

const books: Book[] = [
  {
    id: 1,
    title: 'Lập trình C căn bản',
    author: 'Nguyễn Văn Hùng',
    category: 'Lập trình',
    copies: 1,
  },
  {
    id: 6,
    title: 'An toàn mạng',
    author: 'Bùi Ngọc Anh',
    category: 'Mạng máy tính',
    copies: 1,
  },
];

type LoanAction = (
  prev: LoanFormState,
  formData: FormData,
) => Promise<LoanFormState>;

describe('LoanForm', () => {
  it('hiện lỗi ngay dưới đúng ô khi action trả errors', async () => {
    const user = userEvent.setup();
    const action = vi.fn<LoanAction>().mockResolvedValue({
      errors: {
        bookId: 'Hãy chọn sách',
        reason: 'Lý do tối thiểu 10 ký tự',
      },
      values: {},
    });

    render(<LoanForm books={books} action={action} />);

    await user.click(screen.getByRole('button', { name: 'Gửi yêu cầu' }));

    expect(await screen.findByText('Hãy chọn sách')).toHaveAttribute(
      'role',
      'alert',
    );
    expect(screen.getByText('Lý do tối thiểu 10 ký tự')).toHaveAttribute(
      'role',
      'alert',
    );
  });

  it('gửi đúng dữ liệu đã điền tới action', async () => {
    const user = userEvent.setup();
    const action = vi.fn<LoanAction>().mockResolvedValue({
      errors: {},
      values: {},
      message: 'Đã gửi yêu cầu, chờ duyệt',
      ok: true,
    });

    render(<LoanForm books={books} action={action} />);

    await user.selectOptions(screen.getByLabelText('Sách'), '6');
    await user.type(screen.getByLabelText('Ngày lấy sách'), '2099-01-01');
    await user.selectOptions(screen.getByLabelText('Thời hạn mượn'), '14');
    await user.type(
      screen.getByLabelText('Lý do mượn'),
      'Mượn phục vụ môn học',
    );
    await user.click(screen.getByRole('button', { name: 'Gửi yêu cầu' }));

    expect(action).toHaveBeenCalledTimes(1);
    const formData = action.mock.calls[0][1];
    expect(formData.get('bookId')).toBe('6');
    expect(formData.get('term')).toBe('14');
    expect(formData.get('quantity')).toBe('1');
    expect(formData.get('reason')).toBe('Mượn phục vụ môn học');
  });

  it('hiện thông báo hết bản và giữ lại lý do đã nhập', async () => {
    const user = userEvent.setup();
    const action = vi.fn<LoanAction>().mockResolvedValue({
      errors: {},
      values: {
        bookId: '6',
        pickupDate: '2026-12-02',
        term: '14',
        quantity: '1',
        reason: 'Mượn để học môn mạng',
      },
      message: 'Sách đã hết bản vào ngày này',
    });

    render(<LoanForm books={books} action={action} />);

    await user.click(screen.getByRole('button', { name: 'Gửi yêu cầu' }));

    expect(
      await screen.findByText('Sách đã hết bản vào ngày này'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Lý do mượn')).toHaveValue(
      'Mượn để học môn mạng',
    );
  });

  it('chọn sẵn sách theo defaultBookId', () => {
    const action = vi.fn<LoanAction>().mockResolvedValue({
      errors: {},
      values: {},
    });

    render(<LoanForm books={books} defaultBookId={6} action={action} />);

    expect(screen.getByLabelText('Sách')).toHaveValue('6');
  });

  it('xóa trắng form sau khi gửi thành công dù có defaultBookId', async () => {
    const user = userEvent.setup();
    const action = vi.fn<LoanAction>().mockResolvedValue({
      errors: {},
      values: {},
      message: 'Đã gửi yêu cầu, chờ duyệt',
      ok: true,
    });

    render(<LoanForm books={books} defaultBookId={6} action={action} />);
    expect(screen.getByLabelText('Sách')).toHaveValue('6');

    await user.click(screen.getByRole('button', { name: 'Gửi yêu cầu' }));

    expect(
      await screen.findByText('Đã gửi yêu cầu, chờ duyệt'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Sách')).toHaveValue('');
    expect(screen.getByLabelText('Lý do mượn')).toHaveValue('');
  });
});
