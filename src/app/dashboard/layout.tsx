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

  const role = (session.user as any).role || "PATIENT";

  return (
    <SidebarProvider>
      <TooltipProvider>
        <div className="flex min-h-screen bg-slate-50 w-full">
          <CustomSidebar role={role as string} />
          <main className="flex-1 flex flex-col h-screen overflow-hidden">
            <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 shadow-sm shrink-0 gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold text-slate-800">
                {role === "ADMIN" && "Administrator Portal"}
                {role === "DOCTOR" && "Doctor Control Center"}
                {role === "PATIENT" && "Patient Dashboard"}
                {role === "PHARMACY" && "Pharmacy Management"}
              </h1>
            </header>
            <div className="flex-1 p-8 overflow-y-auto">
              {children}
            </div>
          </main>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}
