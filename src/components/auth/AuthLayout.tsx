"use client";

import React from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  quote?: string;
  quoteAuthor?: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  quote = "Where there is love of medicine, there is love of humanity.",
  quoteAuthor = "Hippocrates",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background overflow-hidden text-foreground">
      {/* Left Side: Abstract Background Sidebar */}
      <div className="relative hidden lg:flex w-[42%] p-2">
        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-secondary border border-border p-12 flex flex-col justify-between">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/auth-bg-light.png"
              alt="Healthcare Abstract Background"
              fill
              className="object-cover opacity-60 mix-blend-multiply"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-b from-white/10 via-white/30 to-white/60" />
          </div>

          {/* Content Over Sidebar */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="h-px w-8 bg-border" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                A Wise Quote
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center max-w-sm">
              <h2 className="text-6xl font-serif font-medium leading-[1.1] mb-6 text-foreground tracking-tight">
                {title}
              </h2>
              <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-[280px]">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="max-w-[280px] space-y-2">
              <p className="text-muted-foreground text-xs italic font-light leading-relaxed">
                &quot;{quote}&quot;
              </p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70">
                — {quoteAuthor}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form Content */}
      <div className="flex-1 flex flex-col relative overflow-y-auto">
        {/* Branding Header */}
        <div className="pt-12 pb-8 flex justify-center">
          <div className="flex items-center gap-2 cursor-default">
            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-primary text-white font-bold text-lg">
              H
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              HMS
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col px-8 sm:px-12 md:px-20 lg:px-24">
          <div className="w-full max-w-[440px] mx-auto">{children}</div>

          <div className="mt-auto py-8 text-center">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
              © {new Date().getFullYear()} HMS Healthcare Management
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
