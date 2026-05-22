"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "../../components/Icon";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Invalid username or password");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          <Icon name="error" size={18} />
          {error}
        </div>
      )}

      <label className="block">
        <span className="mb-1.5 block text-sm font-bold text-on-surface">
          Username
        </span>
        <div className="relative">
          <Icon
            name="person"
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
            autoComplete="username"
            className="h-12 w-full rounded-lg border border-outline bg-surface-muted pl-10 pr-4 text-sm text-on-surface outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-surface-green"
          />
        </div>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-bold text-on-surface">
          Password
        </span>
        <div className="relative">
          <Icon
            name="lock"
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            className="h-12 w-full rounded-lg border border-outline bg-surface-muted pl-10 pr-12 text-sm text-on-surface outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-surface-green"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-primary"
            tabIndex={-1}
          >
            <Icon
              name={showPassword ? "visibility_off" : "visibility"}
              size={18}
            />
          </button>
        </div>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-extrabold text-white shadow-sm transition hover:bg-primary-hover focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Icon name="progress_activity" size={18} className="animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            <Icon name="login" size={18} />
            Sign In
          </>
        )}
      </button>
    </form>
  );
}
