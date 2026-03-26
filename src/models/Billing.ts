import mongoose, { Schema, Document } from "mongoose";
import { IBilling } from "../types/billing.types";

const BillingSchema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointments" },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "OVERDUE"],
      default: "PENDING",
    },
    paymentMethod: {
      type: String,
      enum: ["CASH", "CARD", "INSURANCE"],
    },
    billDate: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

export const Billing =
  mongoose.models.Billing ||
  mongoose.model<IBilling & Document>("Billing", BillingSchema);
