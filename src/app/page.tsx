/* Modified by @design-enhancer — Layer 3: Clinical White — Landing Page */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity, Shield, Stethoscope } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Patient Care",
    description:
      "Book appointments online and access your complete medical history from anywhere.",
    color: "text-primary",
    bg: "bg-primary/8",
  },
  {
    icon: Stethoscope,
    title: "Doctor Efficiency",
    description:
      "Manage consultations, write prescriptions, and review EMR in one unified interface.",
    color: "text-success",
    bg: "bg-success/8",
  },
  {
    icon: Shield,
    title: "Hospital Operations",
    description:
      "Streamline billing, pharmacy inventory, and staff management with real-time data.",
    color: "text-warning",
    bg: "bg-warning/8",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-24">
        <div className="max-w-3xl w-full text-center space-y-10 animate-slide-up">

          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success inline-block" />
            Secure · HIPAA-Aware · 99.9% Uptime
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Modern{" "}
              <span className="text-primary">Hospital Management</span>
              <br />
              System
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              A  digital platform designed to streamline healthcare operations, 
              from seamless patient registration and smart appointment scheduling to 
              integrated medical records and pharmacy management.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-left">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-5 bg-card rounded-xl border border-border hover:border-border-strong hover:shadow-sm transition-all duration-200"
              >
                <div
                  className={`h-9 w-9 rounded-lg ${feature.bg} flex items-center justify-center mb-3`}
                >
                  <feature.icon className={`h-4.5 w-4.5 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/login">
              <Button
                size="lg"
                className="w-full sm:w-44 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-44 font-semibold rounded-lg"
              >
                Register as Patient
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-border text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} HMS — Digital Healthcare Solutions</p>
      </footer>
    </div>
  );
}
