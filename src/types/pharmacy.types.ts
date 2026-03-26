import { Types } from "mongoose";

export interface IPharmacyItem {
  _id: Types.ObjectId;
  medicineName: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
