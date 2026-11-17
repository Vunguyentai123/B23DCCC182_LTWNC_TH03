import type { Role } from '@/types';

export type Action =
  | 'book:view'
  | 'loan:create'
  | 'loan:view-own'
  | 'loan:view-all'
  | 'loan:review';

const MATRIX: Record<Action, Role[]> = {
  'book:view': ['student', 'admin'],
  'loan:create': ['student'],
  'loan:view-own': ['student'],
  'loan:view-all': ['admin'],
  'loan:review': ['admin'],
};

/** Kiểm tra quyền của một vai trò (undefined là khách chưa đăng nhập). */
export function can(role: Role | undefined, action: Action): boolean {
  if (!role) return action === 'book:view';
  return MATRIX[action].includes(role);
}
