"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { patientRegistrationSchema } from "../../schemas/user.schema";
import { registerPatientAction } from "../../actions/User/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
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
    <div className="space-y-8">
      {/* Header Area */}
      <div className="space-y-2 text-center">
        <h1 className="text-5xl font-serif font-medium tracking-tight text-foreground">
          Create Account
        </h1>
        <p className="text-sm text-muted-foreground font-light max-w-[320px] mx-auto leading-relaxed">
          Join the HMS platform to manage your healthcare journey
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel className="text-foreground font-semibold mb-1.5 block text-sm">Full Name</FieldLabel>
              <Input
                placeholder="Enter your full name"
                disabled={isPending}
                className="h-12 bg-muted border-none px-4 focus:ring-1 focus:ring-ring transition-all font-medium text-sm"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <FieldError>{form.formState.errors.name.message}</FieldError>
              )}
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="text-foreground font-semibold mb-1.5 block text-sm">Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  disabled={isPending}
                  className="h-12 bg-muted border-none px-4 focus:ring-1 focus:ring-ring transition-all font-medium text-sm"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <FieldError>{form.formState.errors.email.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel className="text-foreground font-semibold mb-1.5 block text-sm">Password</FieldLabel>
                <Input
                  type="password"
                  placeholder="••••••••"
                  disabled={isPending}
                  className="h-12 bg-muted border-none px-4 focus:ring-1 focus:ring-ring transition-all font-medium text-sm"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <FieldError>{form.formState.errors.password.message}</FieldError>
                )}
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="text-foreground font-semibold mb-1.5 block text-sm">Phone</FieldLabel>
                <Input
                  type="tel"
                  placeholder="+123 456 7890"
                  disabled={isPending}
                  className="h-12 bg-muted border-none px-4 focus:ring-1 focus:ring-ring transition-all font-medium text-sm"
                  {...form.register("phone")}
                />
                {form.formState.errors.phone && (
                  <FieldError>{form.formState.errors.phone.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel className="text-foreground font-semibold mb-1.5 block text-sm">Birth Date</FieldLabel>
                <Input
                  type="date"
                  disabled={isPending}
                  className="h-12 bg-muted border-none px-4 focus:ring-1 focus:ring-ring transition-all font-medium text-sm"
                  {...form.register("dateOfBirth")}
                />
                {form.formState.errors.dateOfBirth && (
                  <FieldError>{form.formState.errors.dateOfBirth.message}</FieldError>
                )}
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field className="md:col-span-1">
                <FieldLabel className="text-foreground font-semibold mb-1.5 block text-sm">Gender</FieldLabel>
                <Select
                  disabled={isPending}
                  onValueChange={(val: "MALE" | "FEMALE" | "OTHER" | null) => {
                    if (val) form.setValue("gender", val);
                  }}
                  value={genderValue}
                >
                  <SelectTrigger className="h-12 bg-muted border-none px-4 focus:ring-1 focus:ring-ring transition-all font-medium text-sm">
                    <SelectValue placeholder="Select" />
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

              <Field className="md:col-span-2">
                <FieldLabel className="text-foreground font-semibold mb-1.5 block text-sm">Address</FieldLabel>
                <Input
                  placeholder="Medical District, City"
                  disabled={isPending}
                  className="h-12 bg-muted border-none px-4 focus:ring-1 focus:ring-ring transition-all font-medium text-sm"
                  {...form.register("address")}
                />
                {form.formState.errors.address && (
                  <FieldError>{form.formState.errors.address.message}</FieldError>
                )}
              </Field>
            </div>
          </FieldGroup>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl text-sm transition-all active:scale-[0.98] mt-2"
            disabled={isPending}
          >
            {isPending ? "Processing..." : "Create Account"}
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground font-light">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-bold hover:underline decoration-primary underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
