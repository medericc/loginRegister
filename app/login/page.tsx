"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Se connecter</h1>
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null); // Réinitialiser l'erreur au début de la tentative

          const formData = new FormData(e.currentTarget);
          const email = formData.get("email") as string;
          const password = formData.get("password") as string;

          const result = await signIn("credentials", {
            email,
            password,
            redirect: false, // Ne pas rediriger automatiquement
          });

          if (!result || result.error) {
            setError("Email et/ou mot de passe invalides");
          } else {
            window.location.href = "/"; // Redirection manuelle après succès
          }
        }}
      >
        <div className="my-4">
          <label htmlFor="email" className="block text-sm">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="border rounded px-4 py-2 w-full"
            required
          />
        </div>
        <div className="my-4">
          <label htmlFor="password" className="block text-sm">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="border rounded px-4 py-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
