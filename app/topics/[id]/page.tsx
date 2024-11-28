import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function TopicPage({ params }: { params: { id: string } }) {
  const topicId = parseInt(params.id, 10);

  // Récupération du topic depuis la base de données
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: { category: true }, // Inclure la catégorie pour l'afficher
  });

  if (!topic) {
    return <div>Topic introuvable</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{topic.title}</h1>
      <p className="text-gray-700 mb-4">Catégorie : {topic.category.name}</p>
      <p>{topic.content}</p>
      <p className="text-gray-500 text-sm mt-4">
        Créé le : {new Date(topic.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
