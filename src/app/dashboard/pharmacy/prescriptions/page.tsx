import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserRole } from "@/types/user.types";

export default async function PharmacyPrescriptionsPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (!session?.user || (role !== UserRole.PHARMACY && role !== "PHARMACIST")) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-slate-800">Prescription Orders</h2>
      <p className="text-slate-500">Fulfill medication orders from doctors.</p>
      <div className="p-8 border-2 border-dashed border-slate-200 rounded-lg text-center text-slate-500">
        Prescription fulfillment modules are being integrated.
      </div>
    </div>
  );
}
