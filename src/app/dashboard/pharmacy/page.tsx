import { auth } from "@/auth";
import InventoryClient from "./inventory-client";
import { getInventoryAction } from "@/actions/Pharmacy/index";
import { redirect } from "next/navigation";
import { UserRole } from "@/types/user.types";

export default async function PharmacyPage() {
  const session = await auth();

  const role = (session?.user as any)?.role;
  if (!session?.user || (role !== UserRole.PHARMACY && role !== "PHARMACIST")) {
    redirect("/login");
  }

  const items = await getInventoryAction();

  return <InventoryClient initialItems={items} />;
}
