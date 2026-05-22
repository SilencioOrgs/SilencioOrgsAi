import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login — Silencio Orgs",
  description: "Login to the Silencio Orgs admin panel.",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-primary text-2xl font-extrabold text-white shadow-lg shadow-primary/20">
            SO
          </div>
          <h1 className="font-display text-2xl font-extrabold text-on-surface">
            Silencio Orgs
          </h1>
          <p className="mt-1 text-sm text-muted">Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-outline bg-surface p-8 shadow-sm">
          <h2 className="mb-1 text-lg font-extrabold text-on-surface">
            Welcome back
          </h2>
          <p className="mb-6 text-sm text-muted">
            Sign in to manage your prompts and content.
          </p>
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} Silencio Orgs. All rights reserved.
        </p>
      </div>
    </div>
  );
}
