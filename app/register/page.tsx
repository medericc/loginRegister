"use client";

export default function RegisterPage() {
  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      alert("Inscription réussie. Vous pouvez maintenant vous connecter !");
      window.location.href = "/login"; // Redirige vers la page de connexion
    } else {
      const errorData = await response.json();
      alert(`Erreur : ${errorData.error}`);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Créer un compte</h1>
      <form onSubmit={handleRegister} className="w-full max-w-sm mt-6">
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
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded w-full"
        >
         REGISTER
        </button>
      </form>
    </div>
  );
}
