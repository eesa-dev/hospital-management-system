import { auth } from "@/auth";
import PatientClient from "./patient-client";
import connectDB from "../../../lib/db";
import { Appointments } from "../../../models/Appointments";
import { Billing } from "../../../models/Billing";
import { Prescriptions } from "../../../models/Prescriptions";
import { redirect } from "next/navigation";
import { UserRole } from "@/types/user.types";
import mongoose from "mongoose";

export default async function PatientPage() {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== UserRole.PATIENT) {
    redirect("/login");
  }

  await connectDB();

  const userId = new mongoose.Types.ObjectId(session.user.id);

  // Fetch user-specific data using aggregation for appointments to join with Doctors
  const [pendingBillsData, upcomingAppointments, medicalRecords] = await Promise.all([
    Billing.aggregate([
      { $match: { patientId: session.user.id, paymentStatus: "PENDING" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]),
    Appointments.aggregate([
      { 
        $match: { 
          patientId: userId,
          status: { $in: ["PENDING", "CONFIRMED"] }
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
          appointmentDate: 1,
          status: 1,
          doctor: {
            name: { $ifNull: [{ $arrayElemAt: ["$doctorInfo.name", 0] }, "General Physician"] },
            specialization: { $ifNull: [{ $arrayElemAt: ["$doctorInfo.specialization", 0] }, "Healthcare"] }
          }
        }
      },
      { $sort: { appointmentDate: 1 } },
      { $limit: 5 }
    ]),
    Prescriptions.aggregate([
        { $match: { patientId: session.user.id } },
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
            medicineName: 1,
            dosage: 1,
            duration: 1,
            instructions: 1,
            createdAt: 1,
            doctor: {
              name: { $ifNull: [{ $arrayElemAt: ["$doctorInfo.name", 0] }, "Dr. Smith"] },
              specialization: { $ifNull: [{ $arrayElemAt: ["$doctorInfo.specialization", 0] }, "Medical Officer"] }
            }
          }
        },
        { $sort: { createdAt: -1 } },
        { $limit: 10 }
    ])
  ]);

  const initialData = {
    pendingBills: pendingBillsData[0]?.total || 0,
    upcomingAppointments: JSON.parse(JSON.stringify(upcomingAppointments)),
    medicalRecords: JSON.parse(JSON.stringify(medicalRecords)),
  };

  return <PatientClient session={session} initialData={initialData} />;
}
