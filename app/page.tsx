"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent, useRef } from "react";
import { useSession, signIn } from "next-auth/react";

interface Category {
  id: number;
  name: string;
}


export default function HomePage() {
  const router = useRouter(); 
  const [categories, setCategories] = useState<Category[]>([]); // Catégories disponibles
 const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // Catégorie sélectionnée
  const [showModal, setShowModal] = useState(false); // Modale pour ajouter un topic
  const [showAuthModal, setShowAuthModal] = useState(false); // Modale pour l'authentification
  const addTopicModalRef = useRef<HTMLFormElement>(null); // Référence de la modale d'ajout
  const authModalRef = useRef<HTMLDivElement>(null); // Référence de la modale d'auth

  const { data: session } = useSession(); // Session utilisateur

  // Récupérer les catégories au chargement
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data: Category[] = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);



  // Gestion du clic sur une catégorie
  const handleCategoryClick = (categoryId: number) => {
    router.push(`/categories/${categoryId}`); // Rediriger vers la page avec l'ID
  };

  // Soumission du formulaire pour ajouter un topic
  const handleAddTopic = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value.trim();
    const content = (form.elements.namedItem("content") as HTMLTextAreaElement).value.trim();
  
    // Vérifiez si une catégorie est sélectionnée
    if (!title || !content || !selectedCategory) {
      alert("Veuillez remplir tous les champs correctement.");
      return;
    }
  
    const data = { title, content, categoryId: selectedCategory };
    const res = await fetch("/api/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
      const error = await res.json().catch(() => null);
      alert(error?.error || "Une erreur est survenue.");
    } else {
      alert("Topic ajouté !");
      setShowModal(false);
      form.reset();
    }
  };
  

  // Gestion du clic pour ajouter un topic
  const handleAddTopicClick = () => {
    if (!session) {
      setShowAuthModal(true);
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Bienvenue sur le Forum</h1>

      {/* Bouton pour ajouter un topic */}
      <button
        onClick={handleAddTopicClick}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Ajouter un topic
      </button>

      {/* Liste des catégories */}
      <div className="mt-4">
        <h2 className="text-lg font-bold">Catégories</h2>
        <div className="flex gap-4 mt-2">
  {categories.map((category) => (
    <button
      key={category.id}
      onClick={() => handleCategoryClick(category.id)} // Redirection ici
      className={`px-4 py-2 rounded ${
        selectedCategory === category.id
          ? "bg-blue-500 text-white"
          : "bg-gray-200"
      }`}
    >
      {category.name}
    </button>
  ))}
</div>

      </div>

    

     {/* Modale pour ajouter un topic */}
     {showModal && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
    <form
      ref={addTopicModalRef}
      onSubmit={handleAddTopic}
      className="bg-white p-4 rounded w-80"
    >
      <h2 className="text-lg font-bold">Nouveau Topic</h2>
      
      {/* Titre */}
      <input
        name="title"
        placeholder="Titre"
        className="w-full p-2 border mt-2"
        required
      />
      
      {/* Contenu */}
      <textarea
        name="content"
        placeholder="Contenu"
        className="w-full p-2 border mt-2"
        required
      />
      
      {/* Sélection de catégorie */}
      <label className="mt-4 block font-semibold">Catégorie :</label>
      <select
        className="w-full p-2 border mt-2"
        value={selectedCategory || ""}
        onChange={(e) => setSelectedCategory(Number(e.target.value))}
        required
      >
        <option value="" disabled>
          -- Sélectionnez une catégorie --
        </option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      
      {/* Bouton de validation */}
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Ajouter
      </button>
    </form>
  </div>
)}



      {/* Modale d'authentification */}
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
