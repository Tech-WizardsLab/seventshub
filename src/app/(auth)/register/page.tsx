import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
        <p className="mt-2 text-sm text-slate-600">
          Start your sponsor account. We&apos;ll guide you into sponsorship strategy setup next.
        </p>

        <div className="mt-6">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}