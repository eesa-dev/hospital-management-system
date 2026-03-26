import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Calendar, 
  Stethoscope, 
  Activity, 
  CalendarPlus, 
  Receipt,
  Pill
} from "lucide-react";

export const ADMIN_NAV = [
  { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Manage Staff", href: "/dashboard/admin/staff", icon: Users },
  { label: "Finances", href: "/dashboard/admin/finances", icon: Wallet },
];

export const DOCTOR_NAV = [
  { label: "My Schedule", href: "/dashboard/doctor", icon: Calendar },
  { label: "Appointments", href: "/dashboard/doctor/appointments", icon: Stethoscope },
  { label: "Patients", href: "/dashboard/doctor/patients", icon: Users },
];

export const PATIENT_NAV = [
  { label: "My Health", href: "/dashboard/patient", icon: Activity },
  { label: "Book Appointment", href: "/dashboard/patient/appointments/book", icon: CalendarPlus },
  { label: "My Bills", href: "/dashboard/patient/bills", icon: Receipt },
];

export const PHARMACY_NAV = [
  { label: "Inventory", href: "/dashboard/pharmacy", icon: Pill },
  { label: "Prescriptions", href: "/dashboard/pharmacy/prescriptions", icon: Stethoscope },
];
