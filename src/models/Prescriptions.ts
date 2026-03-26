import mongoose, { Schema, Document } from "mongoose";
import { IPrescription } from "../types/appointment.types";

const PrescriptionSchema = new Schema(
  {
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointments" },
    patientId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    medicineName: { type: String, required: true },
    dosage: { type: String, required: true },
    duration: { type: String, required: true },
    instructions: { type: String, required: false },
  },
  { timestamps: true }
);

export const Prescriptions =
  mongoose.models.Prescriptions ||
  mongoose.model<IPrescription & Document>("Prescriptions", PrescriptionSchema);
