import { auth } from "@/auth";
import BillingClient from "./billing-client";
import { getPatientBillsAction } from "@/actions/Billing/index";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "PATIENT") {
    redirect("/login");
  }

  // Casting user as any to access custom id added by the session callback
  const bills = await getPatientBillsAction((session.user as any).id);

  return <BillingClient initialBills={bills} />;
}
