import LoginForm from "../../../components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md animate-in zoom-in-95 duration-500">
        <LoginForm />
      </div>
    </div>
  );
}
