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
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
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
    <Card className="w-full border-slate-200 shadow-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-blue-600">Welcome Back</CardTitle>
        <CardDescription>
          Enter your credentials to access the Hospital Management System
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Email Address</FieldLabel>
              <Input 
                type="email" 
                placeholder="admin@hms.com" 
                disabled={isPending} 
                {...form.register("email")} 
              />
              {form.formState.errors.email && <FieldError>{form.formState.errors.email.message}</FieldError>}
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>Password</FieldLabel>
                <Link href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••" 
                disabled={isPending} 
                {...form.register("password")} 
              />
              {form.formState.errors.password && <FieldError>{form.formState.errors.password.message}</FieldError>}
              {errorMsg && <FieldError>{errorMsg}</FieldError>}
            </Field>
          </FieldGroup>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isPending}>
            {isPending ? "Authenticating..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-slate-100 pt-4">
        <p className="text-sm text-slate-500">
          New patient?{" "}
          <Link href="/register" className="text-blue-600 hover:underline font-medium hover:text-blue-700 transition-colors">
            Register here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
