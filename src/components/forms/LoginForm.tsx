/* Modified by @design-enhancer — Layer 4: Clinical White — LoginForm Visual Design */
"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginSchema } from "../../schemas/user.schema";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    setErrorMsg("");
    startTransition(async () => {
      const response = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (response?.error) {
        setErrorMsg("Invalid email or password");
        toast.error("Invalid email or password");
      } else if (response?.ok) {
        toast.success("Login successful!");
        router.push("/dashboard");
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header above card */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary mb-3">
          <span className="text-lg font-bold text-primary-foreground">H</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to the Hospital Management System
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FieldGroup>
              <Field>
                <FieldLabel>Email Address</FieldLabel>
                <Input
                  type="email"
                  placeholder="admin@hms.com"
                  disabled={isPending}
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <FieldError>{form.formState.errors.email.message}</FieldError>
                )}
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel>Password</FieldLabel>
                  <Link
                    href="#"
                    className="text-xs font-medium text-primary hover:opacity-70 transition-opacity"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  disabled={isPending}
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <FieldError>
                    {form.formState.errors.password.message}
                  </FieldError>
                )}
                {errorMsg && <FieldError>{errorMsg}</FieldError>}
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10"
              disabled={isPending}
            >
              {isPending ? "Authenticating..." : "Sign In"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border pt-4 pb-5">
          <p className="text-sm text-muted-foreground">
            New patient?{" "}
            <Link
              href="/register"
              className="text-primary font-medium hover:opacity-70 transition-opacity"
            >
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
