import { auth } from "@/auth";
import AdminClient from "./admin-client";
import connectDB from "../../../lib/db";
import { Users } from "../../../models/Users";
import { UserRole } from "../../../types/user.types";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== UserRole.ADMIN) {
    redirect("/login");
  }

  await connectDB();

  // Fetch real-time statistics from MongoDB
  const [totalPatients, totalDoctors] = await Promise.all([
    Users.countDocuments({ role: UserRole.PATIENT }),
    Users.countDocuments({ role: UserRole.DOCTOR }),
  ]);

  const initialData = {
    totalPatients,
    totalDoctors,
  };

  return <AdminClient session={session} initialData={initialData} />;
}
