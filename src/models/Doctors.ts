import mongoose, { Schema, Document } from "mongoose";
import { IDoctor } from "../types/user.types";

const DoctorSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true, unique: true },
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    phone: { type: String, required: true },
    experience: { type: String, required: true }, // Changed from Number to String
    availability: { type: String, default: "Mon-Fri 9AM-5PM" },
  },
  { timestamps: true }
);

export const Doctors =
  mongoose.models.Doctors ||
  mongoose.model<IDoctor & Document>("Doctors", DoctorSchema);
