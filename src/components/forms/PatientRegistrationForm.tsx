"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { patientRegistrationSchema } from "../../schemas/user.schema";
import { registerPatientAction } from "../../actions/User/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PatientRegistrationForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof patientRegistrationSchema>>({
    resolver: zodResolver(patientRegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      gender: "MALE",
      dateOfBirth: "",
      address: "",
    },
  });

  const genderValue = form.watch("gender");

  const onSubmit = (values: z.infer<typeof patientRegistrationSchema>) => {
    startTransition(async () => {
      const result = await registerPatientAction(values);
      
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.message);
        router.push("/login");
      }
    });
  };

  return (
    <Card className="w-full border-slate-200 shadow-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-blue-600">Patient Registration</CardTitle>
        <CardDescription>
          Enter your details securely to create your digital medical records account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            
            <Field>
              <FieldLabel>Full Name</FieldLabel>
              <Input placeholder="John Doe" disabled={isPending} {...form.register("name")} />
              {form.formState.errors.name && <FieldError>{form.formState.errors.name.message}</FieldError>}
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel>Email Address</FieldLabel>
                <Input type="email" placeholder="john@example.com" disabled={isPending} {...form.register("email")} />
                {form.formState.errors.email && <FieldError>{form.formState.errors.email.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input type="password" placeholder="••••••••" disabled={isPending} {...form.register("password")} />
                {form.formState.errors.password && <FieldError>{form.formState.errors.password.message}</FieldError>}
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel>Phone Number</FieldLabel>
                <Input type="tel" placeholder="+1234567890" disabled={isPending} {...form.register("phone")} />
                {form.formState.errors.phone && <FieldError>{form.formState.errors.phone.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel>Date of Birth</FieldLabel>
                <Input type="date" disabled={isPending} {...form.register("dateOfBirth")} />
                {form.formState.errors.dateOfBirth && <FieldError>{form.formState.errors.dateOfBirth.message}</FieldError>}
              </Field>
            </div>

            <Field>
              <FieldLabel>Gender</FieldLabel>
              <Select 
                disabled={isPending} 
                onValueChange={(val) => form.setValue("gender", val as any)} 
                value={genderValue}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.gender && <FieldError>{form.formState.errors.gender.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Home Address</FieldLabel>
              <Input placeholder="123 Main St, City, Country" disabled={isPending} {...form.register("address")} />
              {form.formState.errors.address && <FieldError>{form.formState.errors.address.message}</FieldError>}
            </Field>

          </FieldGroup>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isPending}>
            {isPending ? "Registering account securely..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
