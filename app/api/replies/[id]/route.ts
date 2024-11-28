import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const reply = await prisma.reply.update({
      where: { id: parseInt(id as string, 10) },
      data: { likes: { increment: 1 } },
    });

    res.status(200).json(reply);
  } catch (error) {
    console.error("Erreur lors de l'incrémentation des likes :", error);
    res.status(500).json({
      error: "Erreur serveur",
      details: error instanceof Error ? error.message : error,
    });
  }
}
