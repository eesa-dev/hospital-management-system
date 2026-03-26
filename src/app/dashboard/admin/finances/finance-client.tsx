"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  Wallet,
  ShoppingBag,
  ArrowUpRight,
  Clock,
  MoreHorizontal,
  Plus,
  ArrowRight,
  FileDown,
  ChevronDown,
  Receipt
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Transaction {
  _id: string;
  patientName: string;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
}

interface FinanceClientProps {
  initialData: {
    totalRevenue: number;
    pendingBalance: number;
    totalTransactions: number;
    chartData: number[];
    recentTransactions: Transaction[];
  };
}

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-rose-500",
];

function getAvatarColor(name: string) {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function FinanceClient({ initialData }: FinanceClientProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  // Calculate max for chart scaling
  const maxChartValue = Math.max(...initialData.chartData, 1000);
  const chartBars = initialData.chartData.map(val => (val / maxChartValue) * 100);

  return (
    <div className="space-y-8 animate-fade-in max-w-(--breakpoint-2xl) mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Financial Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time hospital revenue, billing performance, and transactional health.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-card shadow-sm border-border hover:bg-muted font-semibold">
            <FileDown className="mr-2 h-4 w-4" /> Export Ledger
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> New Payment
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Balance Card */}
        <Card className="shadow-sm border-border bg-card hover:border-success/30 transition-all rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Wallet size={80} strokeWidth={1} />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total Revenue</CardTitle>
            <div className="h-7 w-7 rounded-full bg-success-subtle flex items-center justify-center text-success border border-success/10">
              <TrendingUp size={14} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-foreground tracking-tighter">
              $ {initialData.totalRevenue.toLocaleString()}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[10px] font-bold text-success bg-success/10 px-1.5 py-0.5 rounded">PAID</span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Verified across all collections</span>
            </div>
            {/* Sparkline Visual */}
            <div className="h-10 w-full flex items-end gap-1 mt-6 opacity-40">
              {chartBars.map((h, i) => (
                <div key={i} className="flex-1 bg-success rounded-t-[2px]" style={{ height: `${h}%` }} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Card */}
        <Card className="shadow-sm border-border bg-card hover:border-warning/30 transition-all rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShoppingBag size={80} strokeWidth={1} />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Pending Balance</CardTitle>
            <div className="h-7 w-7 rounded-full bg-warning-subtle flex items-center justify-center text-warning border border-warning/10">
              <Receipt size={14} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-foreground tracking-tighter">
              $ {initialData.pendingBalance.toLocaleString()}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[10px] font-bold text-warning bg-warning/10 px-1.5 py-0.5 rounded">UNPAID</span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Requires administrative follow-up</span>
            </div>
            <div className="h-10 w-full flex items-end gap-1 mt-6 opacity-40">
              {[20, 40, 30, 60, 45, 30, 20].map((h, i) => (
                <div key={i} className="flex-1 bg-warning rounded-t-[2px]" style={{ height: `${h}%` }} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Transactions */}
        <Card className="shadow-lg border-primary/20 bg-primary text-primary-foreground rounded-2xl relative overflow-hidden flex flex-col justify-center text-center p-6 group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:rotate-12 transition-transform">
            <ArrowUpRight size={140} strokeWidth={1} />
          </div>
          <h3 className="text-xl font-black mb-1">{initialData.totalTransactions} Records</h3>
          <p className="text-white/70 text-xs font-medium mb-6 px-4">
            Total billing entries processed by the system to date.
          </p>
          <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold shadow-lg">
            Manage All Invoices
          </Button>
        </Card>
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Weekly Growth Chart */}
        <Card className="lg:col-span-2 shadow-sm border-border bg-card rounded-2xl overflow-hidden flex flex-col">
          <CardHeader className="px-6 py-5 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Revenue Growth</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-black text-foreground">Weekly Overview</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Based on daily receipts</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/10">
                All Statistics <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8 pt-12">
            <div className="flex items-end justify-between gap-3 h-64 border-b border-border/50 relative">
              <div className="absolute left-0 bottom-0 h-full flex flex-col justify-between text-[10px] font-black text-muted-foreground/40 -ml-1 pr-4 pointer-events-none uppercase tracking-tighter">
                <span>{(maxChartValue / 1000).toFixed(1)} K</span>
                <span>{(maxChartValue * 0.75 / 1000).toFixed(1)} K</span>
                <span>{(maxChartValue * 0.5 / 1000).toFixed(1)} K</span>
                <span>{(maxChartValue * 0.25 / 1000).toFixed(1)} K</span>
                <span>0 K</span>
              </div>

              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
                const val = initialData.chartData[idx];
                const barHeight = chartBars[idx];
                const active = idx === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
                
                return (
                  <div key={day} className="flex-1 flex flex-col items-center group">
                    <div className="w-full relative flex flex-col justify-end h-56 px-1.5 sm:px-3">
                      <div className="absolute inset-x-1.5 sm:inset-x-3 bottom-0 top-0 bg-muted/50 rounded-full" />
                      <div 
                        className={`absolute inset-x-1.5 sm:inset-x-3 bottom-0 rounded-full transition-all duration-500 ${active ? "bg-foreground" : "bg-foreground/80 group-hover:bg-foreground"}`} 
                        style={{ height: `${barHeight}%` }} 
                      />
                      {active && val > 0 && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full mb-10 z-10">
                          <div className="bg-foreground text-background shadow-2xl rounded-lg px-3 py-1.5 text-[11px] font-black whitespace-nowrap border border-foreground animate-scale-in">
                            $ {val.toLocaleString()}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-foreground" />
                          </div>
                          <div className="h-20 border-l border-dashed border-foreground/30 mx-auto mt-2" />
                        </div>
                      )}
                    </div>
                    <span className="mt-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">{day}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Live Activity */}
        <Card className="shadow-sm border-border bg-card rounded-2xl overflow-hidden flex flex-col">
          <CardHeader className="px-6 py-5 border-b border-border bg-muted/30">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Live Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {initialData.recentTransactions.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-muted-foreground opacity-30 italic text-xs">
                <Clock size={32} className="mb-2" />
                No transactions found.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {initialData.recentTransactions.slice(0, 5).map((tx) => (
                  <div key={tx._id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0 shadow-sm ${getAvatarColor(tx.patientName)}`}>
                        {getInitials(tx.patientName)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{tx.patientName}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                          {format(new Date(tx.createdAt), "dd MMM yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-foreground">$ {tx.totalAmount.toLocaleString()}</p>
                      <div className="flex items-center justify-end gap-1.5 mt-0.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${tx.paymentStatus === "PAID" ? "bg-success" : "bg-primary"}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-tight ${tx.paymentStatus === "PAID" ? "text-success" : "text-primary"}`}>
                        {tx.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="p-4 border-t border-border bg-muted/10 mt-auto">
              <Button variant="outline" className="w-full text-xs font-bold border-border bg-card h-9">
                View Full Transaction Ledger
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Audit Log */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/10 flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">System Audit Log</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest border-border bg-card px-3">
              Method <ChevronDown size={12} className="ml-1" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest border-border bg-card px-3">
              Export PDF
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center px-6 py-3 border-b border-border bg-muted/30">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Patient / Client</span>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Amount</span>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Method</span>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</span>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right w-10">...</span>
        </div>

        {initialData.recentTransactions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs italic">
            No billing records found in the database.
          </div>
        ) : (
          initialData.recentTransactions.map((tx) => (
            <div key={tx._id} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center px-6 py-4 hover:bg-muted/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0 ${getAvatarColor(tx.patientName)}`}>
                  {getInitials(tx.patientName)}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{tx.patientName}</p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                    {format(new Date(tx.createdAt), "hh:mm a")} • {tx._id.slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="text-sm font-black text-foreground">$ {tx.totalAmount.toLocaleString()}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{tx.paymentMethod || "UNKNOWN"}</div>
              <div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-tight border ${
                  tx.paymentStatus === "PAID" ? "bg-success/10 text-success border-success/20" : "bg-primary/10 text-primary border-primary/20"
                }`}>
                  <span className={`h-1 w-1 rounded-full ${tx.paymentStatus === "PAID" ? "bg-success" : "bg-primary"}`} />
                  {tx.paymentStatus}
                </span>
              </div>
              <div className="flex justify-end">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreHorizontal size={16} /></Button>
              </div>
            </div>
          ))
        )}

        <div className="px-6 py-4 border-t border-border bg-muted/10">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Clock size={12} /> Database sync: {format(new Date(), "HH:mm:ss")}
          </p>
        </div>
      </div>
    </div>
  );
}
