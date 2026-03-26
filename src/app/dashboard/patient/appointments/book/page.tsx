import { auth } from "../../../../../auth";
import BookAppointmentClient from "./book-client";
import connectDB from "../../../../../lib/db";
import { Doctors } from "../../../../../models/Doctors";
import { redirect } from "next/navigation";

export default async function BookAppointmentPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectDB();

  // Fetch all doctors from the DB to populate the picker
  const doctors = await Doctors.find({}).sort({ name: 1 });

  return (
    <div className="space-y-6 p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Medical Appointments</h1>
        <p className="text-slate-500 mt-1">Book a session with one of our specialized healthcare professionals.</p>
      </header>

      <BookAppointmentClient doctors={JSON.parse(JSON.stringify(doctors))} />
    </div>
  );
}
