/* Modified by @design-enhancer — Layer 3: Clinical White — Auth Page Wrapper */
import LoginForm from "../../../components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm animate-scale-in">
        <LoginForm />
      </div>
    </div>
  );
}
