"use client";

import { Session } from "next-auth";
import { CreditCard, Calendar, Activity, FileText, User, MapPin, Clock, Tablets } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface PatientClientProps {
  session: Session | null;
  initialData: any;
}

export default function PatientClient({ session, initialData }: PatientClientProps) {
  const upcomingAppointments = initialData?.upcomingAppointments || [];
  const medicalRecords = initialData?.medicalRecords || [];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      
      {/* Top Welcome & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Bills</CardTitle>
            <CreditCard className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">${initialData?.pendingBills?.toFixed(2) || "0.00"}</div>
            <p className="text-xs text-muted-foreground mt-1">Visit the Billing section to settle dues.</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-emerald-200 bg-emerald-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800">Health Portal</CardTitle>
            <Activity className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-emerald-700 font-medium">Ready to schedule your next visit?</p>
            <Link href="/dashboard/patient/appointments/book" className="w-full">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-semibold">
                <Calendar className="mr-2 h-4 w-4" /> Book Appointment
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Appointments Section */}
        <Card className="shadow-sm border-slate-200 flex flex-col">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-500" /> 
                  Upcoming Appointments
                </CardTitle>
                <CardDescription>Your confirmed and pending medical sessions.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {upcomingAppointments.length === 0 ? (
              <div className="h-48 flex flex-col justify-center items-center text-slate-400">
                <Calendar className="h-10 w-10 mx-auto opacity-15 mb-2" />
                <p className="text-sm">No upcoming appointments scheduled.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {upcomingAppointments.map((appt: any) => (
                  <div key={appt._id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                          <User size={18} />
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900 leading-none">{appt.doctor.name}</p>
                          <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">
                            {appt.doctor.specialization}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-slate-500 text-xs">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(appt.appointmentDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-tight uppercase border ${
                        appt.status === "CONFIRMED" 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                        : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {appt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medical History Section */}
        <Card className="shadow-sm border-slate-200 flex flex-col">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-indigo-500" /> 
              Recent Medical Records
            </CardTitle>
            <CardDescription>View your prescriptions and test results.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {medicalRecords.length === 0 ? (
                <div className="h-48 flex flex-col justify-center items-center text-slate-400">
                  <FileText className="h-10 w-10 mx-auto opacity-15 mb-2" />
                  <p className="text-sm">No recent records available.</p>
                </div>
            ) : (
                <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                    {medicalRecords.map((record: any) => (
                        <div key={record._id} className="p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shrink-0">
                                    <Tablets size={20} />
                                </div>
                                <div className="space-y-1 w-full">
                                    <div className="flex justify-between items-start">
                                        <p className="font-bold text-slate-900">{record.medicineName}</p>
                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                                            {new Date(record.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <span className="font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">{record.dosage}</span>
                                        <span>•</span>
                                        <span>{record.duration}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 italic">
                                        "{record.instructions || "No special instructions."}"
                                    </p>
                                    <div className="pt-2 border-t border-slate-50 mt-2 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                                            <User size={10} className="text-slate-400" />
                                            Dr. {record.doctor.name}
                                        </div>
                                        <span className="text-[10px] text-indigo-400 font-bold">{record.doctor.specialization}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
