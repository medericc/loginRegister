"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header className="bg-gray-800 text-white py-4 px-8 flex items-center justify-between">
      <h1 className="text-2xl font-bold flex-1 text-center">Chretien</h1>
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span>Bienvenue, {session.user?.name || "Utilisateur inconnu"}</span>
            <button
              className="px-4 py-2 bg-red-500 rounded"
              onClick={() => signOut()}
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <button
              className="px-4 py-2 bg-blue-500 rounded"
              onClick={() => signIn()}
            >
              Connexion
            </button>
            <button
              className="px-4 py-2 bg-green-500 rounded"
              onClick={() => router.push("/register")}
            >
              Inscription
            </button>
          </>
        )}
      </div>
    </header>
  );
}
