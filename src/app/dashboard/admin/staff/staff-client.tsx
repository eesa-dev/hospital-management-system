"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { staffCreationSchema } from "@/schemas/user.schema";
import { createStaffAction } from "@/actions/Admin/index";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Users } from "lucide-react";

interface StaffPageClientProps {
  initialStaff: any[];
}

export default function StaffPageClient({ initialStaff }: StaffPageClientProps) {
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);

  const form = useForm<z.infer<typeof staffCreationSchema>>({
    resolver: zodResolver(staffCreationSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "DOCTOR",
      phone: "",
      specialization: "",
      experience: 0,
    },
  });

  const roleValue = form.watch("role");

  const onSubmit = (values: z.infer<typeof staffCreationSchema>) => {
    startTransition(async () => {
      const result = await createStaffAction(values);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message);
        setShowForm(false);
        form.reset();
        // In a real app, we'd use router.refresh() here
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Staff Management</h2>
          <p className="text-slate-500">Manage and onboard doctors, pharmacists, and admins.</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)} 
          className={showForm ? "bg-slate-200 text-slate-800 hover:bg-slate-300" : "bg-blue-600 hover:bg-blue-700"}
        >
          {showForm ? "View Staff List" : <><Plus className="mr-2 h-4 w-4" /> Add New Staff</>}
        </Button>
      </div>

      {showForm ? (
        <Card className="max-w-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Register New Staff Member</CardTitle>
            <CardDescription>Enter details to create a secure personnel account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FieldGroup>
                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input placeholder="Dr. Alice Smith" {...form.register("name")} disabled={isPending} />
                  {form.formState.errors.name && <FieldError>{form.formState.errors.name.message}</FieldError>}
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Email Address</FieldLabel>
                    <Input type="email" placeholder="alice@hms.com" {...form.register("email")} disabled={isPending} />
                    {form.formState.errors.email && <FieldError>{form.formState.errors.email.message}</FieldError>}
                  </Field>
                  <Field>
                    <FieldLabel>Phone Number</FieldLabel>
                    <Input placeholder="+1234567890" {...form.register("phone")} disabled={isPending} />
                    {form.formState.errors.phone && <FieldError>{form.formState.errors.phone.message}</FieldError>}
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Role</FieldLabel>
                    <Select 
                      onValueChange={(val) => form.setValue("role", val as any)} 
                      value={roleValue}
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DOCTOR">Doctor</SelectItem>
                        <SelectItem value="PHARMACY">Pharmacist</SelectItem>
                        <SelectItem value="ADMIN">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.role && <FieldError>{form.formState.errors.role.message}</FieldError>}
                  </Field>
                  <Field>
                    <FieldLabel>Experience (Years)</FieldLabel>
                    <Input type="number" {...form.register("experience", { valueAsNumber: true })} disabled={isPending} />
                    {form.formState.errors.experience && <FieldError>{form.formState.errors.experience.message}</FieldError>}
                  </Field>
                </div>

                <Field>
                  <FieldLabel>Specialization / Department</FieldLabel>
                  <Input placeholder="Cardiology / Pharmacy Operations" {...form.register("specialization")} disabled={isPending} />
                  {form.formState.errors.specialization && <FieldError>{form.formState.errors.specialization.message}</FieldError>}
                </Field>
              </FieldGroup>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-medium" disabled={isPending}>
                {isPending ? "Onboarding Staff..." : "Create Account & Notify"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialStaff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-slate-400">
                      <Users className="mx-auto h-8 w-8 mb-2 opacity-20" />
                      No staff members found.
                    </TableCell>
                  </TableRow>
                ) : (
                  initialStaff.map((member) => (
                    <TableRow key={member._id}>
                      <TableCell className="font-semibold">{member.name || "N/A"}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                          {member.role}
                        </span>
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.specialization || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
