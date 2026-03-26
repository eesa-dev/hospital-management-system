"use server";

import connectDB from "@/lib/db";
import { Prescriptions } from "@/models/Prescriptions";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createPrescriptionAction(data: {
  appointmentId: string;
  patientId: string;
  medicineName: string;
  dosage: string;
  duration: string;
  instructions?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "DOCTOR") {
      return { error: "Unauthorized: Only doctors can issue prescriptions." };
    }

    await connectDB();
    
    // Create the prescription
    const newPrescription = await Prescriptions.create({
      ...data,
      doctorId: session.user.id,
    });

    revalidatePath("/dashboard/doctor");
    return { 
      success: true, 
      message: "Prescription issued successfully", 
      prescriptionId: newPrescription._id.toString() 
    };
  } catch (error) {
    console.error("Action Error [createPrescriptionAction]:", error);
    return { error: "Failed to create prescription" };
  }
}

export async function getPrescriptionsForPatientAction(patientId: string) {
  try {
    await connectDB();
    const prescriptions = await Prescriptions.find({ patientId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(prescriptions));
  } catch (error) {
    return { error: "Failed to fetch prescriptions" };
  }
}
