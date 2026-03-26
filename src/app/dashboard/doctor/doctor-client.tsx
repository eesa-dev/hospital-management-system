"use client";

import { useTransition, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  MoreVertical,
  Tablets,
  FileText,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateAppointmentStatusAction } from "@/actions/Appointment/index";
import { createPrescriptionAction } from "@/actions/Prescription/index";
import { toast } from "sonner";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const prescriptionItemSchema = z.object({
  medicineName: z.string().min(1, "Required"),
  dosage: z.string().min(1, "Required (e.g. 1-0-1)"),
  duration: z.string().min(1, "Required (e.g. 5 days)"),
  instructions: z.string().optional(),
});

const prescriptionSchema = z.object({
  items: z.array(prescriptionItemSchema).min(1, "At least one medicine is required"),
});

interface SimplePatient {
  _id: string;
  name: string;
}

interface Appointment {
  _id: string;
  patientId: SimplePatient | null;
  appointmentDate: string | Date;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
}

interface InventoryItem {
  _id: string;
  medicineName: string;
  quantity: number;
}

interface DoctorClientProps {
  initialAppointments: Appointment[];
  inventory: InventoryItem[];
}

export default function DoctorClient({
  initialAppointments,
  inventory
}: DoctorClientProps) {
  const [isPending, startTransition] = useTransition();
  const [prescribingAppt, setPrescribingAppt] = useState<Appointment | null>(null);
  const [selectedMed, setSelectedMed] = useState<string>("");

  const form = useForm<z.infer<typeof prescriptionSchema>>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const handleAddMedicine = () => {
    if (!selectedMed) return;
    
    // Check if already added
    const exists = fields.find(f => f.medicineName === selectedMed);
    if (exists) {
        toast.error(`${selectedMed} is already in the list.`);
        return;
    }

    append({
        medicineName: selectedMed,
        dosage: "",
        duration: "",
        instructions: ""
    });
    setSelectedMed("");
  };

  const handleStatusUpdate = (
    id: string,
    status: "CONFIRMED" | "CANCELLED" | "COMPLETED",
  ) => {
    startTransition(async () => {
      const result = await updateAppointmentStatusAction(id, status);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message);
      }
    });
  };

  const onPrescriptionSubmit = (values: z.infer<typeof prescriptionSchema>) => {
    if (!prescribingAppt) return;

    startTransition(async () => {
      const result = await createPrescriptionAction({
        appointmentId: prescribingAppt._id,
        patientId: prescribingAppt.patientId?._id || "",
        items: values.items
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message);
        setPrescribingAppt(null);
        form.reset();
        // Also mark as completed if it wasn't already
        if (prescribingAppt.status !== "COMPLETED") {
          await updateAppointmentStatusAction(prescribingAppt._id, "COMPLETED");
        }
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <span className="inline-flex items-center gap-1.5 bg-success/10 text-success px-2 py-0.5 rounded-md text-xs font-semibold"><span className="h-1.5 w-1.5 rounded-full bg-success inline-block" />Confirmed</span>;
      case "CANCELLED":
        return <span className="inline-flex items-center gap-1.5 bg-destructive/10 text-destructive px-2 py-0.5 rounded-md text-xs font-semibold"><span className="h-1.5 w-1.5 rounded-full bg-destructive inline-block" />Cancelled</span>;
      case "COMPLETED":
        return <span className="inline-flex items-center gap-1.5 bg-secondary text-muted-foreground px-2 py-0.5 rounded-md text-xs font-semibold"><span className="h-1.5 w-1.5 rounded-full bg-muted-foreground inline-block" />Completed</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 bg-warning/10 text-warning px-2 py-0.5 rounded-md text-xs font-semibold"><span className="h-1.5 w-1.5 rounded-full bg-warning inline-block" />Pending</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Consultation Schedule</h2>
          <p className="text-muted-foreground mt-1">Review and manage your upcoming patient appointments.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-primary/8 border border-primary/20 p-2 rounded-lg flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Next 7 Days</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-sm border-border">
          <CardHeader className="border-b border-border bg-muted/30 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Recent Requests</CardTitle>
                <CardDescription>Appointments requiring your immediate attention.</CardDescription>
              </div>
              <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/10 hover:bg-muted/10">
                  <TableHead className="w-[250px] font-bold text-xs uppercase tracking-widest px-6">Patient</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">Date & Time</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest text-center">Status</TableHead>
                  <TableHead className="text-right font-bold text-xs uppercase tracking-widest px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center text-muted-foreground">
                      <Clock className="mx-auto h-12 w-12 mb-3 opacity-10" />
                      <p className="font-medium">No appointments scheduled for this period.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  initialAppointments.map((appt) => (
                    <TableRow key={appt._id} className="group transition-colors hover:bg-muted/30">
                      <TableCell className="px-6">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs border border-primary/10 shadow-sm group-hover:scale-105 transition-transform">
                            {appt.patientId?.name?.[0]?.toUpperCase() || <User size={16} />}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{appt.patientId?.name || "Anonymous Patient"}</p>
                            <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Patient ID: {appt.patientId?._id?.slice(-6).toUpperCase()}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-medium text-xs">
                        {new Date(appt.appointmentDate).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </TableCell>
                      <TableCell className="text-center">{getStatusBadge(appt.status)}</TableCell>
                      <TableCell className="text-right px-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 p-1.5 shadow-xl border-border bg-card">
                            <DropdownMenuItem 
                              className="text-success cursor-pointer font-bold text-xs flex items-center gap-2 p-2 rounded-md"
                              onClick={() => handleStatusUpdate(appt._id, "CONFIRMED")}
                              disabled={isPending}
                            >
                              <CheckCircle className="h-4 w-4" /> Confirm Visit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-primary cursor-pointer font-bold text-xs flex items-center gap-2 p-2 rounded-md"
                              onClick={() => {
                                  setPrescribingAppt(appt);
                                  form.setValue("items", []);
                              }}
                              disabled={isPending}
                            >
                              <Tablets className="h-4 w-4" /> Issue Prescription
                            </DropdownMenuItem>
                            <div className="h-px bg-border my-1.5" />
                            <DropdownMenuItem 
                              className="text-destructive cursor-pointer font-bold text-xs flex items-center gap-2 p-2 rounded-md"
                              onClick={() => handleStatusUpdate(appt._id, "CANCELLED")}
                              disabled={isPending}
                            >
                              <XCircle className="h-4 w-4" /> Cancel Booking
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer font-bold text-xs flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                              onClick={() => handleStatusUpdate(appt._id, "COMPLETED")}
                              disabled={isPending}
                            >
                              <div className="h-3.5 w-3.5 border-2 border-muted-foreground rounded-full" /> Mark Consultation Done
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!prescribingAppt} onOpenChange={(open: boolean) => !open && !isPending && setPrescribingAppt(null)}>
        <DialogContent className="sm:max-w-[700px] p-0 border-none shadow-2xl overflow-hidden rounded-2xl animate-scale-in">
          <form onSubmit={form.handleSubmit(onPrescriptionSubmit)}>
            <div className="h-1.5 bg-primary w-full" />
            <DialogHeader className="px-8 pt-8 pb-6 bg-muted/30">
              <div className="flex items-center gap-3 text-primary mb-2">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <FileText size={22} />
                </div>
                <div>
                    <DialogTitle className="text-xl font-black text-foreground">Clinical Prescription</DialogTitle>
                    <DialogDescription className="text-xs font-medium">
                        Patient: <span className="font-bold text-foreground">{prescribingAppt?.patientId?.name}</span> • ID: {prescribingAppt?.patientId?._id?.slice(-6).toUpperCase()}
                    </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              
              {/* Medicine Selection Box */}
              <div className="bg-muted/20 p-6 rounded-2xl border border-border/50">
                  <div className="flex flex-col md:flex-row md:items-end gap-4">
                      <div className="flex-1">
                          <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Select Medicine from Inventory</FieldLabel>
                          <Select value={selectedMed} onValueChange={(val) => setSelectedMed(val ?? "")}>
                              <SelectTrigger className="h-11 bg-card border-border shadow-sm">
                                  <SelectValue placeholder="Search and select medicine..." />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border shadow-xl max-h-64">
                                  {inventory.map((item) => (
                                      <SelectItem 
                                        key={item._id} 
                                        value={item.medicineName}
                                        disabled={item.quantity <= 0}
                                        className="text-xs font-bold"
                                      >
                                          <div className="flex justify-between items-center w-full min-w-48">
                                              <span>{item.medicineName}</span>
                                              <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.quantity > 5 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                                                  {item.quantity} in stock
                                              </span>
                                          </div>
                                      </SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                      </div>
                      <Button 
                        type="button" 
                        onClick={handleAddMedicine}
                        disabled={!selectedMed}
                        className="h-11 px-6 font-black text-xs uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                      >
                          <Plus className="mr-2 h-4 w-4" /> Add to List
                      </Button>
                  </div>
              </div>

              {/* Dynamic Medicine List */}
              <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Medications List ({fields.length})</h4>
                    {fields.length > 0 && (
                        <span className="text-[10px] font-bold text-success flex items-center gap-1">
                            <CheckCircle size={10} /> Validated Batch
                        </span>
                    )}
                  </div>

                  {fields.length === 0 ? (
                      <div className="h-32 rounded-2xl border-2 border-dashed border-border bg-muted/5 flex flex-col items-center justify-center text-muted-foreground italic text-xs">
                          <Tablets size={24} className="mb-2 opacity-15" />
                          No medicines added yet.
                      </div>
                  ) : (
                      <div className="space-y-4">
                          {fields.map((field, index) => (
                              <div key={field.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:border-primary/30 transition-colors animate-slide-up group relative">
                                  <button 
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-all shadow-lg border border-destructive/20 opacity-0 group-hover:opacity-100"
                                  >
                                      <Trash2 size={14} />
                                  </button>

                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                      {/* Medicine Name Display */}
                                      <div className="md:col-span-4 flex items-center gap-3">
                                          <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                                              <Tablets size={20} />
                                          </div>
                                          <div className="min-w-0">
                                              <p className="text-xs font-black uppercase tracking-tighter text-muted-foreground">Medicine</p>
                                              <p className="font-bold text-sm text-foreground truncate">{field.medicineName}</p>
                                          </div>
                                      </div>

                                      {/* Dosage Input */}
                                      <div className="md:col-span-3">
                                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">Dosage</p>
                                          <Input 
                                            {...form.register(`items.${index}.dosage` as const)} 
                                            placeholder="e.g. 1-0-1" 
                                            className="h-10 text-xs font-bold bg-muted/30 border-border focus:bg-white"
                                          />
                                          {form.formState.errors.items?.[index]?.dosage && (
                                              <p className="text-[10px] text-destructive font-bold mt-1 ml-1">{form.formState.errors.items?.[index]?.dosage?.message}</p>
                                          )}
                                      </div>

                                      {/* Duration Input */}
                                      <div className="md:col-span-5">
                                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">Duration</p>
                                          <Input 
                                            {...form.register(`items.${index}.duration` as const)} 
                                            placeholder="e.g. 5 days after meal" 
                                            className="h-10 text-xs font-bold bg-muted/30 border-border focus:bg-white"
                                          />
                                          {form.formState.errors.items?.[index]?.duration && (
                                              <p className="text-[10px] text-destructive font-bold mt-1 ml-1">{form.formState.errors.items?.[index]?.duration?.message}</p>
                                          )}
                                      </div>
                                  </div>
                                  
                                  <div className="mt-4 pt-4 border-t border-border/50">
                                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 ml-1 flex items-center gap-1.5">
                                          <FileText size={10} /> Special Instructions (Optional)
                                      </p>
                                      <Input 
                                        {...form.register(`items.${index}.instructions` as const)} 
                                        placeholder="e.g. Avoid dairy products while taking this..." 
                                        className="h-9 text-[11px] font-medium bg-muted/10 border-border italic"
                                      />
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
                  {form.formState.errors.items?.message && (
                      <div className="flex items-center gap-2 text-destructive font-bold text-xs bg-destructive/5 p-3 rounded-lg border border-destructive/10 animate-shake">
                          <AlertCircle size={14} />
                          {form.formState.errors.items.message}
                      </div>
                  )}
              </div>
            </div>

            <DialogFooter className="p-8 bg-muted/30 border-t border-border">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setPrescribingAppt(null)}
                    disabled={isPending}
                    className="w-full sm:w-auto font-black text-xs uppercase tracking-widest border-border bg-card"
                  >
                    Discard Draft
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isPending || fields.length === 0} 
                    className="flex-1 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs uppercase tracking-[0.2em] h-12 shadow-xl shadow-primary/20"
                  >
                    {isPending ? (
                        <span className="flex items-center gap-2">
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Syncing Batch...
                        </span>
                    ) : (
                        `Issue Final Prescription (${fields.length} Meds)`
                    )}
                  </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
