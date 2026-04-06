import { auth } from "@/auth";
import DoctorClient from "./doctor-client";
import connectDB from "../../../lib/db";
import { Appointments } from "../../../models/Appointments";
import { Pharmacy } from "../../../models/Pharmacy";
import mongoose from "mongoose";
import { redirect } from "next/navigation";
import { UserRole } from "@/types/user.types";

export default async function DoctorPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== UserRole.DOCTOR) {
    redirect("/login");
  }

  await connectDB();

  // 1. Fetch appointments for this doctor and populate patient info
  const richAppointments = await Appointments.aggregate([
    { $match: { doctorId: new mongoose.Types.ObjectId(session.user.id) } },
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
        appointmentDate: 1,
        status: 1,
        patientId: {
          _id: { $toString: "$patientId" },
          name: { $ifNull: [{ $arrayElemAt: ["$patientInfo.name", 0] }, "Unknown Patient"] }
        }
      }
    },
    { $sort: { appointmentDate: 1 } }
  ]);

  // 2. Fetch available medicines from Pharmacy Inventory
  const inventory = await Pharmacy.find().sort({ medicineName: 1 }).lean();

  return (
    <DoctorClient 
      initialAppointments={richAppointments} 
      inventory={JSON.parse(JSON.stringify(inventory))}
    />
  );
}
