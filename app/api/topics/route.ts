// app/api/topics/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    console.log("Requête POST reçue.");

    const body = await req.json();
    console.log("Corps de la requête :", body);

    if (!body) {
      console.error("Le corps de la requête est requis.");
      return NextResponse.json(
        { error: "Le corps de la requête est requis." },
        { status: 400 }
      );
    }

    const { title, content, categoryId } = body;
    console.log("Champs extraits :", { title, content, categoryId });

    if (!title || !content || categoryId == null) {
      console.error("Champs manquants ou invalides :", { title, content, categoryId });
      return NextResponse.json(
        { error: "Tous les champs sont obligatoires." },
        { status: 400 }
      );
    }

    const numericCategoryId = Number(categoryId);
    if (isNaN(numericCategoryId)) {
      console.error("categoryId n'est pas un nombre :", categoryId);
      return NextResponse.json(
        { error: "categoryId doit être un nombre valide." },
        { status: 400 }
      );
    }

    // Valider si la catégorie existe
    console.log("Validation de la catégorie...");
    const categoryExists = await prisma.category.findUnique({
      where: { id: numericCategoryId },
    });

    if (!categoryExists) {
      console.error("La catégorie spécifiée n'existe pas :", numericCategoryId);
      return NextResponse.json(
        { error: "La catégorie spécifiée est invalide." },
        { status: 400 }
      );
    }

    console.log("Tentative de création du topic...");
    const topic = await prisma.topic.create({
      data: { title, content, categoryId: numericCategoryId },
    });

    console.log("Topic créé avec succès :", topic);
    return NextResponse.json(topic, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Erreur Prisma connue :", error.message);
      return NextResponse.json(
        { error: "Erreur de la base de données." },
        { status: 500 }
      );
    }

    console.error("Erreur interne du serveur :", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
