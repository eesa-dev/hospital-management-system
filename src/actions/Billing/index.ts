"use server";

import connectDB from "../../lib/db";
import { Billing } from "../../models/Billing";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";

export async function createInvoiceAction(data: {
  patientId: string;
  appointmentId?: string;
  prescriptionId?: string;
  totalAmount: number;
  paymentMethod: "CASH" | "CARD" | "INSURANCE";
}) {
  try {
    const session = await auth();
    const role = session?.user?.role;
    if (role !== "ADMIN" && role !== "DOCTOR" && role !== "PHARMACY" && role !== "PHARMACIST") {
      return { error: "Unauthorized" };
    }

    await connectDB();
    
    const newBill = await Billing.create({
      ...data,
      paymentStatus: "PENDING",
      billDate: new Date(),
    });

    // If this invoice is linked to a prescription, mark the prescription as BILLED
    if (data.prescriptionId) {
      const { Prescriptions } = await import("@/models/Prescriptions");
      await Prescriptions.findByIdAndUpdate(data.prescriptionId, { status: "BILLED" });
    }

    revalidatePath("/dashboard/patient");
    revalidatePath("/dashboard/pharmacy/prescriptions");
    return { 
      success: true, 
      message: "Invoice generated successfully", 
      billId: newBill._id.toString() 
    };
  } catch (error) {
    console.error("Action Error [createInvoiceAction]:", error instanceof Error ? error.message : error);
    return { error: "Failed to generate invoice" };
  }
}

export async function getAllBillsAction() {
  try {
    const session = await auth();
    const role = session?.user?.role;
    if (role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    await connectDB();
    
    const bills = await Billing.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "patients",
          localField: "patientId",
          foreignField: "userId",
          as: "patientInfo"
        }
      },
      {
        $project: {
          _id: { $toString: "$_id" },
          totalAmount: 1,
          paymentStatus: 1,
          paymentMethod: 1,
          billDate: 1,
          patientName: { $ifNull: [{ $arrayElemAt: ["$patientInfo.name", 0] }, "Unknown Patient"] }
        }
      }
    ]);

    return JSON.parse(JSON.stringify(bills));
  } catch (error) {
    console.error("Action Error [getAllBillsAction]:", error instanceof Error ? error.message : error);
    return { error: "Failed to fetch bills" };
  }
}

export async function getPatientBillsAction(patientId: string) {
  try {
    await connectDB();
    const bills = await Billing.find({ patientId }).sort({ billDate: -1 });
    return JSON.parse(JSON.stringify(bills));
  } catch (error) {
    console.error("Action Error [getPatientBillsAction]:", error instanceof Error ? error.message : error);
    return { error: "Failed to fetch bills" };
  }
}

export async function updatePaymentStatusAction(billId: string, status: "PAID" | "OVERDUE") {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return { error: "Only admins can confirm payments" };
    }

    await connectDB();
    await Billing.findByIdAndUpdate(billId, { paymentStatus: status });
    revalidatePath("/dashboard/patient");
    return { success: true, message: `Bill marked as ${status.toLowerCase()}` };
  } catch (error) {
    console.error("Action Error [updatePaymentStatusAction]:", error instanceof Error ? error.message : error);
    return { error: "Failed to update payment status" };
  }
}
