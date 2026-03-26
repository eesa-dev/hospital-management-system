import { auth } from "../../../../auth";
import StaffPageClient from "./staff-client";
import connectDB from "../../../../lib/db";
import { Users } from "../../../../models/Users";
import { UserRole } from "../../../../types/user.types";
import { redirect } from "next/navigation";

export default async function AdminStaffPage() {
  const session = await auth();

  if ((session?.user as any)?.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  await connectDB();

  // Fetch all staff members (excluding Patients)
  // In a real app we'd join with profiles, but for the list we'll just show the User records
  const staff = await Users.find({ 
    role: { $in: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.PHARMACY] } 
  }).sort({ createdAt: -1 });

  return <StaffPageClient initialStaff={JSON.parse(JSON.stringify(staff))} />;
}
