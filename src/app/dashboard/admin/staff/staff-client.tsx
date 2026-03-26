"use client";

import { useTransition, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { staffCreationSchema } from "@/schemas/user.schema";
import { createStaffAction } from "@/actions/Admin/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Plus,
  Users,
  Copy,
  Check,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  Search,
  FileDown,
  Filter
} from "lucide-react";

interface StaffMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  specialization: string;
  experience: string;
  decryptedPassword: string;
}

interface StaffPageClientProps {
  initialStaff: StaffMember[];
}

const ROLE_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  ADMIN: {
    bg: "bg-primary/10",
    text: "text-primary",
    dot: "bg-primary",
  },
  DOCTOR: {
    bg: "bg-success/10",
    text: "text-success",
    dot: "bg-success",
  },
  PHARMACY: {
    bg: "bg-warning/10",
    text: "text-warning",
    dot: "bg-warning",
  },
};

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-rose-500",
];

function getAvatarColor(id: string) {
  const index = parseInt(id.slice(-1), 16) || 0;
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function StaffPageClient({ initialStaff }: StaffPageClientProps) {
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<z.infer<typeof staffCreationSchema>>({
    resolver: zodResolver(staffCreationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "DOCTOR",
      phone: "",
      specialization: "",
      experience: "",
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
      }
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Password copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredStaff = initialStaff.filter(s => 
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedStaff = [...filteredStaff].sort((a, b) => {
    const nameA = (a.name || "").toLowerCase();
    const nameB = (b.name || "").toLowerCase();
    return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });

  if (!mounted) return null;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Page Header — Ref: staff-dashboard.png */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
            <Users size={24} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Staff Directory
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden md:flex border-border bg-card shadow-sm font-semibold h-10">
            <FileDown className="mr-2 h-4 w-4" /> Actions via CSV
          </Button>
          <Button
            onClick={() => setShowForm(!showForm)}
            className={`h-10 font-bold shadow-lg transition-all ${
              showForm 
                ? "bg-destructive hover:bg-destructive/90 text-white shadow-destructive/20" 
                : "bg-primary hover:bg-primary/90 text-white shadow-primary/20"
            }`}
          >
            {showForm ? <><X className="mr-2 h-4 w-4" /> Close Form</> : <><Plus className="mr-2 h-4 w-4" /> New Staff</>}
          </Button>
        </div>
      </div>

      {/* Add Staff Form — Polished clinical style */}
      {showForm && (
        <Card className="border-border shadow-xl overflow-hidden max-w-2xl mx-auto animate-slide-up">
          <div className="h-1.5 bg-primary w-full" />
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-xl font-bold text-foreground">Onboard Medical Personnel</CardTitle>
            <CardDescription>
              Assign roles and set secure access credentials for new staff members.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FieldGroup>
                <Field>
                  <FieldLabel>Full Legal Name</FieldLabel>
                  <Input
                    placeholder="e.g. Dr. Jonathan Harker"
                    {...form.register("name")}
                    disabled={isPending}
                    className="h-11 bg-muted/20 border-border focus:bg-white transition-all"
                  />
                  {form.formState.errors.name && (
                    <FieldError>{form.formState.errors.name.message}</FieldError>
                  )}
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field>
                    <FieldLabel>Email Address</FieldLabel>
                    <Input
                      type="email"
                      placeholder="name@hospital.com"
                      {...form.register("email")}
                      disabled={isPending}
                      className="h-11 bg-muted/20 border-border focus:bg-white"
                    />
                    {form.formState.errors.email && (
                      <FieldError>{form.formState.errors.email.message}</FieldError>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Access Password</FieldLabel>
                    <Input
                      type="text"
                      placeholder="Minimum 6 characters"
                      {...form.register("password")}
                      disabled={isPending}
                      className="h-11 bg-muted/20 border-border focus:bg-white"
                    />
                    {form.formState.errors.password && (
                      <FieldError>{form.formState.errors.password.message}</FieldError>
                    )}
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field>
                    <FieldLabel>Primary Contact</FieldLabel>
                    <Input
                      placeholder="+1 (555) 000-0000"
                      {...form.register("phone")}
                      disabled={isPending}
                      className="h-11 bg-muted/20 border-border focus:bg-white"
                    />
                    {form.formState.errors.phone && (
                      <FieldError>{form.formState.errors.phone.message}</FieldError>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>System Role</FieldLabel>
                    <Select
                      onValueChange={(val: "DOCTOR" | "PHARMACY" | "ADMIN" | null) => {
                        if (val) form.setValue("role", val);
                      }}
                      value={roleValue}
                      disabled={isPending}
                    >
                      <SelectTrigger className="h-11 bg-muted/20 border-border">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DOCTOR">Medical Doctor</SelectItem>
                        <SelectItem value="PHARMACY">Pharmacist</SelectItem>
                        <SelectItem value="ADMIN">System Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.role && (
                      <FieldError>{form.formState.errors.role.message}</FieldError>
                    )}
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field>
                    <FieldLabel>Area of Specialization</FieldLabel>
                    <Input
                      placeholder="e.g. Cardiology / Oncology"
                      {...form.register("specialization")}
                      disabled={isPending}
                      className="h-11 bg-muted/20 border-border focus:bg-white"
                    />
                    {form.formState.errors.specialization && (
                      <FieldError>{form.formState.errors.specialization.message}</FieldError>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Years of Experience</FieldLabel>
                    <Input
                      placeholder="e.g. 8+ Years"
                      {...form.register("experience")}
                      disabled={isPending}
                      className="h-11 bg-muted/20 border-border focus:bg-white"
                    />
                    {form.formState.errors.experience && (
                      <FieldError>{form.formState.errors.experience.message}</FieldError>
                    )}
                  </Field>
                </div>
              </FieldGroup>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 shadow-lg shadow-primary/20"
                disabled={isPending}
              >
                {isPending ? "Syncing with database..." : "Complete Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Staff List — Ref: staff-dashboard.png table style */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-border bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
             <Button variant="outline" size="sm" className="bg-card h-9 border-border text-xs font-bold gap-1.5 px-3">
               Status <ChevronDown size={14} />
             </Button>
             <Button variant="outline" size="sm" className="bg-card h-9 border-border text-xs font-bold gap-1.5 px-3">
               Role <ChevronDown size={14} />
             </Button>
             <Button variant="outline" size="sm" className="bg-card h-9 border-border text-xs font-bold gap-1.5 px-3">
               <Filter size={14} /> More
             </Button>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-9 h-9 border-border bg-card shadow-inner text-sm focus-visible:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table Headers */}
        <div className="grid grid-cols-[2.5fr_1fr_1fr_1.5fr_1fr_auto] items-center px-6 py-3 border-b border-border bg-muted/30">
          <button
            className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors text-left"
            onClick={() => setSortAsc(!sortAsc)}
          >
            Full Name & Identity
            {sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            System Role
          </span>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            Exp. Level
          </span>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            Field of Expertise
          </span>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            Credentials
          </span>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right w-16">
            Actions
          </span>
        </div>

        {/* Rows — Ref: staff-dashboard.png row items */}
        {sortedStaff.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
            <Users className="h-12 w-12 opacity-10 mb-3" />
            <p className="text-sm font-medium">No matching personnel records.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sortedStaff.map((member) => {
              const roleStyle = ROLE_STYLES[member.role] ?? ROLE_STYLES["ADMIN"];
              const initials = getInitials(member.name || "?");
              const avatarClass = getAvatarColor(member._id);

              return (
                <div
                  key={member._id}
                  className="grid grid-cols-[2.5fr_1fr_1fr_1.5fr_1fr_auto] items-center px-6 py-4 hover:bg-muted/30 transition-all group"
                >
                  {/* Name + Email With Initials Avatar */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform ${avatarClass}`}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground text-sm leading-tight group-hover:text-primary transition-colors truncate">
                        {member.name || "N/A"}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-medium mt-0.5 truncate">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  {/* Role Badge (Pill Style) */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-tight border ${roleStyle.bg} ${roleStyle.text} border-current/10`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${roleStyle.dot}`}
                      />
                      {member.role === "PHARMACY" ? "Pharmacist" : member.role === "DOCTOR" ? "Doctor" : "Admin"}
                    </span>
                  </div>

                  {/* Experience */}
                  <div className="text-xs font-bold text-slate-600">
                    {member.experience || "—"}
                  </div>

                  {/* Specialization */}
                  <div className="text-xs font-medium text-muted-foreground truncate pr-4 italic">
                    {member.specialization || "General Staff"}
                  </div>

                  {/* Credentials with Copy Icon */}
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-mono bg-muted/50 px-2 py-1 rounded border border-border text-muted-foreground tracking-tighter">
                      ••••••••
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      onClick={() =>
                        copyToClipboard(member.decryptedPassword, member._id)
                      }
                    >
                      {copiedId === member._id ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>

                  {/* Actions Dropdown */}
                  <div className="flex justify-end w-16">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none border border-transparent hover:border-border"
                      >
                        <MoreHorizontal size={18} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 p-1 bg-card border-border shadow-xl">
                        <DropdownMenuItem
                          className="cursor-pointer text-xs font-bold flex items-center gap-2 p-2 hover:bg-muted rounded-md"
                          onClick={() =>
                            copyToClipboard(member.decryptedPassword, member._id)
                          }
                        >
                          <Copy size={14} /> Copy Credentials
                        </DropdownMenuItem>
                        <div className="h-px bg-border my-1" />
                        <DropdownMenuItem className="cursor-pointer text-xs font-bold flex items-center gap-2 p-2 text-destructive hover:bg-destructive/10 rounded-md">
                          Deactivate Access
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Table Footer / Pagination Placeholder */}
        <div className="px-6 py-4 border-t border-border bg-muted/10 flex items-center justify-between">
           <span className="text-xs text-muted-foreground font-medium">Showing {sortedStaff.length} results</span>
           <div className="flex items-center gap-2">
             <Button variant="outline" size="sm" disabled className="h-8 text-xs border-border bg-card">Previous</Button>
             <Button variant="outline" size="sm" disabled className="h-8 text-xs border-border bg-card">Next</Button>
           </div>
        </div>
      </div>
    </div>
  );
}
