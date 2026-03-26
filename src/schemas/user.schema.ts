import { z } from "zod";

export const patientRegistrationSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phone: z.string(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  dateOfBirth: z.string(),
  address: z.string(),
});

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const staffCreationSchema = z.object({
  name: z.string(),
  email: z.string(),
  role: z.enum(["DOCTOR", "PHARMACY", "ADMIN"]),
  phone: z.string(),
  specialization: z.string(),
  experience: z.number(),
});
