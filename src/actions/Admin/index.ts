"use server";

import connectDB from "../../lib/db";
import { Users } from "../../models/Users";
import { Doctors } from "../../models/Doctors";
import { staffCreationSchema } from "../../schemas/user.schema";
import bcryptjs from "bcryptjs";
import { auth } from "../../auth";
import { UserRole } from "../../types/user.types";

export async function createStaffAction(data: unknown) {
  try {
    const session = await auth();
    // Only ADMIN can create staff
    if ((session?.user as any)?.role !== UserRole.ADMIN) {
      return { error: "Unauthorized. Only admins can create staff members." };
    }

    await connectDB();

    // 1. Zod Validation
    const parsedResult = staffCreationSchema.safeParse(data);
    if (!parsedResult.success) {
      return { 
        error: "Validation failed", 
        fields: parsedResult.error.flatten().fieldErrors 
      };
    }

    const { name, email, role, phone, specialization, experience } = parsedResult.data;

    // 2. Check for existing user
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return { error: "An account with this email already exists." };
    }

    // 3. Default Password for new staff (should be changed on first login)
    const defaultPassword = "HmsStaffPassword123!";
    const hashedPassword = await bcryptjs.hash(defaultPassword, 10);

    // 4. Create User Document
    const newUser = await Users.create({
      email,
      password: hashedPassword,
      role: role as UserRole,
      profileModel: role === "DOCTOR" ? "Doctors" : undefined,
    });

    // 5. Create Profile if DOCTOR
    if (role === "DOCTOR") {
      const newDoctor = await Doctors.create({
        userId: newUser._id,
        name,
        specialization,
        phone,
        experience,
      });
      newUser.profileRef = newDoctor._id;
      await newUser.save();
    }

    return { 
      success: true, 
      message: `${role} account created successfully. Temporary password: ${defaultPassword}` 
    };
  } catch (error: any) {
    console.error("Action Error [createStaffAction]:", error);
    return { error: "An internal server error occurred." };
  }
}
