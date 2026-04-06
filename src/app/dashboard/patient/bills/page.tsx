import { auth } from "@/auth";
import BillingClient from "./billing-client";
import { getPatientBillsAction } from "@/actions/Billing/index";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "PATIENT") {
    redirect("/login");
  }

  const bills = await getPatientBillsAction(session.user.id);

  return <BillingClient initialBills={bills} />;
}
