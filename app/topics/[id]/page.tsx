"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Interface pour typage de Topic
interface Topic {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  category: { name: string };
  replies: Array<{
    id: number;
    content: string;
    createdAt: string;
    likes: number;
    user: { name: string | null };
  }>;
}

export default function TopicPage() {
  const params = useParams();
  const id = params?.id;
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"oldest" | "newest" | "mostLiked" | "leastLiked">(
    "oldest"
  );

  useEffect(() => {
    if (!id) return;
    async function fetchTopic() {
      try {
        const response = await fetch(`/api/topics/${id}`);
        if (response.ok) {
          const data = await response.json();
          setTopic(data);
        } else {
          console.error("Erreur lors du fetch du topic :", response.status);
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTopic();
  }, [id]);

  const sortReplies = (replies: Topic["replies"]) => {
    switch (sortBy) {
      case "newest":
        return [...replies].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "mostLiked":
        return [...replies].sort((a, b) => b.likes - a.likes);
      case "leastLiked":
        return [...replies].sort((a, b) => a.likes - b.likes);
      case "oldest":
      default:
        return [...replies].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (!topic) return <div>Topic introuvable</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{topic.title}</h1>
      <p className="text-gray-700 mb-4">Catégorie : {topic.category.name}</p>
      <p>{topic.content}</p>
      <p className="text-gray-500 text-sm mt-4">
        Créé le : {new Date(topic.createdAt).toLocaleDateString()}
      </p>

      {/* Section des réponses */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Réponses</h2>
        <ReplyForm topicId={topic.id} />

        {/* Menu déroulant pour le tri */}
        <div className="mt-4 mb-4">
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
            Trier par :
          </label>
          <select
            id="sort"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "oldest" | "newest" | "mostLiked" | "leastLiked")}
          >
            <option value="oldest">Plus vieux</option>
            <option value="newest">Plus récent</option>
            <option value="mostLiked">Plus liké</option>
            <option value="leastLiked">Moins liké</option>
          </select>
        </div>

        <div className="mt-4">
          {sortReplies(topic.replies).map((reply) => (
            <div key={reply.id} className="border rounded p-4 mb-4">
              <p className="text-gray-700">{reply.content}</p>
              <p className="text-gray-500 text-sm">
                Par : {reply.user?.name || "Utilisateur inconnu"} -{" "}
                {new Date(reply.createdAt).toLocaleDateString()}
              </p>
              <button
                className="text-blue-500 hover:underline mt-2"
                onClick={() => likeReply(reply.id)}
              >
                J&apos;aime ({reply.likes})
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Composant pour soumettre une réponse
function ReplyForm({ topicId }: { topicId: number }) {
  const [content, setContent] = useState("");

  const submitReply = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId, content }),
      });

      if (response.ok) {
        setContent(""); // Réinitialise le champ après envoi
        window.location.reload(); // Recharge pour afficher la nouvelle réponse
      } else {
        console.error("Erreur lors de l'envoi de la réponse :", response.status);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  return (
    <form onSubmit={submitReply} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Écrivez votre réponse ici..."
        className="w-full border rounded p-2"
        required
      />
      <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Répondre
      </button>
    </form>
  );
}

// Fonction pour liker une réponse
async function likeReply(replyId: number) {
  try {
    const response = await fetch(`/api/replies/${replyId}`, {
      method: "POST",
    });

    if (response.ok) {
      window.location.reload(); // Recharge la page pour mettre à jour les likes
    } else {
      const errorData = await response.json();
      console.error("Erreur lors du like :", errorData.error);
      alert(errorData.error); // Affiche l'erreur à l'utilisateur
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
  }
}
