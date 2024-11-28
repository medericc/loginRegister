import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { topicId, content } = req.body;

      if (!topicId || !content) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires." });
      }

      const reply = await prisma.reply.create({
        data: {
          content,
          topicId: parseInt(topicId, 10),
          userId: 1, // Remplacez par l'utilisateur connecté
        },
      });

      res.status(201).json(reply);
    } catch (error) {
      console.error("Erreur lors de la création de la réponse :", error);
      res.status(500).json({
        error: "Erreur serveur",
        details: error instanceof Error ? error.message : error,
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }
}
