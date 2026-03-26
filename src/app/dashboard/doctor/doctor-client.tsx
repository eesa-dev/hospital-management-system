"use client";

import { useTransition, useState } from "react";
import { Session } from "next-auth";
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  MoreVertical,
  Tablets,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateAppointmentStatusAction } from "@/actions/Appointment/index";
import { createPrescriptionAction } from "@/actions/Prescription/index";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const prescriptionSchema = z.object({
  medicineName: z.string().min(1, "Medicine name is required"),
  dosage: z.string().min(1, "Dosage is required (e.g. 1-0-1)"),
  duration: z.string().min(1, "Duration is required (e.g. 5 days)"),
  instructions: z.string().optional(),
});

interface DoctorClientProps {
  session: Session | null;
  initialAppointments: any[];
}

export default function DoctorClient({
  session,
  initialAppointments,
}: DoctorClientProps) {
  const [isPending, startTransition] = useTransition();
  const [prescribingAppt, setPrescribingAppt] = useState<any>(null);

  const form = useForm<z.infer<typeof prescriptionSchema>>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      medicineName: "",
      dosage: "",
      duration: "",
      instructions: "",
    },
  });

  const handleStatusUpdate = (
    id: string,
    status: "CONFIRMED" | "CANCELLED" | "COMPLETED",
  ) => {
    startTransition(async () => {
      const result = await updateAppointmentStatusAction(id, status);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message);
      }
    });
  };

  const onPrescriptionSubmit = (values: z.infer<typeof prescriptionSchema>) => {
    if (!prescribingAppt) return;

    startTransition(async () => {
      const result = await createPrescriptionAction({
        appointmentId: prescribingAppt._id,
        patientId: prescribingAppt.patientId?._id,
        ...values,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message);
        setPrescribingAppt(null);
        form.reset();
        // Also mark as completed if it wasn't already
        if (prescribingAppt.status !== "COMPLETED") {
          await updateAppointmentStatusAction(prescribingAppt._id, "COMPLETED");
        }
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">Confirmed</span>;
      case "CANCELLED":
        return <span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">Cancelled</span>;
      case "COMPLETED":
        return <span className="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">Completed</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">Pending</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 text-left">Consultation Schedule</h2>
          <p className="text-slate-500 text-left mt-1">Review and manage your upcoming patient appointments.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Next 7 Days</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Requests</CardTitle>
                <CardDescription>Appointments requiring your immediate attention.</CardDescription>
              </div>
              <Clock className="h-5 w-5 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[200px]">Patient</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-48 text-center text-slate-400">
                      <Clock className="mx-auto h-10 w-10 mb-2 opacity-15" />
                      <p>No appointments scheduled for this period.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  initialAppointments.map((appt) => (
                    <TableRow key={appt._id} className="group transition-colors hover:bg-slate-50/80">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                            {appt.patientId?.name?.[0] || <User size={14} />}
                          </div>
                          <span className="font-medium text-slate-800">{appt.patientId?.name || "Anonymous Patient"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium font-mono text-xs">
                        {new Date(appt.appointmentDate).toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(appt.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem 
                              className="text-emerald-600 cursor-pointer"
                              onClick={() => handleStatusUpdate(appt._id, "CONFIRMED")}
                              disabled={isPending}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" /> Confirm
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-blue-600 cursor-pointer"
                              onClick={() => setPrescribingAppt(appt)}
                              disabled={isPending}
                            >
                              <Tablets className="mr-2 h-4 w-4" /> Prescribe
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600 cursor-pointer"
                              onClick={() => handleStatusUpdate(appt._id, "CANCELLED")}
                              disabled={isPending}
                            >
                              <XCircle className="mr-2 h-4 w-4" /> Cancel
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => handleStatusUpdate(appt._id, "COMPLETED")}
                              disabled={isPending}
                            >
                              <div className="h-4 w-4 mr-2 border-2 border-slate-400 rounded-full" /> Mark Completed
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* @ts-ignore */}
      <Dialog open={!!prescribingAppt} onOpenChange={(open: boolean) => !open && setPrescribingAppt(null)}>
        {/* @ts-ignore */}
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={form.handleSubmit(onPrescriptionSubmit)}>
            <DialogHeader>
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <FileText size={20} />
                <DialogTitle>Issue Prescription</DialogTitle>
              </div>
              <DialogDescription>
                Issuing for <span className="font-semibold text-slate-900">{prescribingAppt?.patientId?.name}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <Field>
                <FieldLabel>Medicine Name</FieldLabel>
                <Input {...form.register("medicineName")} placeholder="e.g. Amoxicillin 500mg" />
                {form.formState.errors.medicineName && <FieldError>{form.formState.errors.medicineName.message}</FieldError>}
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Dosage</FieldLabel>
                  <Input {...form.register("dosage")} placeholder="e.g. 1-0-1" />
                  {form.formState.errors.dosage && <FieldError>{form.formState.errors.dosage.message}</FieldError>}
                </Field>
                <Field>
                  <FieldLabel>Duration</FieldLabel>
                  <Input {...form.register("duration")} placeholder="e.g. 7 days" />
                  {form.formState.errors.duration && <FieldError>{form.formState.errors.duration.message}</FieldError>}
                </Field>
              </div>
              <Field>
                <FieldLabel>Additional Instructions</FieldLabel>
                <Input {...form.register("instructions")} placeholder="e.g. Take after meals" />
              </Field>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700">
                {isPending ? "Issuing..." : "Confirm & Complete Consultation"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
