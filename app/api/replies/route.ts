import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse JSON body
    const { topicId, content } = body;

    if (!topicId || !content) {
      return NextResponse.json({ error: "Tous les champs sont obligatoires." }, { status: 400 });
    }

    const reply = await prisma.reply.create({
      data: {
        content,
        topicId: parseInt(topicId, 10),
        userId: 1, // Remplacez par l'ID utilisateur réel
      },
    });

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    // Vérification et gestion du type de l'erreur
    if (error instanceof Error) {
      console.error("Erreur lors de la création de la réponse :", error.message);
      return NextResponse.json(
        { error: "Erreur serveur", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("Erreur inconnue :", error);
      return NextResponse.json({ error: "Erreur serveur inconnue" }, { status: 500 });
    }
  }
}
