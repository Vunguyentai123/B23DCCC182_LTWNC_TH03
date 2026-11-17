import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <section>
      <p className="member-banner">Khu vực thành viên</p>
      {children}
    </section>
  );
}
