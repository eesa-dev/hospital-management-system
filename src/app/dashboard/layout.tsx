/* Modified by @design-enhancer — Layer 3: Clinical White — Dashboard Layout Shell */
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import CustomSidebar from "../../components/shared/CustomSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role || "PATIENT";

  return (
    <SidebarProvider>
      <TooltipProvider>
        <div className="flex min-h-screen bg-background w-full">
          <CustomSidebar role={role} />
          <main className="flex-1 flex flex-col h-screen overflow-hidden">
            <header className="h-14 bg-card border-b border-border flex items-center px-5 shrink-0 gap-3">
              <SidebarTrigger />
              <div className="h-5 w-px bg-border" />
              <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                {role === "ADMIN" && "Administrator Portal"}
                {role === "DOCTOR" && "Doctor Control Center"}
                {role === "PATIENT" && "Patient Dashboard"}
                {role === "PHARMACY" && "Pharmacy Management"}
              </span>
            </header>
            <div className="flex-1 p-6 overflow-y-auto bg-background">
              {children}
            </div>
          </main>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}
