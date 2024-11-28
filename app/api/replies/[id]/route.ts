import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next'; // Utilisez getServerSession avec le nouvel App Router

const prisma = new PrismaClient();

// Gérer la requête POST
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(); // Récupérer la session utilisateur
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const userId = session.user.id;
    const replyId = parseInt(params.id, 10);

    if (isNaN(replyId)) {
      return NextResponse.json({ error: 'ID de réponse invalide' }, { status: 400 });
    }

    // Vérifier si la réponse existe
    const reply = await prisma.reply.findUnique({ where: { id: replyId } });
    if (!reply) {
      return NextResponse.json({ error: 'Réponse introuvable' }, { status: 404 });
    }

    // Vérifier si l'utilisateur essaie de liker sa propre réponse
    if (reply.userId === userId) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas liker votre propre réponse' },
        { status: 403 }
      );
    }

    // Vérifier si l'utilisateur a déjà liké la réponse
    const existingLike = await prisma.like.findUnique({
      where: { userId_replyId: { userId, replyId } },
    });

    if (existingLike) {
      // Retirer le like (unlike)
      await prisma.like.delete({ where: { id: existingLike.id } });
      await prisma.reply.update({
        where: { id: replyId },
        data: { likes: { decrement: 1 } },
      });

      return NextResponse.json({ message: 'Like retiré' }, { status: 200 });
    }

    // Ajouter un like
    await prisma.like.create({
      data: { userId, replyId },
    });
    await prisma.reply.update({
      where: { id: replyId },
      data: { likes: { increment: 1 } },
    });

    return NextResponse.json({ message: 'Like ajouté' }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la gestion des likes :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
