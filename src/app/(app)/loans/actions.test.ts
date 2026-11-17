import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateBooks, generateLoans } from '@/data/books';
import { db } from '@/lib/db';
import { createLoanAction } from './actions';

const { authMock, revalidatePathMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  revalidatePathMock: vi.fn(),
}));

vi.mock('@/auth', () => ({ auth: authMock }));
vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));

const makeFormData = (): FormData => {
  const formData = new FormData();
  formData.set('bookId', '11');
  formData.set('pickupDate', '2026-12-03');
  formData.set('term', '14');
  formData.set('quantity', '1');
  formData.set('reason', 'Mượn để học môn cơ sở dữ liệu');
  return formData;
};

beforeEach(() => {
  db.books.splice(0, db.books.length, ...generateBooks(24));
  db.loans.splice(0, db.loans.length, ...generateLoans(37));
  db.nextLoanId = 38;
  authMock.mockReset();
  revalidatePathMock.mockReset();
});

describe('createLoanAction', () => {
  it('sinh viên gửi yêu cầu hợp lệ thì tạo được yêu cầu mới', async () => {
    authMock.mockResolvedValue({
      user: {
        id: 'u1',
        name: 'Nguyễn Văn An',
        email: 'sv01@ptit.edu.vn',
        role: 'student',
      },
    });

    const result = await createLoanAction(
      { errors: {}, values: {} },
      makeFormData(),
    );

    expect(result.ok).toBe(true);
    expect(result.message).toBe('Đã gửi yêu cầu, chờ duyệt');
    expect(result.values).toEqual({});
    expect(revalidatePathMock).toHaveBeenCalledWith('/loans');
    expect(db.loans[0]).toMatchObject({
      bookId: 11,
      userEmail: 'sv01@ptit.edu.vn',
      status: 'pending',
    });
  });

  it('admin gửi yêu cầu thì ném lỗi không có quyền', async () => {
    authMock.mockResolvedValue({
      user: {
        id: 'u3',
        name: 'Quản trị Lab',
        email: 'admin@ptit.edu.vn',
        role: 'admin',
      },
    });

    await expect(
      createLoanAction({ errors: {}, values: {} }, makeFormData()),
    ).rejects.toThrow('Không có quyền');
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });
});
