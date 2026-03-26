/* Modified by @design-enhancer — Layer 4: Clinical White — PatientRegistrationForm Visual Design */
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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <div className="space-y-6">
      {/* Header above card — matches login page pattern */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary mb-3">
          <span className="text-lg font-bold text-primary-foreground">H</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your details securely to register as a patient
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FieldGroup>

              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Input
                  placeholder="John Doe"
                  disabled={isPending}
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <FieldError>{form.formState.errors.name.message}</FieldError>
                )}
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    disabled={isPending}
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <FieldError>{form.formState.errors.email.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    disabled={isPending}
                    {...form.register("password")}
                  />
                  {form.formState.errors.password && (
                    <FieldError>{form.formState.errors.password.message}</FieldError>
                  )}
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Phone Number</FieldLabel>
                  <Input
                    type="tel"
                    placeholder="+1234567890"
                    disabled={isPending}
                    {...form.register("phone")}
                  />
                  {form.formState.errors.phone && (
                    <FieldError>{form.formState.errors.phone.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Date of Birth</FieldLabel>
                  <Input
                    type="date"
                    disabled={isPending}
                    {...form.register("dateOfBirth")}
                  />
                  {form.formState.errors.dateOfBirth && (
                    <FieldError>{form.formState.errors.dateOfBirth.message}</FieldError>
                  )}
                </Field>
              </div>

              <Field>
                <FieldLabel>Gender</FieldLabel>
                <Select
                  disabled={isPending}
                  onValueChange={(val: "MALE" | "FEMALE" | "OTHER" | null) => {
                    if (val) form.setValue("gender", val);
                  }}
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
                {form.formState.errors.gender && (
                  <FieldError>{form.formState.errors.gender.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>Home Address</FieldLabel>
                <Input
                  placeholder="123 Main St, City, Country"
                  disabled={isPending}
                  {...form.register("address")}
                />
                {form.formState.errors.address && (
                  <FieldError>{form.formState.errors.address.message}</FieldError>
                )}
              </Field>

            </FieldGroup>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10"
              disabled={isPending}
            >
              {isPending ? "Registering account securely..." : "Create Account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border pt-4 pb-5">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:opacity-70 transition-opacity"
            >
              Sign in here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
