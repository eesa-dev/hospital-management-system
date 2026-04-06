import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserRole } from "@/types/user.types";
import { getAllPrescriptionsAction } from "@/actions/Prescription/index";
import PrescriptionList from "./prescription-list";

export default async function PharmacyPrescriptionsPage() {
  const session = await auth();
  const role = session?.user?.role;

  if (!session?.user || (role !== UserRole.PHARMACY && role !== "PHARMACIST")) {
    redirect("/login");
  }

  const prescriptions = await getAllPrescriptionsAction();

  return <PrescriptionList initialPrescriptions={Array.isArray(prescriptions) ? prescriptions : []} />;
}
