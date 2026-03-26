"use client";

import { 
  Users, 
  Activity, 
  Clock, 
  ArrowUpRight,
  TrendingUp,
  MoreVertical,
  Calendar,
  ShieldCheck,
  Plus,
  ArrowRight
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

interface ActivityLogItem {
  id: string;
  type: string;
  detail: string;
  time: string | Date;
  status: string;
}

interface AdminData {
  totalPatients?: number;
  totalDoctors?: number;
  newRegistrations24h?: number;
  activityLog?: ActivityLogItem[];
}

interface AdminClientProps {
  initialData: AdminData;
}

export default function AdminClient({ initialData }: AdminClientProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const activityLog = initialData.activityLog || [];

  return (
    <div className="space-y-8 animate-fade-in max-w-(--breakpoint-2xl) mx-auto">
      
      {/* Page Header — Ref: admin-dashboard.png */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            System Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor hospital operations, registrations, and system health.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-card shadow-sm border-border hover:bg-muted font-semibold">
            <Plus className="mr-2 h-4 w-4" /> Export Data
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20">
            <Activity className="mr-2 h-4 w-4" /> Live Monitor
          </Button>
        </div>
      </div>

      {/* Metrics Row — Ref: admin-dashboard.png style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Patients — Highlighted Card */}
        <Card className="shadow-lg border-primary/20 bg-primary text-primary-foreground relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <Users size={80} strokeWidth={1} />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider opacity-80">Total Patients</CardTitle>
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowUpRight size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold">{initialData.totalPatients || 0}</div>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold bg-white/20 w-fit px-2 py-1 rounded-md">
              <TrendingUp size={12} />
              <span>Increased from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border bg-card hover:border-primary/50 transition-colors relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Doctors</CardTitle>
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <ArrowUpRight size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-foreground">{initialData.totalDoctors || 0}</div>
            <p className="mt-4 text-xs font-medium text-success flex items-center gap-1">
              <TrendingUp size={12} /> 2+ Active Today
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border bg-card hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">New Requests</CardTitle>
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <ArrowUpRight size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-foreground">+{initialData.newRegistrations24h || 0}</div>
            <p className="mt-4 text-xs font-medium text-muted-foreground">Registrations in 24h</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-card hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">System Health</CardTitle>
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <ArrowUpRight size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-primary">Active</div>
            <p className="mt-4 text-xs font-medium text-success flex items-center gap-1">
              <ShieldCheck size={12} /> All nodes online
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Areas — Ref: admin-dashboard.png layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Activity Log — Ref: Team Collaboration / Last Orders style */}
        <Card className="lg:col-span-2 shadow-sm border-border bg-card rounded-2xl overflow-hidden flex flex-col">
          <CardHeader className="px-6 py-5 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">System Activity</CardTitle>
                <CardDescription>Track real-time actions across the platform.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary font-semibold hover:bg-primary/10">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            {activityLog.length === 0 ? (
              <div className="h-64 flex flex-col justify-center items-center text-muted-foreground">
                <Clock className="h-10 w-10 opacity-15 mb-3" />
                <p>No recent system activity recorded.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {activityLog.map((activity) => {
                  const typeStyles: Record<string, string> = {
                    Registration: "bg-info/10 text-info border-info/20",
                    Appointment: "bg-success/10 text-success border-success/20",
                    Pharmacy: "bg-warning/10 text-warning border-warning/20",
                  };
                  
                  return (
                    <div key={activity.id} className="group px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0 border border-border group-hover:border-primary/50 transition-colors">
                          <Activity size={18} className="group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{activity.detail}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${typeStyles[activity.type] || "bg-muted text-muted-foreground border-border"}`}>
                              {activity.type}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                              <Clock size={10} />
                              {mounted ? formatDistanceToNow(new Date(activity.time), { addSuffix: true }) : "Loading..."}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight uppercase border ${
                          activity.status === "Success" || activity.status === "Completed" ? "bg-success/10 text-success border-success/30" 
                          : activity.status === "Alert" ? "bg-destructive/10 text-destructive border-destructive/30"
                          : "bg-warning/10 text-warning border-warning/30"
                        }`}>
                          {activity.status}
                        </span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <MoreVertical size={16} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Side Panel Visuals — Ref: admin-dashboard.png reminders/tracker */}
        <div className="space-y-8">
          
          {/* Quick Stats Placeholder Visual */}
          <Card className="shadow-sm border-border bg-card rounded-2xl overflow-hidden">
            <CardHeader className="px-6 py-5 border-b border-border bg-muted/30">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Operation Load</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-center py-4">
                <div className="relative h-32 w-32">
                   {/* Simplified Gauge Placeholder */}
                   <div className="absolute inset-0 rounded-full border-8 border-muted" />
                   <div className="absolute inset-0 rounded-full border-8 border-primary border-r-transparent border-b-transparent rotate-45" />
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-2xl font-black text-foreground">84%</span>
                     <span className="text-[9px] font-bold uppercase text-muted-foreground tracking-tighter">Normal</span>
                   </div>
                </div>
              </div>
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Database Sync</span>
                  <span className="font-bold text-success">Optimized</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[84%]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Reminders */}
          <Card className="shadow-sm border-border bg-card rounded-2xl overflow-hidden">
             <div className="p-6 bg-success text-success-foreground relative overflow-hidden group">
               <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:rotate-12 transition-transform">
                 <Calendar size={120} strokeWidth={1} />
               </div>
               <h3 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Upcoming Event</h3>
               <p className="text-xl font-black mb-1">Weekly Staff Sync</p>
               <p className="text-sm opacity-90 mb-6 flex items-center gap-2 font-medium">
                 <Clock size={14} /> 02:00 pm - 03:00 pm
               </p>
               <Button className="w-full bg-white text-success hover:bg-white/90 font-bold">
                 Join Meeting
               </Button>
             </div>
          </Card>

        </div>

      </div>

    </div>
  );
}
