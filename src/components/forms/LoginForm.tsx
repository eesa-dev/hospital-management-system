"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginSchema } from "../../schemas/user.schema";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
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
    <div className="space-y-8">
      {/* Header Area */}
      <div className="space-y-2 text-center">
        <h1 className="text-5xl font-serif font-medium tracking-tight text-foreground">
          Welcome Back
        </h1>
        <p className="text-sm text-muted-foreground font-light max-w-[320px] mx-auto leading-relaxed">
          Enter your email and password to access your account
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel className="text-foreground font-semibold mb-1.5 block text-sm">Email</FieldLabel>
              <Input
                type="email"
                placeholder="Enter your email"
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
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Enter your password"
                  disabled={isPending}
                  className="h-12 bg-muted border-none px-4 focus:ring-1 focus:ring-ring transition-all font-medium text-sm"
                  {...form.register("password")}
                />
              </div>
              {form.formState.errors.password && (
                <FieldError>{form.formState.errors.password.message}</FieldError>
              )}
            </Field>
          </FieldGroup>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl text-sm transition-all active:scale-[0.98]"
              disabled={isPending}
            >
              {isPending ? "Signing In..." : "Sign In"}
            </Button>
          </div>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground font-light">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-primary font-bold hover:underline decoration-primary underline-offset-4"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
