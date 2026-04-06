"use server";

import connectDB from "../../lib/db";
import { Appointments } from "../../models/Appointments";
import { Doctors } from "../../models/Doctors";
import { appointmentSchema } from "../../schemas/appointment.schema";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";

export async function createAppointmentAction(data: unknown) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "You must be logged in to book an appointment." };
    }

    await connectDB();

    // 1. Zod Validation
    const parsedResult = appointmentSchema.safeParse(data);
    if (!parsedResult.success) {
      return { 
        error: "Validation failed", 
        fields: parsedResult.error.flatten().fieldErrors 
      };
    }

    const { doctorId: doctorProfileId, appointmentDate } = parsedResult.data;

    // IMPORTANT: The doctorId coming from the form is the Doctor's Profile ID (_id in Doctors collection).
    // Our Appointments model expects the doctor's User ID (ref: "Users").
    const doctorProfile = await Doctors.findById(doctorProfileId);
    if (!doctorProfile) {
      return { error: "Selected doctor not found." };
    }

    // 2. Create Appointment
    const newAppointment = await Appointments.create({
      patientId: session.user.id,
      doctorId: doctorProfile.userId, // Save the User ID of the doctor
      appointmentDate: new Date(appointmentDate),
      status: "PENDING",
    });

    revalidatePath("/dashboard/patient");
    revalidatePath("/dashboard/doctor");

    return { 
      success: true, 
      message: "Appointment booked successfully",
      appointmentId: newAppointment._id.toString() 
    };
  } catch (error) {
    console.error("Action Error [createAppointmentAction]:", error instanceof Error ? error.message : error);
    return { error: "An internal server error occurred." };
  }
}

export async function updateAppointmentStatusAction(appointmentId: string, status: "CONFIRMED" | "CANCELLED" | "COMPLETED") {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    await connectDB();

    const appointment = await Appointments.findById(appointmentId);
    if (!appointment) {
      return { error: "Appointment not found" };
    }

    // Ensure the doctor is the one updating it (or an admin)
    if (appointment.doctorId.toString() !== session.user.id && session.user.role !== "ADMIN") {
      return { error: "You are not authorized to manage this appointment." };
    }

    appointment.status = status;
    await appointment.save();

    revalidatePath("/dashboard/doctor");
    revalidatePath("/dashboard/patient");
    
    return { success: true, message: `Appointment marked as ${status.toLowerCase()}` };
  } catch (error) {
    console.error("Action Error [updateAppointmentStatusAction]:", error instanceof Error ? error.message : error);
    return { error: "An internal server error occurred." };
  }
}
