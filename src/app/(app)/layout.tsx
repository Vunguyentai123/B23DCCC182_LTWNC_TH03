import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <section className="member-shell">
      <div className="member-strip">
        <span className="member-dot" aria-hidden="true" />
        Khu vực thành viên
      </div>
      {children}
    </section>
  );
}
