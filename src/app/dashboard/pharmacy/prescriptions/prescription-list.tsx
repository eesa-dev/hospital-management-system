"use client";

import { useTransition, useState } from "react";
import {
  Tablets,
  User,
  Stethoscope,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  ReceiptText
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { createInvoiceAction } from "@/actions/Billing/index";
import { toast } from "sonner";

interface Prescription {
  _id: string;
  patientId: string;
  medicineName: string;
  dosage: string;
  duration: string;
  instructions?: string;
  status: "PENDING" | "BILLED";
  createdAt: string;
  patient: {
    name: string;
    phone: string;
  };
  doctor: {
    name: string;
    specialization: string;
  };
}

interface PrescriptionListProps {
  initialPrescriptions: Prescription[];
}

export default function PrescriptionList({ initialPrescriptions }: PrescriptionListProps) {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [billingPrescription, setBillingPrescription] = useState<Prescription | null>(null);
  const [billAmount, setBillAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD" | "INSURANCE">("CASH");

  const filteredPrescriptions = initialPrescriptions.filter(
    (p) =>
      p.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerateInvoice = () => {
    if (!billingPrescription || !billAmount) return;

    startTransition(async () => {
      const result = await createInvoiceAction({
        patientId: billingPrescription.patientId,
        prescriptionId: billingPrescription._id,
        totalAmount: parseFloat(billAmount),
        paymentMethod: paymentMethod,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message);
        setBillingPrescription(null);
        setBillAmount("");
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Prescription Orders</h2>
          <p className="text-muted-foreground mt-1">Fulfill medication requests issued by clinical staff.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search patient or med..." 
                className="pl-9 h-10 border-border bg-card shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
        </div>
      </div>

      <Card className="shadow-sm border-border overflow-hidden rounded-2xl">
        <CardHeader className="bg-muted/30 border-b border-border px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <Tablets size={20} />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Medication Ledger</CardTitle>
                <CardDescription>Live feed of pending and past prescriptions.</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <Button variant="outline" size="sm" className="h-9 border-border text-xs font-bold gap-1.5 px-3">
                  Status <ChevronDown size={14} />
               </Button>
               <Button variant="outline" size="sm" className="h-9 border-border text-xs font-bold gap-1.5 px-3">
                  <Filter size={14} /> Sort
               </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/10 hover:bg-muted/10">
                <TableHead className="w-[200px] font-bold text-[10px] uppercase tracking-widest px-6 py-3">Patient Details</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest py-3">Medication & Dosage</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest py-3">Prescribing Physician</TableHead>
                <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest px-6 py-3">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrescriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center text-muted-foreground">
                    <Clock className="mx-auto h-12 w-12 mb-3 opacity-10" />
                    <p className="font-medium italic">No pending medication orders found.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPrescriptions.map((p) => (
                  <TableRow key={p._id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 shadow-sm shrink-0">
                            <User size={16} />
                         </div>
                         <div className="min-w-0">
                            <p className="font-bold text-foreground text-sm truncate">{p.patient.name}</p>
                            <p className="text-[10px] text-muted-foreground font-medium truncate uppercase tracking-tighter">PH: {p.patient.phone}</p>
                         </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-start gap-3">
                         <div className="mt-1 h-2 w-2 rounded-full bg-primary/40 shrink-0" />
                         <div>
                            <p className="font-bold text-foreground text-sm leading-tight">{p.medicineName}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                               <span className="text-[10px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                  {p.dosage}
                               </span>
                               <span className="text-[10px] text-muted-foreground font-medium italic">
                                  for {p.duration}
                               </span>
                            </div>
                         </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center text-success border border-success/15 shrink-0">
                            <Stethoscope size={16} />
                         </div>
                         <div className="min-w-0">
                            <p className="font-bold text-foreground text-xs">Dr. {p.doctor.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate uppercase tracking-tighter">{p.doctor.specialization}</p>
                         </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-6 py-4">
                       {p.status === "BILLED" ? (
                           <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-success/10 text-success border border-success/20">
                               <CheckCircle2 size={12} /> Order Fulfilled
                           </span>
                       ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-9 px-4 font-bold text-primary hover:bg-primary/10 hover:text-primary transition-all border border-transparent hover:border-primary/20"
                          onClick={() => setBillingPrescription(p)}
                        >
                           <ReceiptText size={16} className="mr-2" /> Fulfill & Bill
                        </Button>
                       )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Billing Dialog */}
      <Dialog open={!!billingPrescription} onOpenChange={(open: boolean) => !open && !isPending && setBillingPrescription(null)}>
        <DialogContent className="sm:max-w-[450px] p-0 border-none shadow-2xl overflow-hidden rounded-2xl">
           <div className="h-1.5 bg-success w-full" />
           <DialogHeader className="px-8 pt-8 pb-6 bg-muted/30">
              <div className="flex items-center gap-3 text-success mb-2">
                 <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
                    <ReceiptText size={22} />
                 </div>
                 <div>
                    <DialogTitle className="text-xl font-black text-foreground">Generate Invoice</DialogTitle>
                    <DialogDescription className="text-xs font-medium">Fulfilling medication for <span className="font-bold text-foreground">{billingPrescription?.patient.name}</span></DialogDescription>
                 </div>
              </div>
           </DialogHeader>

           <div className="p-8 space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-border/50">
                 <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Tablets size={20} />
                 </div>
                 <div>
                    <p className="text-xs font-black uppercase tracking-tighter text-muted-foreground leading-none">Medicine</p>
                    <p className="font-bold text-sm text-foreground mt-1">{billingPrescription?.medicineName}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                 <Field>
                    <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">Total Billing Amount ($)</FieldLabel>
                    <Input 
                      type="number" 
                      placeholder="Enter amount, e.g. 15.50" 
                      className="h-11 font-bold text-base border-border bg-card shadow-inner"
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                    />
                 </Field>

                 <Field>
                    <FieldLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">Payment Method</FieldLabel>
                    <Select value={paymentMethod} onValueChange={(val: "CASH" | "CARD" | "INSURANCE" | null) => setPaymentMethod(val ?? "CASH")}>
                       <SelectTrigger className="h-11 bg-card border-border shadow-sm">

                          <SelectValue placeholder="Select method" />
                       </SelectTrigger>
                       <SelectContent>
                          <SelectItem value="CASH">Cash Payment</SelectItem>
                          <SelectItem value="CARD">Debit / Credit Card</SelectItem>
                          <SelectItem value="INSURANCE">Insurance Claim</SelectItem>
                       </SelectContent>
                    </Select>
                 </Field>
              </div>
           </div>

           <DialogFooter className="p-8 bg-muted/30 border-t border-border">
              <Button 
                className="w-full h-12 bg-success hover:bg-success/90 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-success/20"
                onClick={handleGenerateInvoice}
                disabled={isPending || !billAmount}
              >
                 {isPending ? "Generating Invoice..." : "Finalize & Post to Patient Dashboard"}
              </Button>
           </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
         <AlertCircle className="h-5 w-5 text-primary shrink-0" />
         <p className="text-xs font-medium text-primary leading-tight">
            Verify patient identity by checking their phone number or system ID before dispensing medications.
         </p>
      </div>
    </div>
  );
}
