// File: app/_actions/register.ts
"use server"

import prisma from "@/lib/db";

export async function checkEmail(email: string) {
  // Check if the user already exists in the database
  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (existingUser) {
    // Email exists, return an error message
    return { success: false, message: "Email is already in use" };
  }

  return { success: true };
}

export async function register(data: FormData) {
  const email = data.get("email") as string;
  const firstName = data.get("firstName") as string;
  const lastName = data.get("lastName") as string;
  const password = data.get("password") as string;

  // Check if the email exists
  const emailCheck = await checkEmail(email);

  if (!emailCheck.success) {
    return { success: false, message: emailCheck.message };
  }

  // Create new user (if email doesn't exist)
  const user = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      password, // Note: Remember to hash passwords before saving them
    },
  });

  return { success: true, user };
}
