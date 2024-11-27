"use client";

import { FormEvent, useState, useRef, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const addTopicModalRef = useRef<HTMLFormElement>(null);
  const authModalRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const handleAddTopic = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value.trim();
    const content = (form.elements.namedItem("content") as HTMLTextAreaElement).value.trim();
    const categoryId = parseInt(
      (form.elements.namedItem("category") as HTMLSelectElement).value,
      10
    );
  
    if (!title || !content || isNaN(categoryId)) {
      alert("Veuillez remplir tous les champs correctement.");
      return;
    }
  
    const data = { title, content, categoryId };
    console.log("Données envoyées :", data);
  
    const res = await fetch("/api/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  
    console.log("Statut de la réponse :", res.status);
    if (!res.ok) {
      const error = await res.json().catch(() => null);
      console.error("Réponse d'erreur du serveur :", error);
      alert(error?.error || "Une erreur est survenue.");
    } else {
      alert("Topic ajouté !");
      setShowModal(false);
      form.reset();
    }
  };
  
  
  

  const handleOutsideClick = (e: MouseEvent) => {
    const target = e.target as Node;

    if (
      showModal &&
      addTopicModalRef.current &&
      !addTopicModalRef.current.contains(target)
    ) {
      setShowModal(false);
    }

    if (
      showAuthModal &&
      authModalRef.current &&
      !authModalRef.current.contains(target)
    ) {
      setShowAuthModal(false);
    }
  };

  useEffect(() => {
    if (showModal || showAuthModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showModal, showAuthModal]);

  const handleAddTopicClick = () => {
    if (!session) {
      setShowAuthModal(true); // Show login/registration modal if not authenticated
    } else {
      setShowModal(true); // Show add topic modal if authenticated
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Bienvenue sur le Forum</h1>
      <button
        onClick={handleAddTopicClick}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Ajouter un topic
      </button>

      {/* Add Topic Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <form
            ref={addTopicModalRef}
            onSubmit={handleAddTopic}
            className="bg-white p-4 rounded"
          >
            <h2 className="text-lg font-bold">Nouveau Topic</h2>
            <input
              name="title"
              placeholder="Titre"
              className="w-full p-2 border mt-2"
              required
            />
            <textarea
              name="content"
              placeholder="Contenu"
              className="w-full p-2 border mt-2"
              required
            />
            <select name="category" className="w-full p-2 border mt-2" required>
              <option value="1">Ancien Testament</option>
              <option value="2">Nouveau Testament</option>
              <option value="3">Foi et Vie Quotidienne</option>
              <option value="4">Questions Théologiques</option>
              <option value="5">Témoignages et Prières</option>
            </select>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
            >
              Ajouter
            </button>
          </form>
        </div>
      )}

      {/* Login/Registration Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div ref={authModalRef} className="bg-white p-4 rounded">
            <h2 className="text-lg font-bold">Connexion ou Inscription</h2>
            <p className="mt-2">Vous devez être connecté pour ajouter un topic.</p>
            <div className="flex gap-4 mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => signIn()}
              >
                Connexion
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => setShowAuthModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
