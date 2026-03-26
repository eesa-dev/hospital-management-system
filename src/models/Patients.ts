import mongoose, { Schema, Document } from "mongoose";
import { IPatient } from "../types/user.types";

const PatientSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

export const Patients =
  mongoose.models.Patients ||
  mongoose.model<IPatient & Document>("Patients", PatientSchema);
