import Link from "next/link";
import { Icon } from "./components/Icon";

const services = [
  {
    icon: "psychology",
    title: "AI Prompt Generation",
    body: "One-tap prompts tailored for TikTok product videos, reviews, and affiliate showcases.",
  },
  {
    icon: "movie_edit",
    title: "Video Script Templates",
    body: "Ready-to-use scripts tuned for hooks, CTAs, product demos, and short-form transitions.",
  },
  {
    icon: "imagesmode",
    title: "Affiliate Image Prompts",
    body: "Curated image prompts for product visuals, lifestyle scenes, and creator-ready shots.",
  },
];

const reasons = [
  {
    icon: "diamond",
    title: "Bespoke Prompt Packs",
    body: "Prompt collections organized by niche, offer type, and TikTok buying intent.",
  },
  {
    icon: "support_agent",
    title: "Creator Support",
    body: "Simple guidance for choosing prompts, adapting hooks, and shipping content faster.",
  },
  {
    icon: "lock",
    title: "Instant Access",
    body: "A front-end prompt vault experience built for quick browsing, copying, and testing.",
  },
];

const testimonials = [
  {
    name: "Errandeo Services",
    quote:
      "Silencio Orgs changed how we create TikTok content. The prompts are specific, ready to use, and helped us publish faster.",
  },
  {
    name: "Sandrine Logistics",
    quote:
      "We used to spend hours writing scripts. Now we start from a prompt and get product videos ready in minutes.",
  },
  {
    name: "Haligi Realty",
    quote:
      "The prompt structure helped us showcase offers in a way that is clearer, faster, and easier to repeat.",
  },
];

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Prompts" },
  { href: "#solutions", label: "Solutions" },
  { href: "#why-us", label: "About Us" },
  { href: "#contact", label: "Contact" },
];

