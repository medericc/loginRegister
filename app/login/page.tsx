"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Se connecter</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const email = formData.get("email") as string;
          const password = formData.get("password") as string;

          signIn("credentials", {
            email,
            password,
            callbackUrl: "/", // Redirection après connexion
          });
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
