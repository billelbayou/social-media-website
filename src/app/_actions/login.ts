"use server";

import { signIn } from "@/auth";
import prisma from "@/lib/db"; // Your Prisma client instance
import { compare } from "bcryptjs"; // Assuming you're using bcrypt to hash passwords

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Fetch the user from the database
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { success: false, message: "Invalid email or password" };
  }

  // Compare the entered password with the hashed password in the database
  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    return { success: false, message: "Invalid email or password" };
  }

  // Optionally, handle session creation or token generation here
  await signIn("credentials", {
    redirect: false, // Set this to false to avoid automatic redirection by NextAuth
    email, // Pass the validated email
    password, // Pass the validated password
  });
  return { success: true, message: "Login successful" };
}
