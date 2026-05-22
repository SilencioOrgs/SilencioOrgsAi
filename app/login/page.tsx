import Link from "next/link";
import { Icon } from "../components/Icon";

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.08 5.08 0 0 1-2.2 3.33v2.75h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.75c-.99.66-2.24 1.07-3.72 1.07-2.86 0-5.29-1.93-6.14-4.51H2.18V17A11 11 0 0 0 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.86 14.15A6.6 6.6 0 0 1 5.52 12c0-.77.12-1.5.34-2.15V7H2.18A11 11 0 0 0 1 12c0 1.81.43 3.51 1.18 5.01l3.68-2.86Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.34c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.05 14.97 1 12 1 7.7 1 3.99 3.39 2.18 7l3.68 2.85C6.71 7.27 9.14 5.34 12 5.34Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-on-surface">
      <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
        <section className="w-full max-w-md rounded-xl border border-outline bg-surface p-6 text-center shadow-sm sm:p-10">
          <Link
            href="/"
            className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-primary text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Back to Silencio Orgs home"
          >
            <Icon name="lock" size={32} filled />
          </Link>

          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-surface-green px-4 py-2 text-sm font-extrabold text-primary">
            <Icon name="schedule" size={17} />
            Login available soon
          </span>
          <h1 className="font-display text-4xl font-extrabold text-on-surface">Silencio Orgs</h1>
          <p className="mt-3 text-lg leading-7 text-muted">
            Guest mode is available now for browsing and copying prompts.
          </p>

          <button
            className="mt-9 inline-flex h-14 w-full cursor-not-allowed items-center justify-center gap-4 rounded-lg border border-outline bg-surface-muted px-4 text-base font-extrabold text-muted opacity-75"
            disabled
            type="button"
          >
            <GoogleMark />
            Google sign-in coming soon
          </button>

          <Link
            href="/dashboard"
            className="mt-3 inline-flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-primary px-4 text-base font-extrabold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-[0.98]"
          >
            <Icon name="person" size={22} />
            Continue as Guest
          </Link>

          <div className="mt-8 border-t border-outline-soft pt-6">
            <p className="mx-auto max-w-xs text-sm font-bold leading-6 text-muted">
              Accounts, saved prompts, and private libraries will arrive in a later update. Guest
              mode keeps prompt copying available today.
            </p>
            <p className="mx-auto mt-4 max-w-xs text-xs font-bold leading-5 text-muted">
              <Link className="text-primary hover:underline" href="/">
                Terms of Service
              </Link>{" "}
              -{" "}
              <Link className="text-primary hover:underline" href="/">
                Privacy Policy
              </Link>
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-outline bg-surface px-5 py-5 text-sm font-bold text-muted sm:px-8">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p>2026 Silencio Orgs. Secure Gateway.</p>
          <nav className="flex flex-wrap gap-x-6 gap-y-3" aria-label="Login footer">
            <Link href="/" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/" className="hover:text-primary">
              Security
            </Link>
            <Link href="/" className="hover:text-primary">
              Contact Support
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
