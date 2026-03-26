import mongoose, { Schema, Document } from "mongoose";

const StaffProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    specialization: { type: String }, // e.g. "Pharmacy Management"
    experience: { type: String },
  },
  { timestamps: true }
);

export const StaffProfiles =
  mongoose.models.StaffProfiles ||
  mongoose.model<Document>("StaffProfiles", StaffProfileSchema);
