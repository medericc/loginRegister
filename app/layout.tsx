"use client";

import { SessionProvider, useSession } from "next-auth/react";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AuthStatus />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}

function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Chargement...</p>;
  }

  return (
    <div className="p-4 bg-gray-200 text-center">
      {session ? "Tu es connecté" : "Tu n'es pas connecté"}
    </div>
  );
}
