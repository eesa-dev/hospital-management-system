import { auth } from "../../../auth";
import AdminClient from "./admin-client";
import connectDB from "../../../lib/db";
import { Users } from "../../../models/Users";
import { UserRole } from "../../../types/user.types";
import { Appointments } from "../../../models/Appointments";
import { Prescriptions } from "../../../models/Prescriptions";
import { redirect } from "next/navigation";

interface UserRecord {
  _id: { toString: () => string };
  role: string;
  email: string;
  createdAt: string | Date;
}

interface ApptRecord {
  _id: { toString: () => string };
  status: string;
  patientId: { toString: () => string };
  createdAt: string | Date;
}

interface PrescRecord {
  _id: { toString: () => string };
  medicineName: string;
  createdAt: string | Date;
}

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/login");
  }

  await connectDB();

  // 1. Fetch real-time statistics
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const dayAgo = new Date(now - 24 * 60 * 60 * 1000);

  const [totalPatients, totalDoctors, newRegistrations24h] = await Promise.all([
    Users.countDocuments({ role: UserRole.PATIENT }),
    Users.countDocuments({ role: UserRole.DOCTOR }),
    Users.countDocuments({ 
      createdAt: { $gte: dayAgo } 
    }),
  ]);

  // 2. Fetch Recent System Activity (Last 10 events)
  const [recentUsers, recentAppts, recentPrescs] = await Promise.all([
    Users.find().sort({ createdAt: -1 }).limit(5).lean() as unknown as UserRecord[],
    Appointments.find().sort({ createdAt: -1 }).limit(5).lean() as unknown as ApptRecord[],
    Prescriptions.find().sort({ createdAt: -1 }).limit(5).lean() as unknown as PrescRecord[],
  ]);

  // Map to a unified activity format
  const activityLog = [
    ...recentUsers.map((u) => ({
      id: u._id.toString(),
      type: "Registration",
      detail: `New ${u.role.toLowerCase()} account: ${u.email}`,
      time: String(u.createdAt),
      status: "Success"
    })),
    ...recentAppts.map((a) => ({
      id: a._id.toString(),
      type: "Appointment",
      detail: `Appointment ${a.status.toLowerCase()} for patient ID ${a.patientId.toString().slice(-6)}`,
      time: String(a.createdAt),
      status: a.status === "CANCELLED" ? "Alert" : "Pending"
    })),
    ...recentPrescs.map((p) => ({
      id: p._id.toString(),
      type: "Pharmacy",
      detail: `Prescription issued for medicine: ${p.medicineName}`,
      time: String(p.createdAt),
      status: "Completed"
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

  const initialData = {
    totalPatients,
    totalDoctors,
    newRegistrations24h,
    activityLog: JSON.parse(JSON.stringify(activityLog))
  };

  return <AdminClient initialData={initialData} />;
}
