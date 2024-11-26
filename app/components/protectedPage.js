// components/protectedPages
"use client";


import { useSession } from "next-auth/react";

export default function ProtectedPage({ children }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You need to log in to access this page.</p>;
  }

  return <>{children}</>;
}
