import Link from "next/link";
import { Icon } from "./components/Icon";

/* ─── Data ─────────────────────────────────────────────────── */

const steps = [
  {
    icon: "cloud_upload",
    title: "Upload Your Product Photo",
    body: "Snap or upload any product image — our AI handles the rest automatically.",
  },
  {
    icon: "auto_awesome",
    title: "AI Analyzes & Crafts Prompt",
    body: "Gemini AI studies your product, lighting, and style to build a cinema-grade prompt.",
  },
  {
    icon: "content_copy",
    title: "Copy & Paste Into Any AI Tool",
    body: "Paste your prompt into Sora, Kling, Luma, Runway Gen-3, or Pika and generate.",
  },
];

const features = [
  {
    icon: "movie_edit",
    title: "Cinematic Video Prompts",
    body: "UHD 4K, 60FPS, bokeh, handheld camera movement — every detail described automatically.",
    accent: "from-emerald-500/10 to-green-400/5",
  },
  {
    icon: "imagesmode",
    title: "Product Image Prompts",
    body: "Luxury editorial, studio, lifestyle — AI-tuned prompts for jaw-dropping product visuals.",
    accent: "from-teal-500/10 to-emerald-400/5",
  },
  {
    icon: "bolt",
    title: "Instant TikTok Content",
    body: "Ready-to-use scripts and hooks optimized for affiliate videos and TikTok Shop creators.",
    accent: "from-green-400/10 to-teal-400/5",
  },
  {
    icon: "psychology",
    title: "Gemini AI Powered",
    body: "Google's most advanced multimodal AI reads your image and generates elite-level prompts.",
    accent: "from-emerald-600/10 to-green-500/5",
  },
];

const tools = [
  "Sora",
  "Kling AI",
  "Luma Dream Machine",
  "Runway Gen-3",
  "Pika Labs",
  "MidJourney",
  "DALL-E 3",
];

const testimonials = [
  {
    name: "Errandeo Services",
    role: "TikTok Affiliate Creator",
    quote:
      "I uploaded one photo and got a prompt that produced a cinematic video I never could have written myself. This is insane.",
    stars: 5,
  },
  {
    name: "Sandrine Logistics",
    role: "E-commerce Brand",
    quote:
      "We used to spend hours writing prompts. Now we snap a photo, copy the output, and our product video is done in minutes.",
    stars: 5,
  },
  {
    name: "Haligi Realty",
    role: "Content Creator",
    quote:
      "The quality of prompts is unlike anything I have used before. Cinematic, detailed, and actually works on first try.",
    stars: 5,
  },
];

/* ─── Components ──────────────────────────────────────────── */

