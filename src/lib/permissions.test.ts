import { describe, expect, it } from 'vitest';
import { can } from './permissions';

describe('can', () => {
  it('khách chỉ được xem sách, không được mượn hay duyệt', () => {
    expect(can(undefined, 'book:view')).toBe(true);
    expect(can(undefined, 'loan:create')).toBe(false);
    expect(can(undefined, 'loan:view-own')).toBe(false);
    expect(can(undefined, 'loan:view-all')).toBe(false);
    expect(can(undefined, 'loan:review')).toBe(false);
  });

  it('sinh viên gửi được yêu cầu mượn nhưng không được duyệt', () => {
    expect(can('student', 'book:view')).toBe(true);
    expect(can('student', 'loan:create')).toBe(true);
    expect(can('student', 'loan:view-own')).toBe(true);
    expect(can('student', 'loan:view-all')).toBe(false);
    expect(can('student', 'loan:review')).toBe(false);
  });

  it('quản trị duyệt được nhưng không được tạo yêu cầu mượn', () => {
    expect(can('admin', 'book:view')).toBe(true);
    expect(can('admin', 'loan:create')).toBe(false);
    expect(can('admin', 'loan:view-own')).toBe(false);
    expect(can('admin', 'loan:view-all')).toBe(true);
    expect(can('admin', 'loan:review')).toBe(true);
  });
});
