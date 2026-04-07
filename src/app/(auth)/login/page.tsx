import LoginForm from "../../../components/forms/LoginForm";
import AuthLayout from "../../../components/auth/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Excellence in Healthcare Management"
      subtitle="Access your clinical dashboard to manage patients, prescriptions, and pharmacy inventory with precision."
    >
      <LoginForm />
    </AuthLayout>
  );
}
