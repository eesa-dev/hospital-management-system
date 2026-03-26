import mongoose, { Schema, Document } from "mongoose";
import { IPharmacyItem } from "../types/pharmacy.types";

const PharmacySchema = new Schema(
  {
    medicineName: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Pharmacy =
  mongoose.models.Pharmacy ||
  mongoose.model<IPharmacyItem & Document>("Pharmacy", PharmacySchema);
