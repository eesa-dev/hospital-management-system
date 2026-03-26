import { Types } from "mongoose";

export interface IBilling {
  _id: Types.ObjectId;
  patientId: Types.ObjectId; // Ref User (Patient)
  appointmentId?: Types.ObjectId; // Ref Appointment (Optional, might be just pharmacy)
  totalAmount: number;
  paymentStatus: "PENDING" | "PAID" | "OVERDUE";
  paymentMethod?: "CASH" | "CARD" | "INSURANCE";
  billDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
