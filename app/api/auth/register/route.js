import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Valider les données
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Tous les champs sont obligatoires." }),
        { status: 400 }
      );
    }

    // Vérifier que l'email est valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Adresse email invalide." }),
        { status: 400 }
      );
    }

    // Vérifier que le mot de passe respecte les critères
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return new Response(
        JSON.stringify({
          error: "Le mot de passe doit contenir au moins 6 caractères et un caractère spécial.",
        }),
        { status: 400 }
      );
    }

    // Vérifiez si l'email existe déjà
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return new Response(
        JSON.stringify({ error: "Email déjà enregistré. Essayez de vous connecter." }),
        { status: 400 }
      );
    }

    // Vérifiez si le pseudo existe déjà
    const existingUser = await prisma.user.findUnique({ where: { name } });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "Nom déjà pris. Veuillez en choisir un autre." }),
        { status: 400 }
      );
    }

    // Créer l'utilisateur
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Retourner une réponse avec les données utilisateur sans inclure le mot de passe
    return new Response(
      JSON.stringify({ user: { id: user.id, name: user.name, email: user.email } }),
      { status: 201 }
    );
  } catch (error) {
    // Ajouter une vérification pour éviter l'erreur d'objet null
    if (error && error.message) {
      console.error("Erreur serveur :", error.message);
    } else {
      console.error("Erreur serveur inconnue", error);
    }

    return new Response(
      JSON.stringify({ error: "Erreur serveur. Veuillez réessayer plus tard." }),
      { status: 500 }
    );
  }
}
