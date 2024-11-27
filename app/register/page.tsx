"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    server: "",
  });

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({ name: "", email: "", password: "", server: "" }); // Réinitialise les erreurs

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validation côté client
    let hasError = false;
    if (!name) {
      setErrors((prev) => ({ ...prev, name: "Le nom est obligatoire." }));
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "L'email n'est pas valide.",
      }));
      hasError = true;
    }

    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
    if (!passwordRegex.test(password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Le mot de passe doit comporter au moins 6 caractères, dont un caractère spécial.",
      }));
      hasError = true;
    }

    if (hasError) return; // Stoppe la soumission si erreurs

    // Envoie les données au serveur
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      alert("Inscription réussie. Vous pouvez maintenant vous connecter !");
      window.location.href = "/login";
    } else {
      const errorData = await response.json();
      setErrors((prev) => ({ ...prev, server: errorData.error }));
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Créer un compte</h1>
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm mt-6"
      >
        <div className="my-4">
          <label htmlFor="name" className="block text-sm">
            Nom
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="border rounded px-4 py-2 w-full"
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
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
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
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
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
        {errors.server && (
          <p className="text-red-500 text-center">{errors.server}</p>
        )}
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded w-full"
        >
          REGISTER
        </button>
      </form>
    </div>
  );
}
