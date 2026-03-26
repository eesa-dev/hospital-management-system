"use server";

import connectDB from "../../lib/db";
import { Users } from "../../models/Users";
import { Patients } from "../../models/Patients";
import { patientRegistrationSchema } from "../../schemas/user.schema";
import bcryptjs from "bcryptjs";
import { UserRole } from "../../types/user.types";

export async function registerPatientAction(data: unknown) {
  try {
    await connectDB();

    // 1. Zod Validation
    const parsedResult = patientRegistrationSchema.safeParse(data);
    if (!parsedResult.success) {
      return { 
        error: "Validation failed", 
        fields: parsedResult.error.flatten().fieldErrors 
      };
    }

    const validData = parsedResult.data;

    // 2. Check for existing user
    const existingUser = await Users.findOne({ email: validData.email });
    if (existingUser) {
      return { error: "An account with this email already exists." };
    }

    // 3. Hash Password
    const hashedPassword = await bcryptjs.hash(validData.password, 10);

    // 4. Create User Document
    const newUser = await Users.create({
      email: validData.email,
      password: hashedPassword,
      role: UserRole.PATIENT,
      profileModel: "Patients",
    });

    // 5. Create Patient Profile
    const newPatient = await Patients.create({
      userId: newUser._id,
      name: validData.name,
      phone: validData.phone,
      gender: validData.gender,
      dateOfBirth: new Date(validData.dateOfBirth),
      address: validData.address,
    });

    // 6. Two-way reference (Optional but good practice based on our schema)
    newUser.profileRef = newPatient._id;
    await newUser.save();

    return { success: true, message: "Registration successful. Please log in." };
  } catch (error) {
    console.error("Action Error [registerPatientAction]:", error instanceof Error ? error.message : error);
    return { error: "An internal server error occurred." };
  }
}
