import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserRole } from "@/types/user.types";
import FinanceClient from "./finance-client";
import connectDB from "@/lib/db";
import { Billing } from "@/models/Billing";

export default async function AdminFinancesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/login");
  }

  await connectDB();

  // 1. Calculate Metrics
  const [revenueData, pendingData, totalTransactions] = await Promise.all([
    Billing.aggregate([
      { $match: { paymentStatus: "PAID" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]),
    Billing.aggregate([
      { $match: { paymentStatus: "PENDING" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]),
    Billing.countDocuments()
  ]);

  const totalRevenue = revenueData[0]?.total || 0;
  const pendingBalance = pendingData[0]?.total || 0;

  // 2. Fetch Weekly Growth Data (Last 7 Days)
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const weeklyGrowth = await Billing.aggregate([
    { 
      $match: { 
        createdAt: { $gte: last7Days },
        paymentStatus: "PAID"
      } 
    },
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        dayTotal: { $sum: "$totalAmount" }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  // Map 1-7 (Sun-Sat) to the chart array indices
  const chartData = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun (or Sun-Sat, we'll map carefully)
  // MongoDB $dayOfWeek: 1 (Sun), 2 (Mon), ..., 7 (Sat)
  // Chart expecting Mon (0), Tue (1), ..., Sun (6)
  weeklyGrowth.forEach(item => {
    const dayIndex = item._id === 1 ? 6 : item._id - 2; // Map Sun(1)->6, Mon(2)->0, etc.
    if (dayIndex >= 0 && dayIndex < 7) {
      chartData[dayIndex] = item.dayTotal;
    }
  });

  // 3. Fetch Recent Transactions with Patient Names
  const recentTransactions = await Billing.aggregate([
    { $sort: { createdAt: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "patients",
        localField: "patientId",
        foreignField: "userId",
        as: "patientInfo"
      }
    },
    {
      $project: {
        _id: { $toString: "$_id" },
        totalAmount: 1,
        paymentStatus: 1,
        paymentMethod: 1,
        createdAt: 1,
        patientName: { $ifNull: [{ $arrayElemAt: ["$patientInfo.name", 0] }, "Walk-in/Pharmacy"] }
      }
    }
  ]);

  const initialData = {
    totalRevenue,
    pendingBalance,
    totalTransactions,
    chartData,
    recentTransactions: JSON.parse(JSON.stringify(recentTransactions))
  };

  return <FinanceClient initialData={initialData} />;
}
