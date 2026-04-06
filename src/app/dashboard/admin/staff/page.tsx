import { auth } from "../../../../auth";
import StaffPageClient from "./staff-client";
import connectDB from "../../../../lib/db";
import { Users } from "../../../../models/Users";
import { UserRole } from "../../../../types/user.types";
import { redirect } from "next/navigation";
import { decryptPassword } from "../../../../lib/encryption";

interface RawStaff {
  _id: string;
  email: string;
  role: string;
  plainPasswordEncrypted?: string;
  name: string;
  phone: string;
  specialization: string;
  experience: string;
}

export default async function AdminStaffPage() {
  const session = await auth();

  if (session?.user?.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  await connectDB();

  // Fetch all staff members using aggregation to join with profiles
  const staff = await Users.aggregate([
    { 
      $match: { 
        role: { $in: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.PHARMACY] } 
      } 
    },
    {
      $lookup: {
        from: "doctors",
        localField: "_id",
        foreignField: "userId",
        as: "doctorProfile"
      }
    },
    {
      $lookup: {
        from: "staffprofiles",
        localField: "_id",
        foreignField: "userId",
        as: "otherProfile"
      }
    },
    {
      $project: {
        _id: { $toString: "$_id" },
        email: 1,
        role: 1,
        plainPasswordEncrypted: 1,
        name: { 
          $ifNull: [
            { $arrayElemAt: ["$doctorProfile.name", 0] }, 
            { $arrayElemAt: ["$otherProfile.name", 0] },
            "N/A"
          ] 
        },
        phone: { 
          $ifNull: [
            { $arrayElemAt: ["$doctorProfile.phone", 0] }, 
            { $arrayElemAt: ["$otherProfile.phone", 0] },
            "N/A"
          ] 
        },
        specialization: { 
          $ifNull: [
            { $arrayElemAt: ["$doctorProfile.specialization", 0] }, 
            { $arrayElemAt: ["$otherProfile.specialization", 0] },
            "N/A"
          ] 
        },
        experience: { 
          $ifNull: [
            { $arrayElemAt: ["$doctorProfile.experience", 0] }, 
            { $arrayElemAt: ["$otherProfile.experience", 0] },
            "N/A"
          ] 
        },
      }
    },
    { $sort: { createdAt: -1 } }
  ]) as RawStaff[];

  // Decrypt passwords for the client list
  const staffWithDecryptedPass = staff.map((s) => ({
    ...s,
    decryptedPassword: s.plainPasswordEncrypted ? decryptPassword(s.plainPasswordEncrypted) : "N/A"
  }));

  return <StaffPageClient initialStaff={JSON.parse(JSON.stringify(staffWithDecryptedPass))} />;
}
