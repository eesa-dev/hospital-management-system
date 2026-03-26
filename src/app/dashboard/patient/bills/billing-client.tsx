"use client";

import { 
  FileDown, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ReceiptText
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
import { jsPDF } from "jspdf";
import { toast } from "sonner";

interface Bill {
  _id: string;
  billDate: string | Date;
  paymentStatus: "PAID" | "PENDING" | "OVERDUE";
  paymentMethod: "CASH" | "CARD" | "INSURANCE";
  totalAmount: number;
}

interface BillingClientProps {
  initialBills: Bill[];
}

export default function BillingClient({ initialBills }: BillingClientProps) {
  const handleDownloadPDF = (bill: Bill) => {
    try {
      const doc = new jsPDF();
      
      // Add Header
      doc.setFontSize(22);
      doc.setTextColor(37, 99, 235); // Blue-600
      doc.text("HOSPITAL MANAGEMENT SYSTEM", 105, 20, { align: "center" });
      
      doc.setFontSize(12);
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text("Official Medical Invoice", 105, 30, { align: "center" });
      
      // Add Divider
      doc.setDrawColor(226, 232, 240);
      doc.line(20, 35, 190, 35);
      
      // Bill Details
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59); // Slate-800
      doc.text(`Invoice ID: ${bill._id}`, 20, 45);
      doc.text(`Date: ${new Date(bill.billDate).toLocaleDateString()}`, 20, 52);
      doc.text(`Status: ${bill.paymentStatus}`, 20, 59);
      
      // Items Table
      doc.setFillColor(248, 250, 252); // Slate-50
      doc.rect(20, 70, 170, 10, "F");
      doc.text("Description", 25, 77);
      doc.text("Amount", 160, 77);
      
      doc.text("Medical Consultation Fee", 25, 90);
      doc.text(`$${bill.totalAmount.toFixed(2)}`, 160, 90);
      
      // Footer
      doc.line(20, 100, 190, 100);
      doc.setFontSize(14);
      doc.text("Total Amount Due:", 110, 110);
      doc.text(`$${bill.totalAmount.toFixed(2)}`, 160, 110);
      
      doc.setFontSize(10);
      doc.text("Thank you for choosing our healthcare services.", 105, 130, { align: "center" });
      
      doc.save(`Invoice_${bill._id.substring(0, 8)}.pdf`);
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "OVERDUE":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  const pendingAmount = initialBills
    .filter((bill) => bill.paymentStatus !== "PAID")
    .reduce((sum, bill) => sum + bill.totalAmount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 text-left">My Invoices</h2>
        <p className="text-slate-500 text-left mt-1">View and download your medical billing history.</p>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ReceiptText className="text-blue-600 h-5 w-5" />
            <CardTitle className="text-lg">Payment History</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-slate-50/30">
                <TableHead className="pl-6">Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialBills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-slate-400">
                    <CreditCard className="mx-auto h-10 w-10 mb-2 opacity-15" />
                    <p>No billing records found.</p>
                  </TableCell>
                </TableRow>
              ) : (
                initialBills.map((bill) => (
                  <TableRow key={bill._id} className="group transition-colors hover:bg-slate-50/80">
                    <TableCell className="pl-6 font-mono text-xs text-slate-500">
                      #{bill._id.substring(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {new Date(bill.billDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {bill.paymentMethod}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(bill.paymentStatus)}
                        <span className={`text-xs font-bold ${
                          bill.paymentStatus === "PAID" ? "text-emerald-700" : 
                          bill.paymentStatus === "OVERDUE" ? "text-red-700" : "text-amber-700"
                        }`}>
                          {bill.paymentStatus}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-900">
                      ${bill.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDownloadPDF(bill)}
                        className="h-8 border-blue-100 text-blue-600 hover:bg-blue-50"
                      >
                        <FileDown className="mr-2 h-4 w-4" /> PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-blue-600 text-white shadow-lg shadow-blue-200">
            <CardHeader className="pb-2">
               <CardDescription className="text-blue-100">Pending Amount</CardDescription>
               <CardTitle className="text-3xl">${pendingAmount.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-xs text-blue-200">
                  {pendingAmount > 0 
                    ? `You have ${initialBills.filter(b => b.paymentStatus !== "PAID").length} unpaid invoices.` 
                    : "No overdue payments found."}
               </p>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
