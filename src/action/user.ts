"use server";

import { signIn } from "@/auth";
import prisma from "@/lib/db";
import { hash } from "bcryptjs";
import { CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const result = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email,
      password,
    });

    if (result?.error) {
      throw new Error(result.error);
    }
  } catch (error) {
    const err = error as CredentialsSignin;
    console.error(err);
    throw new Error(`${err.message}`);
  }
  redirect("/")
}
export async function register(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!firstName || !lastName || !email || !password) {
    throw new Error("Please fill all fields");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser) throw new Error("User already exist");

  const hashedPassword = await hash(password, 10);

  await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    },
  });

  console.log("User Created succesfuly");
  redirect("/login");
}
