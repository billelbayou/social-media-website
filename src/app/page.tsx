import { auth } from "@/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  // Redirect to login if no session is found
  if (!session) {
    redirect("/login");
    return; // Prevent further execution after redirect
  }

  const { email } = session.user || {}; // Destructure for better readability

  try {
    // Fetch user data from the database
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // Check if user exists
    if (!user) {
      redirect("/login"); // Or handle it differently based on your requirements
      return;
    }

    return (
      <div className="h-full w-full flex justify-center items-center">
        <h1 className="text-3xl font-bold">Hello {user.firstName}</h1>
      </div>
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    // You could redirect or show an error message based on your app's requirements
    redirect("/error"); // Redirect to a generic error page or show a message
  }
}
