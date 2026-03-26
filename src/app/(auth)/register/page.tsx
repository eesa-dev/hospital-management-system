import PatientRegistrationForm from "../../../components/forms/PatientRegistrationForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-2xl animate-in zoom-in-95 duration-500">
        <PatientRegistrationForm />
      </div>
    </div>
  );
}
