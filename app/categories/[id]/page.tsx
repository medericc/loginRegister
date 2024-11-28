import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function CategoryPage({ params }: { params: { id: string } }) {
  const categoryId = parseInt(params.id, 10);

  // Récupérer la catégorie et ses topics
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { topics: true },
  });

  if (!category) {
    return <div>Catégorie introuvable</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{category.name}</h1>
      <ul>
        {category.topics.map((topic) => (
          <li key={topic.id} className="mb-2">
            {/* Lien vers le topic */}
            <Link href={`/topics/${topic.id}`} className="text-blue-500 hover:underline">
              {topic.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
