const BUILD_TAG = "rb-6129";

import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Thư viện khoa CNTT",
    template: "%s | Thư viện khoa",
  },
  description: "Tra cứu và đăng ký mượn sách tại thư viện khoa CNTT PTIT.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body data-build-tag={BUILD_TAG}>
        <Providers>
          <Header />
          <main className="container">{children}</main>
          <footer className="site-footer">
            <span>Thư viện khoa CNTT PTIT</span>
            <span>Lập trình web nâng cao · TH03</span>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
