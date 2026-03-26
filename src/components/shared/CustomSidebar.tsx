"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ADMIN_NAV,
  DOCTOR_NAV,
  PATIENT_NAV,
  PHARMACY_NAV,
} from "../../constants";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function CustomSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  let navLinks = PATIENT_NAV;
  if (role === "ADMIN") navLinks = ADMIN_NAV;
  if (role === "DOCTOR") navLinks = DOCTOR_NAV;
  if (role === "PHARMACY") navLinks = PHARMACY_NAV;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <h2 className="text-xl font-bold tracking-wider uppercase text-center text-blue-600">
          HMS
        </h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 pb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navLinks.map((item) => {
                const isActive =
                  pathname.startsWith(item.href) &&
                  (item.href !== "/dashboard" || pathname === "/dashboard");
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
              tooltip="Logout"
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
