import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./lib/db";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password) {
          throw new CredentialsSignin("Please provide both email & password");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        if (!user) {
          throw new Error("Invalid email or password");
        }
        if (!user.password) {
          throw new Error("Invalid email or password");
        }
        const isMatched = await compare(password, user.password);
        if (!isMatched) {
          throw new Error("Invalid email or password");
        }
        const userData = {
          id: user.id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
        return userData;
      },
    }),
  ],
  pages: {
    signIn: "/login"
  }
});
