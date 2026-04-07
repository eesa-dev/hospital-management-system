import PatientRegistrationForm from "../../../components/forms/PatientRegistrationForm";
import AuthLayout from "../../../components/auth/AuthLayout";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Join the Healthcare Revolution"
      subtitle="Create your patient account or staff profile to experience a new standard in medical care management."
      quote="The art of healing comes from nature, not from the physician. Therefore the physician must start from nature, with an open mind."
      quoteAuthor="Paracelsus"
    >
      <PatientRegistrationForm />
    </AuthLayout>
  );
}
