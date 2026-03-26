/* Modified by @design-enhancer — Layer 3: Clinical White — Register Page Wrapper */
import PatientRegistrationForm from "../../../components/forms/PatientRegistrationForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg animate-scale-in">
        <PatientRegistrationForm />
      </div>
    </div>
  );
}
