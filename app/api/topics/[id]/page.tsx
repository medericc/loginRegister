import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const topic = await prisma.topic.findUnique({
        where: { id: parseInt(id as string, 10) },
        include: { category: true },
      });

      if (!topic) {
        return res.status(404).json({ error: "Topic introuvable" });
      }

      res.status(200).json(topic);
    } catch (error) {
      console.error("Erreur lors de la récupération du topic :", error);
      res.status(500).json({ error: "Erreur serveur", details: error instanceof Error ? error.message : error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }
}
