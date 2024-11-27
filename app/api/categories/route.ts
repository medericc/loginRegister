// app/api/categories/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// API pour récupérer les topics par catégorie
export async function POST(req: Request) {
  try {
    const { categoryId } = await req.json();
    const topics = await prisma.topic.findMany({
      where: { categoryId },
      include: { category: true },
    });
    return NextResponse.json(topics);
  } catch (error) {
    console.error("Erreur lors de la récupération des topics :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
