import { Types } from "mongoose";

export enum UserRole {
  ADMIN = "ADMIN",
  PATIENT = "PATIENT",
  DOCTOR = "DOCTOR",
  PHARMACY = "PHARMACY",
}

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password?: string;
  role: UserRole;
  profileRef?: Types.ObjectId; // Reference to Patient, Doctor, or Admin models
  createdAt: Date;
  updatedAt: Date;
}

export interface IPatient {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // Ref User
  name: string;
  phone: string;
  gender: string;
  dateOfBirth: Date;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDoctor {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // Ref User
  name: string;
  specialization: string;
  phone: string;
  experience: number;
  availability: string; // e.g., "Mon-Fri 9AM-5PM"
  createdAt: Date;
  updatedAt: Date;
}
