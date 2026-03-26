"use client";

import {
  CreditCard,
  Calendar,
  FileText,
  User,
  Clock,
  Tablets,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Appointment {
  _id: string;
  doctor: {
    name: string;
    specialization: string;
  };
  appointmentDate: string | Date;
  status: string;
}

interface MedicalRecord {
  _id: string;
  medicineName: string;
  dosage: string;
  duration: string;
  instructions?: string;
  createdAt: string | Date;
  doctor: {
    name: string;
    specialization: string;
  };
}

interface PatientData {
  pendingBills: number;
  upcomingAppointments: Appointment[];
  medicalRecords: MedicalRecord[];
}

interface PatientClientProps {
  initialData: PatientData;
}

export default function PatientClient({
  initialData,
}: PatientClientProps) {
  const upcomingAppointments = initialData?.upcomingAppointments || [];
  const medicalRecords = initialData?.medicalRecords || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Featured Card — Pending Bills */}
        <div className="bg-primary rounded-2xl p-5 flex flex-col justify-between min-h-[148px] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="flex justify-between items-start relative">
            <span className="text-sm font-medium text-primary-foreground/80">
              Pending Bills
            </span>
            <div className="h-7 w-7 rounded-full border border-primary-foreground/30 flex items-center justify-center shrink-0">
              <CreditCard className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
          </div>
          <div className="relative">
            <div className="text-4xl font-bold text-primary-foreground font-mono leading-none">
              ${initialData?.pendingBills?.toFixed(2) || "0.00"}
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-primary-foreground/15 rounded-lg px-2.5 py-1 text-xs font-medium text-primary-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/60 inline-block" />
              Visit Billing to settle dues
            </div>
          </div>
        </div>

        {/* Book Appointment Card */}
        <div className="bg-card rounded-2xl border border-border p-5 flex flex-col justify-between min-h-[148px] hover:shadow-sm transition-shadow duration-200">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-muted-foreground">
              Health Portal
            </span>
            <div className="h-7 w-7 rounded-full border border-border flex items-center justify-center shrink-0">
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Ready to schedule your next visit?
            </p>
            <Link
              href="/dashboard/patient/appointments/book"
              className="w-full block"
            >
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-9">
                <Calendar className="mr-2 h-4 w-4" /> Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Appointments Section */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden flex flex-col">
          <CardHeader className="bg-muted/50 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Upcoming Appointments
                </CardTitle>
                <CardDescription>
                  Your confirmed and pending medical sessions.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {upcomingAppointments.length === 0 ? (
              <div className="h-48 flex flex-col justify-center items-center text-muted-foreground">
                <Calendar className="h-10 w-10 mx-auto opacity-15 mb-2" />
                <p className="text-sm">No upcoming appointments scheduled.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {upcomingAppointments.map((appt) => (
                  <div
                    key={appt._id}
                    className="p-4 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="h-9 w-9 rounded-lg bg-primary/8 flex items-center justify-center text-primary border border-primary/15 shrink-0">
                          <User size={16} />
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground leading-none">
                            {appt.doctor.name}
                          </p>
                          <p className="text-xs text-primary font-medium uppercase tracking-wider">
                            {appt.doctor.specialization}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-muted-foreground text-xs">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(
                                appt.appointmentDate,
                              ).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {new Date(
                                appt.appointmentDate,
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          appt.status === "CONFIRMED"
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full inline-block ${
                            appt.status === "CONFIRMED"
                              ? "bg-success"
                              : "bg-warning"
                          }`}
                        />
                        {appt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </div>

        {/* Medical History Section */}
        <Card className="shadow-sm flex flex-col">
          <CardHeader className="bg-muted/50 border-b border-border">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
              Recent Medical Records
            </CardTitle>
            <CardDescription>
              View your prescriptions and test results.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {medicalRecords.length === 0 ? (
              <div className="h-48 flex flex-col justify-center items-center text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto opacity-15 mb-2" />
                <p className="text-sm">No recent records available.</p>
              </div>
            ) : (
              <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
                {medicalRecords.map((record) => (
                  <div
                    key={record._id}
                    className="p-4 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground border border-border shrink-0">
                        <Tablets size={18} />
                      </div>
                      <div className="space-y-1 w-full">
                        <div className="flex justify-between items-start">
                          <p className="font-semibold text-foreground">
                            {record.medicineName}
                          </p>
                          <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-widest font-mono">
                            {new Date(record.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-semibold text-primary bg-primary/8 px-1.5 py-0.5 rounded uppercase font-mono">
                            {record.dosage}
                          </span>
                          <span>•</span>
                          <span>{record.duration}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 italic">
                          &quot;{record.instructions || "No special instructions."}&quot;
                        </p>
                        <div className="pt-2 border-t border-border mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                            <User size={10} />
                            Dr. {record.doctor.name}
                          </div>
                          <span className="text-[10px] text-muted-foreground font-semibold font-mono">
                            {record.doctor.specialization}
                          </span>
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
