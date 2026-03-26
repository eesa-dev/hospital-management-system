import mongoose, { Schema, Document } from "mongoose";
import { IAppointment } from "../types/appointment.types";

const AppointmentSchema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    appointmentDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const Appointments =
  mongoose.models.Appointments ||
  mongoose.model<IAppointment & Document>("Appointments", AppointmentSchema);
