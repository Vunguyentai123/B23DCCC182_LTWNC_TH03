'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Đồng bộ lại session phía client sau khi chuyển trang (ví dụ ngay sau khi
 * đăng nhập bằng Server Action), để Header luôn hiện đúng tên người dùng.
 */
export function SessionRefresher() {
  const pathname = usePathname();
  const { update } = useSession();
  const updateRef = useRef(update);

  useEffect(() => {
    updateRef.current = update;
  }, [update]);

  useEffect(() => {
    void updateRef.current();
  }, [pathname]);

  return null;
}
