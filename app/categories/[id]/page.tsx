// app/categories/[id]
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CategoryPageProps {
  params: { id: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = params;

  // Fetch the category by ID, including associated topics
  const category = await prisma.category.findUnique({
    where: { id: parseInt(id, 10) },
    include: { topics: true }, // Include related topics
  });

  if (!category) {
    return <div>Catégorie non trouvée</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{category.name}</h1>
      <ul className="mt-4">
        {category.topics.map((topic) => (
          <li key={topic.id} className="p-2 border-b">
            <h2 className="text-lg font-bold">{topic.title}</h2>
            <p>{topic.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
