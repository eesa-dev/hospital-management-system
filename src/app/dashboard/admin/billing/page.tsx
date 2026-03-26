import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserRole } from "@/types/user.types";
import { getAllBillsAction } from "@/actions/Billing/index";
import AdminBillingClient from "./billing-client";

export default async function AdminBillingPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/login");
  }

  const bills = await getAllBillsAction();

  return <AdminBillingClient initialBills={Array.isArray(bills) ? bills : []} />;
}
