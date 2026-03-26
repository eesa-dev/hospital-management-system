"use client";

interface PharmacyData {
  lowStockItems: number;
  pendingPrescriptions: number;
}

interface PharmacyClientProps {
  initialData: PharmacyData;
}

export default function PharmacyClient({ initialData }: PharmacyClientProps) {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 font-medium">Low Stock Alerts</h3>
          <p className="text-4xl font-bold text-amber-500 mt-2">{initialData.lowStockItems}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 font-medium">Pending Prescriptions</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">{initialData.pendingPrescriptions}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[300px]">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Inventory Overview</h2>
        <div className="flex h-full items-center justify-center text-slate-400">
          <p>Select an item to view details.</p>
        </div>
      </div>
    </div>
  );
}
