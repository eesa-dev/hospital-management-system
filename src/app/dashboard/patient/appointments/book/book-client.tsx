"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { appointmentSchema } from "@/schemas/appointment.schema";
import { createAppointmentAction } from "@/actions/Appointment/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CalendarDays, User } from "lucide-react";

interface BookAppointmentClientProps {
  doctors: { _id: string; name: string; specialization: string }[];
}

export default function BookAppointmentClient({ doctors }: BookAppointmentClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      doctorId: "",
      appointmentDate: "",
    },
  });

  const onSubmit = (values: z.infer<typeof appointmentSchema>) => {
    startTransition(async () => {
      const result = await createAppointmentAction(values);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message || "Appointment requested successfully");
        router.push("/dashboard/patient");
        router.refresh();
      }
    });
  };

  const handleDoctorChange = (value: string | null) => {
    if (value) {
      form.setValue("doctorId" as any, value);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="h-2 bg-blue-600 w-full" />
        <CardHeader className="pt-6">
          <CardTitle className="text-2xl flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-blue-600" />
            Book a Consultation
          </CardTitle>
          <CardDescription>
            Select a specialist and your preferred date to request an appointment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-500" />
                  Select Specialist
                </FieldLabel>
                <Select 
                  onValueChange={handleDoctorChange} 
                  disabled={isPending}
                >
                  <SelectTrigger className="h-12 border-slate-200 hover:border-blue-400 transition-colors">
                    <SelectValue placeholder="Begin by choosing a physician..." />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor._id} value={doctor._id}>
                        <div className="flex flex-col text-left">
                          <span className="font-medium">{doctor.name}</span>
                          <span className="text-xs text-slate-500">{doctor.specialization}</span>
                        </div>
                      </SelectItem>
                    ))}
                    {doctors.length === 0 && (
                      <div className="p-4 text-center text-sm text-slate-500">
                        No doctors available at this time.
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {form.formState.errors.doctorId && (
                  <FieldError>{form.formState.errors.doctorId.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-slate-500" />
                  Preferred Appointment Date
                </FieldLabel>
                <Input 
                  type="datetime-local" 
                  className="h-12 border-slate-200 focus-visible:ring-blue-500"
                  {...form.register("appointmentDate")} 
                  disabled={isPending} 
                />
                <CardDescription className="text-xs mt-1 italic">
                  Note: All consultations are subject to approval by the medical staff.
                </CardDescription>
                {form.formState.errors.appointmentDate && (
                  <FieldError>{form.formState.errors.appointmentDate.message}</FieldError>
                )}
              </Field>

            </FieldGroup>

            <div className="flex gap-4 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 h-12 border-slate-200"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 sm:flex-[2] h-12 bg-blue-600 hover:bg-blue-700 font-semibold shadow-lg shadow-blue-200"
                disabled={isPending}
              >
                {isPending ? "Confirming Request..." : "Request Appointment"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
