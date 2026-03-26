"use server";

import connectDB from "../../lib/db";
import { Billing } from "../../models/Billing";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";

export async function createInvoiceAction(data: {
  patientId: string;
  appointmentId?: string;
  totalAmount: number;
  paymentMethod: "CASH" | "CARD" | "INSURANCE";
}) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (role !== "ADMIN" && role !== "DOCTOR") {
      return { error: "Unauthorized" };
    }

    await connectDB();
    
    const newBill = await Billing.create({
      ...data,
      paymentStatus: "PENDING",
      billDate: new Date(),
    });

    revalidatePath("/dashboard/patient");
    return { 
      success: true, 
      message: "Invoice generated successfully", 
      billId: newBill._id.toString() 
    };
  } catch (error) {
    console.error("Action Error [createInvoiceAction]:", error);
    return { error: "Failed to generate invoice" };
  }
}

export async function getPatientBillsAction(patientId: string) {
  try {
    await connectDB();
    const bills = await Billing.find({ patientId }).sort({ billDate: -1 });
    return JSON.parse(JSON.stringify(bills));
  } catch (error) {
    return { error: "Failed to fetch bills" };
  }
}

export async function updatePaymentStatusAction(billId: string, status: "PAID" | "OVERDUE") {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
      return { error: "Only admins can confirm payments" };
    }

    await connectDB();
    await Billing.findByIdAndUpdate(billId, { paymentStatus: status });
    revalidatePath("/dashboard/patient");
    return { success: true, message: `Bill marked as ${status.toLowerCase()}` };
  } catch (error) {
    return { error: "Failed to update payment status" };
  }
}
