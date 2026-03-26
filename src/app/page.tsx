import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-24">
        <div className="max-w-3xl text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              Modern Hospital <span className="text-blue-600">Management</span> System
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              A comprehensive digital platform designed to streamline healthcare operations, 
              from seamless patient registration and smart appointment scheduling to 
              integrated medical records and pharmacy management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Patient Care</h3>
              <p className="text-sm text-slate-500">Easily book appointments and access your medical history online.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Doctor Efficiency</h3>
              <p className="text-sm text-slate-500">Manage consultations, prescriptions, and EMR in one unified interface.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Hospital Operations</h3>
              <p className="text-sm text-slate-500">Streamline billing, inventory, and staff management with real-time data.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-48 border-2 border-slate-300 hover:bg-slate-100 font-semibold rounded-lg transition-all">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="py-8 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} HMS - Digital Healthcare Solutions</p>
      </footer>
    </div>
  );
}