function Brand() {
  return (
    <Link className="flex items-center gap-3" href="/" aria-label="Silencio Orgs home">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface-green text-primary">
        <Icon name="auto_awesome" size={22} filled />
      </span>
      <span className="font-display text-lg font-bold text-on-surface sm:text-xl">Silencio Orgs</span>
    </Link>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-outline-soft bg-surface/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-5 py-4 sm:px-8">
        <Brand />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              className="border-b-2 border-transparent pb-1 text-sm font-semibold text-muted transition-colors hover:border-primary hover:text-primary"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-[0.98]"
          >
            <Icon name="content_copy" size={18} />
            Copy Prompts Now
          </Link>
        </div>

        <details className="group relative md:hidden">
          <summary className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-lg border border-outline-soft bg-surface text-muted transition hover:border-primary hover:text-primary [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Open navigation</span>
            <Icon name="menu" size={24} />
          </summary>
          <div className="absolute right-0 mt-3 w-64 rounded-lg border border-outline-soft bg-surface p-3 shadow-xl">
            <nav className="grid gap-1" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  className="rounded-lg px-3 py-3 text-sm font-semibold text-muted transition hover:bg-surface-muted hover:text-primary"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white"
                href="/dashboard"
              >
                <Icon name="content_copy" size={18} />
                Copy Prompts Now
              </Link>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}

function HeroPreview() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#b8d9c0] bg-surface-green p-4 shadow-sm sm:p-6">
      <div className="dashboard-grid absolute inset-0 opacity-70" />
      <div className="relative mx-auto max-w-md rounded-lg border border-outline-soft bg-surface p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-bold text-white">
              SO
            </span>
            <div>
              <p className="text-sm font-bold text-on-surface">@silencioorgs</p>
              <p className="text-xs text-muted">Fashion Drop - 2h ago</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-green px-3 py-1 text-xs font-bold text-primary">
            <Icon name="trending_up" size={14} filled />
            Trending
          </span>
        </div>
        <div className="mb-4 min-h-40 rounded-lg border border-outline-soft bg-[#eaf8ef] p-4">
          <div className="flex h-32 flex-col justify-end rounded-lg bg-white/60 p-4">
            <span className="mb-2 h-2 w-24 rounded-full bg-primary/40" />
            <span className="mb-2 h-2 w-40 rounded-full bg-primary/25" />
            <span className="h-2 w-32 rounded-full bg-primary/20" />
          </div>
        </div>
        <div className="rounded-lg border border-outline-soft bg-surface-muted p-4">
          <p className="text-sm leading-6 text-on-surface">
            Create a candid TikTok product scene with natural light, strong hook framing, and a
            creator-ready visual style.
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span className="text-sm font-bold text-primary">Guest preview</span>
          <span className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 font-bold text-white">
            <Icon name="content_copy" size={16} />
            Copy
          </span>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ kicker, title }: { kicker?: string; title: string }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
      {kicker ? <p className="mb-3 text-sm font-bold uppercase text-primary">{kicker}</p> : null}
      <h2 className="font-display text-3xl font-extrabold leading-tight text-on-surface sm:text-4xl">
        {title}
      </h2>
      <span className="mx-auto mt-5 block h-1 w-16 rounded-full bg-primary" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Header />

      <main>
        <section className="mx-auto grid w-full max-w-[1280px] gap-10 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-outline-soft bg-surface-green px-4 py-2 text-sm font-bold text-primary">
              <Icon name="bolt" size={17} filled />
              Built for TikTok AI affiliates
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-[1.08] text-on-surface sm:text-5xl lg:text-6xl">
              Made for <span className="text-primary">TikTok AI</span> Affiliates
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              Copy, paste, and create. Ready-to-use prompts for AI image and video generation,
              shaped for creators who need affiliate content fast.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex h-[52px] items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-bold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-[0.98]"
              >
                <Icon name="content_copy" size={20} />
                Copy Prompts Now
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-[52px] items-center justify-center gap-2 rounded-lg border border-primary px-6 text-base font-bold text-primary transition hover:bg-surface-green focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-[0.98]"
              >
                <Icon name="explore" size={20} />
                View Dashboard
              </Link>
            </div>
          </div>

          <HeroPreview />
        </section>

        <section id="solutions" className="bg-surface-muted py-16 md:py-24">
          <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="overflow-hidden rounded-xl border border-outline-soft bg-surface-green p-4">
              <div className="aspect-video rounded-lg border border-[#b8d9c0] bg-surface/65 p-5">
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-white">
                      <Icon name="smart_display" size={24} />
                    </span>
                    <div className="h-3 w-32 rounded-full bg-primary/35" />
                  </div>
                  <div className="grid gap-3">
                    <span className="h-3 w-5/6 rounded-full bg-primary/30" />
                    <span className="h-3 w-2/3 rounded-full bg-primary/20" />
                    <span className="h-3 w-4/5 rounded-full bg-primary/25" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-3xl font-extrabold leading-tight text-on-surface sm:text-4xl lg:text-5xl">
                Custom Prompt Solutions? <span className="text-primary">Count on us.</span>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
                We curate AI prompts built for TikTok creators and affiliates. Product showcases,
                lifestyle scripts, short-form scenes, and content templates are ready when you are.
              </p>
              <Link
                href="/dashboard"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-lg border border-primary px-6 font-bold text-primary transition hover:bg-surface-green focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-[0.98]"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 md:py-24">
          <SectionHeading title="What We Can Do For You" />
          <div className="grid gap-5 md:grid-cols-3 md:gap-6">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-lg border border-outline-soft bg-surface p-6 text-center shadow-sm transition hover:border-[#b8d9c0] hover:shadow-md sm:p-8"
              >
                <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-lg bg-surface-green text-primary">
                  <Icon name={service.icon} size={30} />
                </div>
                <h3 className="font-display text-lg font-bold text-on-surface">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{service.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="why-us" className="bg-surface-muted py-16 md:py-24">
          <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
            <SectionHeading title="Why Us" />
            <div className="grid gap-5 md:grid-cols-3 md:gap-6">
              {reasons.map((reason) => (
                <article
                  key={reason.title}
                  className="rounded-lg border border-outline-soft bg-surface p-6 text-center shadow-sm sm:p-8"
                >
                  <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-surface-green text-primary">
                    <Icon name={reason.icon} size={26} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-on-surface">{reason.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{reason.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary px-5 py-16 text-center text-white md:py-24">
          <div className="mx-auto max-w-4xl">
            <Icon name="format_quote" size={56} className="mx-auto mb-6 text-white/65" />
            <p className="font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              The fastest way to create scroll-stopping TikTok content: copy, paste, and grow.
            </p>
            <div className="mx-auto mt-8 h-1 w-16 rounded-full bg-white/35" />
            <p className="mt-6 text-sm font-bold uppercase text-white/90">
              Silencio Orgs, built for creators
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 md:py-24">
          <SectionHeading title="Client Feedback" />
          <div className="grid gap-5 md:grid-cols-3 md:gap-6">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="rounded-lg border border-outline-soft bg-surface p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-lg bg-surface-green text-primary">
                  <Icon name="person" size={22} />
                </div>
                <h3 className="font-display font-bold text-on-surface">{testimonial.name}</h3>
                <p className="mt-3 text-sm italic leading-6 text-muted">
                  &quot;{testimonial.quote}&quot;
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-outline-soft bg-surface">
        <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold text-primary">Let us help you.</h2>
            <p className="mt-3 text-muted">Reach out for an exploratory conversation.</p>
            <Link
              href="mailto:hello@silencioorgs.com"
              className="mt-6 inline-flex h-11 items-center rounded-lg border border-outline-soft px-5 font-bold text-on-surface transition hover:border-primary hover:text-primary"
            >
              Contact Us
            </Link>
          </div>
          <div className="grid gap-4 md:justify-items-end">
            <a className="inline-flex items-center gap-3 text-muted hover:text-primary" href="tel:+10123456789">
              <Icon name="call" size={20} />
              (012) 345-6789
            </a>
            <a
              className="inline-flex items-center gap-3 text-muted hover:text-primary"
              href="mailto:hello@silencioorgs.com"
            >
              <Icon name="mail" size={20} />
              hello@silencioorgs.com
            </a>
          </div>
          <div className="border-t border-outline-soft pt-6 text-sm text-muted md:col-span-2 md:flex md:items-center md:justify-between">
            <p>2026 Silencio Orgs. Built for TikTok AI creators.</p>
            <div className="mt-4 flex flex-wrap gap-5 md:mt-0">
              <Link href="/login" className="hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/login" className="hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/dashboard" className="hover:text-primary">
                Creator Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