function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-outline-soft bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5" aria-label="Silencio Orgs home">
          <img src="/assets/logo.png" alt="Silencio Orgs Logo" className="h-9 w-9 object-contain" />
          <span className="font-display text-lg font-extrabold text-on-surface">Silencio Orgs</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {[
            { href: "#how-it-works", label: "How It Works" },
            { href: "#features", label: "Features" },
            { href: "#demo", label: "Demo" },
            { href: "/generate", label: "Prompts" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-semibold text-muted transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/generate"
            className="hidden h-10 items-center gap-2 rounded-xl border border-primary px-4 text-sm font-bold text-primary transition hover:bg-surface-green md:inline-flex"
          >
            Try Free
          </Link>
          <Link
            href="/generate"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover active:scale-[0.98]"
          >
            <Icon name="content_copy" size={16} />
            <span className="hidden sm:inline">Browse Prompts</span>
            <span className="sm:hidden">Prompts</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Icon key={i} name="star" size={14} className="text-amber-400" filled />
      ))}
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <NavBar />

      <main>
        {/* ═══════════════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          {/* Glow backdrop */}
          <div className="hero-glow pointer-events-none absolute inset-0" />
          {/* Grid pattern */}
          <div className="dashboard-grid pointer-events-none absolute inset-0 opacity-30" />

          <div className="relative mx-auto w-full max-w-[1200px] px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:pb-28 lg:pt-24">
            {/* Badge */}
            <div className="animate-fade-up flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface-green px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-primary">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                Powered by Google Gemini AI · Free to Try
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up-2 mx-auto mt-6 max-w-3xl text-center font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-on-surface sm:text-5xl lg:text-6xl">
              Turn Any Product Photo Into a{" "}
              <span className="text-shimmer">Cinema-Grade</span>
              {" "}Video Prompt
            </h1>

            {/* Sub */}
            <p className="animate-fade-up-3 mx-auto mt-5 max-w-xl text-center text-base leading-7 text-muted sm:text-lg sm:leading-8">
              Upload your product image. Gemini AI generates the perfect prompt.
              Paste it into Sora, Kling, or Runway and get a stunning video — instantly.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-up-4 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/generate"
                className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 text-base font-extrabold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-hover active:scale-[0.98] sm:w-auto"
                style={{ height: 52 }}
              >
                <Icon name="auto_awesome" size={20} filled />
                Generate My Prompt — Free
              </Link>
              <Link
                href="/generate"
                className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl border border-outline bg-surface px-8 text-base font-bold text-muted transition hover:border-primary hover:text-primary sm:w-auto"
                style={{ height: 52 }}
              >
                <Icon name="storefront" size={20} />
                Browse Prompt Library
              </Link>
            </div>

            {/* Trust strip */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-muted">
              {["No sign-up required", "100% free to try", "Works with 7+ AI video tools"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <Icon name="check_circle" size={14} className="text-primary" filled />
                  {item}
                </span>
              ))}
            </div>

            {/* ── Hero Video Showcase ── */}
            <div id="demo" className="mt-14 sm:mt-16">
              <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-outline bg-[#0a0f1a] shadow-2xl card-glow">
                {/* Frame header */}
                <div className="flex items-center justify-between gap-4 border-b border-white/8 px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-3">
                    {/* Mac-style dots */}
                    <div className="flex gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-red-400/70" />
                      <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
                      <span className="h-3 w-3 rounded-full bg-green-400/70" />
                    </div>
                    <span className="text-xs font-bold text-white/40">silencioorgs.com / generate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-primary">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                      Live Result
                    </span>
                  </div>
                </div>

                {/* GIF */}
                <div className="relative">
                  <img
                    src="/products/Ultra_realistic_cinematic_nighttime_product_s.gif"
                    alt="Ultra-realistic cinematic nighttime product showcase — generated by AI prompt"
                    className="w-full object-cover"
                    style={{ maxHeight: 480 }}
                  />
                  {/* Overlay gradient at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0f1a] to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs font-bold text-white/60">Prompt used →</p>
                      <p className="mt-0.5 max-w-xs truncate text-xs text-white/40">
                        Ultra realistic cinematic nighttime product showcase…
                      </p>
                    </div>
                    <span className="shrink-0 rounded bg-black/50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-white/70 backdrop-blur-sm">
                      GIF Preview
                    </span>
                  </div>
                </div>

                {/* Prompt strip */}
                <div className="border-t border-white/8 px-4 py-4 sm:px-5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/20 text-primary">
                      <Icon name="auto_awesome" size={16} filled />
                    </div>
                    <p className="flex-1 truncate text-xs leading-relaxed text-white/50">
                      Ultra realistic cinematic nighttime product showcase · UHD 4K · 60FPS · iPhone 15 Pro · urban bokeh · premium skincare commercial aesthetic…
                    </p>
                    <Link
                      href="/generate"
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-extrabold text-white transition hover:bg-primary-hover"
                    >
                      <Icon name="add_photo_alternate" size={14} />
                      Try with your product
                    </Link>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="mt-3 text-center text-xs text-muted">
                ✨ This GIF shows the visual target standard. Results vary by AI video tool chosen.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            HOW IT WORKS
        ═══════════════════════════════════════════════════ */}
        <section id="how-it-works" className="border-y border-outline-soft bg-surface-muted py-16 sm:py-20 lg:py-24">
          <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-xl text-center">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-primary">How It Works</p>
              <h2 className="font-display text-3xl font-extrabold text-on-surface sm:text-4xl">
                From photo to viral video in{" "}
                <span className="text-primary">3 steps</span>
              </h2>
            </div>

            <div className="mx-auto max-w-lg space-y-0">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className={`relative flex gap-5 pb-8 ${i < steps.length - 1 ? "step-connector" : ""}`}
                >
                  {/* Circle + icon */}
                  <div className="shrink-0">
                    <div className="relative grid h-10 w-10 place-items-center rounded-full border-2 border-primary bg-surface text-primary shadow-sm">
                      <Icon name={step.icon} size={19} filled />
                    </div>
                  </div>
                  {/* Text */}
                  <div className="pt-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Step {i + 1}</p>
                    <h3 className="mt-1 font-display text-base font-extrabold text-on-surface sm:text-lg">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mini CTA */}
            <div className="mt-10 flex justify-center">
              <Link
                href="/generate"
                className="inline-flex h-12 items-center gap-2 rounded-2xl bg-primary px-7 text-sm font-extrabold text-white shadow-md shadow-primary/20 transition hover:bg-primary-hover active:scale-[0.98]"
              >
                <Icon name="auto_awesome" size={18} filled />
                Start With Your Product Photo
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            FEATURES
        ═══════════════════════════════════════════════════ */}
        <section id="features" className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-xl text-center">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-primary">Features</p>
              <h2 className="font-display text-3xl font-extrabold text-on-surface sm:text-4xl">
                Everything you need to create{" "}
                <span className="text-primary">premium content</span>
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feat) => (
                <article
                  key={feat.title}
                  className={`group relative overflow-hidden rounded-2xl border border-outline-soft bg-gradient-to-br ${feat.accent} p-5 transition hover:border-primary hover:shadow-lg sm:p-6`}
                >
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl border border-outline-soft bg-surface text-primary shadow-sm transition group-hover:bg-surface-green group-hover:border-primary/20">
                    <Icon name={feat.icon} size={24} filled />
                  </div>
                  <h3 className="font-display text-sm font-extrabold text-on-surface sm:text-base">{feat.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{feat.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            COMPATIBLE TOOLS
        ═══════════════════════════════════════════════════ */}
        <section className="border-y border-outline-soft bg-surface py-12">
          <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
            <p className="mb-6 text-center text-xs font-extrabold uppercase tracking-widest text-muted">
              Works seamlessly with
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-outline-soft bg-surface-muted px-4 py-2 text-sm font-bold text-muted transition hover:border-primary hover:text-primary"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            TESTIMONIALS
        ═══════════════════════════════════════════════════ */}
        <section className="bg-surface-muted py-16 sm:py-20 lg:py-24">
          <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-xl text-center">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-primary">Testimonials</p>
              <h2 className="font-display text-3xl font-extrabold text-on-surface sm:text-4xl">
                Creators love the results
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {testimonials.map((t) => (
                <article
                  key={t.name}
                  className="rounded-2xl border border-outline-soft bg-surface p-5 shadow-sm transition hover:shadow-md sm:p-6"
                >
                  <StarRating count={t.stars} />
                  <p className="mt-4 text-sm italic leading-7 text-muted">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-5 flex items-center gap-3 border-t border-outline-soft pt-4">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-green text-sm font-extrabold text-primary">
                      {t.name[0]}
                    </span>
                    <div>
                      <p className="text-sm font-extrabold text-on-surface">{t.name}</p>
                      <p className="text-xs text-muted">{t.role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            FINAL CTA BANNER
        ═══════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-primary py-16 sm:py-20">
          {/* Radial glow */}
          <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(255,255,255,0.07) 0%, transparent 70%)" }} />
          <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
            <p className="text-xs font-extrabold uppercase tracking-widest text-white/60">Start Now</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
              Your product deserves a cinematic spotlight.
            </h2>
            <p className="mt-5 text-base leading-7 text-white/70">
              Upload one photo and get a cinema-grade AI video prompt in seconds.
              No sign-up. No credit card. Completely free to start.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/generate/generate"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-sm font-extrabold text-primary shadow-lg transition hover:bg-surface-green active:scale-[0.98] sm:w-auto"
              >
                <Icon name="auto_awesome" size={18} filled />
                Generate My Free Prompt
              </Link>
              <Link
                href="/generate"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/30 px-8 py-3.5 text-sm font-bold text-white transition hover:border-white/60 hover:bg-white/10 sm:w-auto"
              >
                <Icon name="storefront" size={18} />
                Browse Prompt Library
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════ */}
      <footer id="contact" className="border-t border-outline-soft bg-surface">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-2.5">
                <img src="/assets/logo.png" alt="Silencio Orgs Logo" className="h-9 w-9 object-contain" />
                <span className="font-display text-lg font-extrabold text-on-surface">Silencio Orgs</span>
              </Link>
              <p className="mt-3 max-w-xs text-sm leading-6 text-muted">
                AI-powered prompt generation for TikTok creators, affiliates, and e-commerce brands.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-8 text-sm">
              <div className="space-y-3">
                <p className="font-extrabold uppercase tracking-widest text-xs text-muted">Product</p>
                {[
                  { href: "/generate/generate", label: "Generate Prompt" },
                  { href: "/generate", label: "Prompt Library" },
                ].map((l) => (
                  <Link key={l.label} href={l.href} className="block text-muted transition hover:text-primary">
                    {l.label}
                  </Link>
                ))}
              </div>
              <div className="space-y-3">
                <p className="font-extrabold uppercase tracking-widest text-xs text-muted">Company</p>
                {[
                  { href: "mailto:hello@silencioorgs.com", label: "Contact Us" },
                  { href: "/login", label: "Privacy Policy" },
                  { href: "/login", label: "Terms of Service" },
                ].map((l) => (
                  <Link key={l.label} href={l.href} className="block text-muted transition hover:text-primary">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-col gap-2 border-t border-outline-soft pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Silencio Orgs. Built for TikTok AI creators.</p>
            <div className="flex items-center gap-4">
              <a href="tel:+10123456789" className="flex items-center gap-1.5 hover:text-primary transition">
                <Icon name="call" size={14} />
                (012) 345-6789
              </a>
              <a href="mailto:hello@silencioorgs.com" className="flex items-center gap-1.5 hover:text-primary transition">
                <Icon name="mail" size={14} />
                hello@silencioorgs.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
