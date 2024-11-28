import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Handler pour les requêtes GET
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const topic = await prisma.topic.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        category: true,
        replies: {
          include: { user: true },
        },
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic introuvable" }, { status: 404 });
    }

    return NextResponse.json(topic);
  } catch (error) {
    console.error("Erreur lors de la récupération du topic :", error);
    return NextResponse.json(
      {
        error: "Erreur serveur",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
