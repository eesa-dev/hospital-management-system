"use client";

import { Session } from "next-auth";
import { Users, UserPlus, Stethoscope, Activity } from "lucide-react";
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

interface AdminClientProps {
  session: Session | null;
  initialData: any;
}

export default function AdminClient({ session, initialData }: AdminClientProps) {
  // Mock data for the table until we attach MongoDB queries
  const recentActivity = [
    { id: "1", type: "New Patient", detail: "John Doe registered", time: "10 mins ago", status: "Completed" },
    { id: "2", type: "Appointment", detail: "Dr. Smith booked with Jane Roe", time: "1 hour ago", status: "Pending" },
    { id: "3", type: "Pharmacy", detail: "Prescription #892 dispensed", time: "2 hours ago", status: "Completed" },
    { id: "4", type: "System", detail: "Daily backup completed", time: "5 hours ago", status: "Success" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialData.totalPatients || 0}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{initialData.totalDoctors || 0}</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Registrations</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24</div>
            <p className="text-xs text-muted-foreground">in the last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-blue-100 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">System Status</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Active</div>
            <p className="text-xs text-blue-600/80">All services operational</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Data Table Section */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
          <CardDescription>A live log of administrative and user actions across the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.type}</TableCell>
                    <TableCell>{activity.detail}</TableCell>
                    <TableCell>{activity.time}</TableCell>
                    <TableCell className="text-right">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        activity.status === "Completed" || activity.status === "Success" ? "bg-emerald-100 text-emerald-800" 
                        : "bg-amber-100 text-amber-800"
                      }`}>
                        {activity.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
