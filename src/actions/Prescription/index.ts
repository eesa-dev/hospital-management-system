"use server";

import connectDB from "@/lib/db";
import { Prescriptions } from "@/models/Prescriptions";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createPrescriptionAction(data: {
  appointmentId: string;
  patientId: string;
  items: Array<{
    medicineName: string;
    dosage: string;
    duration: string;
    instructions?: string;
  }>;
}) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "DOCTOR") {
      return { error: "Unauthorized: Only doctors can issue prescriptions." };
    }

    if (!data.items || data.items.length === 0) {
      return { error: "No medicines selected for prescription." };
    }

    await connectDB();
    
    // Create multiple prescriptions in one batch
    const prescriptionsToCreate = data.items.map(item => ({
      appointmentId: data.appointmentId,
      patientId: data.patientId,
      doctorId: session.user.id,
      ...item,
    }));

    await Prescriptions.insertMany(prescriptionsToCreate);

    revalidatePath("/dashboard/doctor");
    return { 
      success: true, 
      message: `${data.items.length} medicines prescribed successfully`
    };
  } catch (error) {
    console.error("Action Error [createPrescriptionAction]:", error instanceof Error ? error.message : error);
    return { error: "Failed to create prescription batch" };
  }
}

export async function getAllPrescriptionsAction() {
  try {
    const session = await auth();
    const role = session?.user?.role;
    if (role !== "PHARMACY" && role !== "PHARMACIST" && role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    await connectDB();
    
    const prescriptions = await Prescriptions.aggregate([
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
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "userId",
          as: "doctorInfo"
        }
      },
      {
        $project: {
          _id: { $toString: "$_id" },
          patientId: 1,
          medicineName: 1,
          dosage: 1,
          duration: 1,
          instructions: 1,
          status: 1,
          createdAt: 1,
          patient: {
            name: { $ifNull: [{ $arrayElemAt: ["$patientInfo.name", 0] }, "Walk-in Patient"] },
            phone: { $ifNull: [{ $arrayElemAt: ["$patientInfo.phone", 0] }, "N/A"] }
          },
          doctor: {
            name: { $ifNull: [{ $arrayElemAt: ["$doctorInfo.name", 0] }, "System Doctor"] },
            specialization: { $ifNull: [{ $arrayElemAt: ["$doctorInfo.specialization", 0] }, "General Physician"] }
          }
        }
      }
    ]);

    return JSON.parse(JSON.stringify(prescriptions));
  } catch (error) {
    console.error("Action Error [getAllPrescriptionsAction]:", error instanceof Error ? error.message : error);
    return { error: "Failed to fetch prescriptions" };
  }
}

export async function getPrescriptionsForPatientAction(patientId: string) {
  try {
    await connectDB();
    const prescriptions = await Prescriptions.find({ patientId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(prescriptions));
  } catch (error) {
    console.error("Action Error [getPrescriptionsForPatientAction]:", error instanceof Error ? error.message : error);
    return { error: "Failed to fetch prescriptions" };
  }
}
