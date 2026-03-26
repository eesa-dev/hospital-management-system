import mongoose, { Schema, Document } from "mongoose";
import { IUser, UserRole } from "../types/user.types";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false }, // Don't return password by default
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    profileRef: {
      type: Schema.Types.ObjectId,
      refPath: "profileModel", // Dynamic reference based on role (optional architecture, or we just rely on querying the specific collection with userId)
    },
    profileModel: {
      type: String,
      enum: ["Patients", "Doctors"],
    },
  },
  { timestamps: true }
);

export const Users =
  mongoose.models.Users || mongoose.model<IUser & Document>("Users", UserSchema);
