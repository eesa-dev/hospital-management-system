/* Modified by @design-enhancer — Layer 3: Clinical White — Sidebar Visual Design */
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
      <SidebarHeader className="py-4 px-3">
        <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center">
          <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center shrink-0">
            <span className="text-[11px] font-bold text-primary-foreground tracking-tight">
              H
            </span>
          </div>
          <span className="text-sm font-semibold text-foreground tracking-tight group-data-[collapsible=icon]:hidden">
            HMS Portal
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-[10px] tracking-widest uppercase pb-1 font-semibold">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navLinks.map((item) => {
                const isActive =
                  pathname.startsWith(item.href) &&
                  (item.href !== "/dashboard" || pathname === "/dashboard");
                return (
                  <SidebarMenuItem key={item.label} className="mt-2">
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      render={<Link href={item.href} />}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-destructive hover:bg-destructive/8 hover:text-destructive"
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
