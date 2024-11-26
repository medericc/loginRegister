"use client";

import { SessionProvider } from "next-auth/react";
import Header from "./components/Header";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Header />
          <main className="mt-4">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
