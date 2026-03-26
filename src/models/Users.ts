import mongoose, { Schema, Document } from "mongoose";
import { IUser, UserRole } from "../types/user.types";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    plainPasswordEncrypted: { type: String }, // For copy-to-clipboard functionality
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    profileRef: {
      type: Schema.Types.ObjectId,
      refPath: "profileModel",
    },
    profileModel: {
      type: String,
      enum: ["Patients", "Doctors", "StaffProfiles"],
    },
  },
  { timestamps: true }
);

export const Users =
  mongoose.models.Users || mongoose.model<IUser & Document>("Users", UserSchema);
