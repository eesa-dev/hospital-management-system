import { Types } from "mongoose";

export interface IAppointment {
  _id: Types.ObjectId;
  patientId: Types.ObjectId; // Ref User (Patient)
  doctorId: Types.ObjectId; // Ref User (Doctor)
  appointmentDate: Date;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: Date;
  updatedAt: Date;
}

export interface IPrescription {
  _id: Types.ObjectId;
  appointmentId?: Types.ObjectId; // Ref Appointment
  patientId: Types.ObjectId; // Ref User (Patient)
  doctorId: Types.ObjectId; // Ref User (Doctor)
  medicineName: string;
  dosage: string;
  duration: string;
  instructions: string;
  status: "PENDING" | "BILLED";
  createdAt: Date;
  updatedAt: Date;
}
