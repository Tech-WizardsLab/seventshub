"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function RegisterForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = fullName.trim();

    if (!normalizedName) {
      setError("Full name is required.");
      return;
    }

    if (!normalizedEmail) {
      setError("Email is required.");
      return;
    }

    if (!password || password.trim().length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setPending(true);

    try {
      const supabase = createBrowserSupabaseClient();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: password.trim(),
        options: {
          data: {
            full_name: normalizedName,
            platform_role: "sponsor",
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.session) {
        router.push("/onboarding");
        router.refresh();
        return;
      }

      setSuccess(
        "Account created. Check your email to confirm your account if confirmation is enabled."
      );
    } catch {
      setError("Something went wrong while creating your account.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-sm font-medium text-slate-700">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Jane Smith"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Work email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="jane@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Minimum 8 characters"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400"
          required
        />
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}