import { auth } from "@/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const { email } = session.user || {};

  const user = await prisma.user.findUnique({
    where: {
      email: email as string,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="h-full w-full flex justify-center items-center">
      <h1 className="text-3xl font-bold">Hello {user.firstName}</h1>
    </div>
  );
}
