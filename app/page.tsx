"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Bienvenue sur notre application</h1>
      {session ? (
        <>
          <p>
            Bonjour,{" "}
            {session.user?.name
              ? session.user.name
              : "utilisateur inconnu"}{" "}
            ! Vous êtes connecté.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            onClick={() => signOut()}
          >
            Se déconnecter
          </button>
        </>
      ) : (
        <>
          <p>Veuillez vous connecter pour accéder à toutes les fonctionnalités.</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => signIn()}
          >
            Se connecter
          </button>
        </>
      )}
    </div>
  );
}
