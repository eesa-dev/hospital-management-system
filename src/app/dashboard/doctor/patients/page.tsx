import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserRole } from "@/types/user.types";

export default async function DoctorPatientsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== UserRole.DOCTOR) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-slate-800">My Patients</h2>
      <p className="text-slate-500">View history and manage patient records.</p>
      <div className="p-8 border-2 border-dashed border-slate-200 rounded-lg text-center text-slate-500">
        Patient list and records are being integrated.
      </div>
    </div>
  );
}
