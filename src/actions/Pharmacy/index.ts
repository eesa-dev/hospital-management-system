"use server";

import connectDB from "../../lib/db";
import { Pharmacy } from "../../models/Pharmacy";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";

export async function getInventoryAction() {
  try {
    await connectDB();
    const items = await Pharmacy.find().sort({ medicineName: 1 });
    return JSON.parse(JSON.stringify(items));
  } catch (error) {
    console.error("Action Error [getInventoryAction]:", error);
    return { error: "Failed to fetch inventory" };
  }
}

export async function addMedicineAction(data: { medicineName: string; quantity: number; price: number }) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (role !== "PHARMACIST" && role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    await connectDB();
    await Pharmacy.create(data);
    revalidatePath("/dashboard/pharmacy");
    return { success: true, message: "Medicine added to inventory" };
  } catch (error) {
    console.error("Action Error [addMedicineAction]:", error);
    return { error: "Failed to add medicine" };
  }
}

export async function updateStockAction(id: string, increment: number) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (role !== "PHARMACIST" && role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    await connectDB();
    const item = await Pharmacy.findByIdAndUpdate(id, { $inc: { quantity: increment } }, { new: true });
    if (!item) return { error: "Medicine not found" };
    
    revalidatePath("/dashboard/pharmacy");
    return { success: true, message: `Stock updated. Current: ${item.quantity}` };
  } catch (error) {
    console.error("Action Error [updateStockAction]:", error);
    return { error: "Failed to update stock" };
  }
}
