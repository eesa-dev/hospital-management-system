"use server";

import connectDB from "../../lib/db";
import { Users } from "../../models/Users";
import { Doctors } from "../../models/Doctors";
import { StaffProfiles } from "../../models/StaffProfiles";
import { staffCreationSchema } from "../../schemas/user.schema";
import bcryptjs from "bcryptjs";
import { auth } from "../../auth";
import { UserRole } from "../../types/user.types";
import { encryptPassword } from "../../lib/encryption";
import { revalidatePath } from "next/cache";

export async function createStaffAction(data: unknown) {
  try {
    const session = await auth();
    if (session?.user?.role !== UserRole.ADMIN) {
      return { error: "Unauthorized. Only admins can create staff members." };
    }

    await connectDB();

    const parsedResult = staffCreationSchema.safeParse(data);
    if (!parsedResult.success) {
      return { 
        error: "Validation failed", 
        fields: parsedResult.error.flatten().fieldErrors 
      };
    }

    const { name, email, password, role, phone, specialization, experience } = parsedResult.data;

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return { error: "An account with this email already exists." };
    }

    // Hash for security, encrypt for retrieval
    const hashedPassword = await bcryptjs.hash(password, 10);
    const encryptedPassword = encryptPassword(password);

    const newUser = await Users.create({
      email,
      password: hashedPassword,
      plainPasswordEncrypted: encryptedPassword,
      role: role as UserRole,
      profileModel: role === "DOCTOR" ? "Doctors" : "StaffProfiles",
    });

    if (role === "DOCTOR") {
      const newDoctor = await Doctors.create({
        userId: newUser._id,
        name,
        specialization,
        phone,
        experience,
      });
      newUser.profileRef = newDoctor._id;
    } else {
      const newStaff = await StaffProfiles.create({
        userId: newUser._id,
        name,
        phone,
        specialization,
        experience,
      });
      newUser.profileRef = newStaff._id;
    }
    
    await newUser.save();

    revalidatePath("/dashboard/admin/staff");
    return { 
      success: true, 
      message: `${role} account created successfully.` 
    };
  } catch (error) {
    console.error("Action Error [createStaffAction]:", error instanceof Error ? error.message : error);
    return { error: "An internal server error occurred." };
  }
}
