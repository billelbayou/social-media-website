import { auth, signOut } from "@/auth";
import prisma from "@/lib/db";

export default async function Header() {
  const session = await auth();
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email,
    },
  });
  return (
    <div className="w-full shadow-md h-20 flex justify-between items-center py-2 px-10">
      <h1 className="text-3xl font-bold">Blog</h1>
      <div className="flex gap-3">
        <h2>
          {user?.firstName} {user?.lastName}
        </h2>
        <div>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button type="submit">Sign Out</button>
          </form>
        </div>
      </div>
    </div>
  );
}
