import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserRole } from "@/types/user.types";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;

  switch (role) {
    case UserRole.ADMIN:
      redirect("/dashboard/admin");
    case UserRole.DOCTOR:
      redirect("/dashboard/doctor");
    case UserRole.PATIENT:
      redirect("/dashboard/patient");
    case UserRole.PHARMACY:
    case "PHARMACIST":
      redirect("/dashboard/pharmacy");
    default:
      redirect("/login");
  }
}
