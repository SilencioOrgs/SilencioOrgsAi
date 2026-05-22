"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Icon } from "../components/Icon";
import type { Prompt } from "../../lib/types";

type PromptKind = "image" | "video";
type PromptMode = "background" | "product" | "persona";

const categories = [
  { icon: "widgets", name: "All" },
  { icon: "checkroom", name: "Fashion" },
  { icon: "face", name: "Beauty" },
  { icon: "home", name: "Home" },
  { icon: "devices", name: "Tech" },
  { icon: "fitness_center", name: "Fitness" },
];

const promptModes: Array<{
  icon: string;
  label: string;
  value: PromptMode;
}> = [
  { icon: "wallpaper", label: "Change Background Prompt", value: "background" },
  { icon: "inventory_2", label: "Change Product Prompt", value: "product" },
  { icon: "person_edit", label: "Change Persona Prompt", value: "persona" },
];

function getPromptContent(
  prompt: Prompt,
  kind: PromptKind,
  mode: PromptMode,
): string {
  const match = prompt.prompt_modes.find(
    (pm) => pm.kind === kind && pm.mode === mode,
  );
  return match?.content ?? "";
}

function Tag({ prompt }: { prompt: Prompt }) {
  const className =
    prompt.tag_tone === "yellow"
      ? "border border-yellow-200 bg-warning-surface text-warning"
      : "bg-surface-green text-primary";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${className}`}>
      <Icon name={prompt.tag_icon} size={14} filled />
      {prompt.tag}
    </span>
  );
}

function PromptCard({
  copiedId,
  imageMode,
  kind,
  onCopy,
  onImageModeChange,
  onKindChange,
  onVideoModeChange,
  prompt,
  videoMode,
}: {
  copiedId: string | null;
  imageMode: PromptMode;
  kind: PromptKind;
  onCopy: (text: string, id: string) => void;
  onImageModeChange: (mode: PromptMode) => void;
  onKindChange: (kind: PromptKind) => void;
  onVideoModeChange: (mode: PromptMode) => void;
  prompt: Prompt;
  videoMode: PromptMode;
}) {
  const currentImagePrompt = getPromptContent(prompt, "image", imageMode);
  const currentVideoPrompt = getPromptContent(prompt, "video", videoMode);
  const activeMode = kind === "image" ? imageMode : videoMode;
  const promptText = kind === "image" ? currentImagePrompt : currentVideoPrompt;
  const selectedPromptMode = promptModes.find((mode) => mode.value === activeMode) ?? promptModes[0];
  const copyId =
    kind === "image" ? `${prompt.id}-image-${imageMode}` : `${prompt.id}-video-${videoMode}`;

  return (
    <article className="overflow-hidden rounded-xl border border-outline bg-surface shadow-sm transition hover:shadow-md">
      <header className="flex items-center justify-between gap-4 border-b border-outline-soft p-4 sm:p-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-extrabold text-white">
            SO
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-extrabold text-on-surface">{prompt.author}</h3>
            <p className="truncate text-sm text-muted">
              {prompt.title} - {prompt.time_label}
            </p>
          </div>
        </div>
        <Tag prompt={prompt} />
      </header>

      <div
        className={`flex min-h-64 items-center justify-center border-b border-outline-soft p-5 sm:min-h-80 ${prompt.visual_class}`}
      >
        <div className="w-full max-w-sm rounded-xl border border-white/70 bg-white/70 p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-white">
                <Icon name={kind === "image" ? "image" : "movie"} size={23} />
              </span>
              <button
                aria-label={`Download original for ${prompt.title}`}
                className="grid h-11 w-11 place-items-center rounded-lg border border-white/80 bg-white/60 text-primary/70 transition hover:bg-white hover:text-primary"
                title="Download original"
                type="button"
              >
                <Icon name="download" size={21} />
              </button>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-primary">
              {prompt.category}
            </span>
          </div>
          <p className="font-display text-xl font-extrabold text-on-surface">{prompt.visual_subtitle}</p>
          <div className="mt-5 grid gap-2">
            <span className="h-2 w-11/12 rounded-full bg-primary/25" />
            <span className="h-2 w-8/12 rounded-full bg-primary/20" />
            <span className="h-2 w-10/12 rounded-full bg-primary/15" />
          </div>
        </div>
      </div>

      <div className="bg-background p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            aria-pressed={kind === "image"}
            className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-bold transition ${
              kind === "image"
                ? "bg-primary text-white"
                : "border border-outline-soft bg-surface text-muted hover:border-primary hover:text-primary"
            }`}
            onClick={() => onKindChange("image")}
            type="button"
          >
            <Icon name="image" size={17} />
            Image Prompt
          </button>
          <button
            aria-pressed={kind === "video"}
            className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-bold transition ${
              kind === "video"
                ? "bg-primary text-white"
                : "border border-outline-soft bg-surface text-muted hover:border-primary hover:text-primary"
            }`}
            onClick={() => onKindChange("video")}
            type="button"
          >
            <Icon name="movie" size={17} />
            Video Prompt
          </button>
        </div>

        {kind === "image" && (
          <label className="mb-4 grid gap-2 text-sm font-bold text-on-surface sm:max-w-sm">
            Image Prompt Type
            <span className="relative">
              <select
                className="h-11 w-full appearance-none rounded-lg border border-outline bg-surface px-4 pr-11 text-sm font-bold text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-surface-green"
                onChange={(event) => {
                  onImageModeChange(event.target.value as PromptMode);
                }}
                value={imageMode}
              >
                {promptModes.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
              <Icon
                name="expand_more"
                size={22}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              />
            </span>
          </label>
        )}

        <div className="relative rounded-lg border border-outline bg-surface-muted p-4 pr-14">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-surface-green px-3 py-1 text-xs font-extrabold text-primary">
            <Icon name={selectedPromptMode.icon} size={15} />
            {selectedPromptMode.label}
          </div>
          <p className="text-base leading-7 text-on-surface">{promptText}</p>
          <button
            aria-label={`Copy ${kind} prompt for ${prompt.title}`}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg text-muted transition hover:bg-surface hover:text-primary"
            onClick={() => onCopy(promptText, copyId)}
            title="Copy prompt"
            type="button"
          >
            <Icon name={copiedId === copyId ? "check" : "content_copy"} size={19} />
          </button>
        </div>
      </div>

      <footer className="flex items-center justify-between gap-3 border-t border-outline-soft bg-surface px-4 py-4 sm:px-6">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-muted">
          <Icon name="person" size={18} />
          Guest mode
        </span>
        <button
          className="h-10 rounded-lg border border-outline bg-surface-muted px-4 text-sm font-bold text-muted transition hover:bg-surface-green hover:text-primary"
          onClick={() =>
            onCopy(
              `${currentImagePrompt}\n\n${currentVideoPrompt}`,
              `${prompt.id}-all-${imageMode}-${videoMode}`,
            )
          }
          type="button"
        >
          {copiedId === `${prompt.id}-all-${imageMode}-${videoMode}` ? "Copied" : "Copy All"}
        </button>
      </footer>
    </article>
  );
}

export function DashboardClient({ prompts }: { prompts: Prompt[] }) {
  const categoryRailRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [imageModes, setImageModes] = useState<Record<string, PromptMode>>({});
  const [promptKinds, setPromptKinds] = useState<Record<string, PromptKind>>({});
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [videoModes, setVideoModes] = useState<Record<string, PromptMode>>({});

  const categoryCounts = useMemo(() => {
    return categories.reduce<Record<string, number>>((counts, category) => {
      counts[category.name] =
        category.name === "All"
          ? prompts.length
          : prompts.filter((prompt) => prompt.category === category.name).length;

      return counts;
    }, {});
  }, []);

  const filteredPrompts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return prompts
      .filter((prompt) => {
        const categoryMatch = activeCategory === "All" || prompt.category === activeCategory;
        const queryMatch =
          normalizedQuery.length === 0 ||
          [
            prompt.title,
            prompt.category,
            ...prompt.prompt_modes.map((pm) => pm.content),
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);

        return categoryMatch && queryMatch;
      })
      .sort((firstPrompt, secondPrompt) => firstPrompt.order_index - secondPrompt.order_index);
  }, [activeCategory, query, prompts]);

  function resetExplore() {
    setActiveCategory("All");
    setQuery("");
    flash("Showing all affiliate prompts");
  }

  function selectCategory(categoryName: string) {
    setActiveCategory(categoryName);
  }

  function showMobileFilters() {
    categoryRailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    flash("Choose a category below");
  }

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }

  async function copyText(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      flash("Copied to clipboard");
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      flash("Clipboard permission blocked");
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="sticky top-0 z-50 border-b border-outline bg-surface/95 backdrop-blur">
        <div className="flex h-[74px] items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex min-w-0 items-center gap-6">
            <Link className="font-display text-2xl font-extrabold text-primary sm:text-3xl" href="/">
              PromptVault
            </Link>
            <nav className="hidden items-center gap-6 md:flex" aria-label="Dashboard sections">
              {["Affiliates", "Facebook Automation", "YouTube Automation"].map((item) => (
                <button
                  className={`border-b-2 py-1 text-sm font-bold transition ${
                    item === "Affiliates"
                      ? "border-primary text-primary"
                      : "cursor-not-allowed border-transparent text-muted/60"
                  }`}
                  disabled={item !== "Affiliates"}
                  key={item}
                  onClick={item === "Affiliates" ? resetExplore : undefined}
                  type="button"
                >
                  {item}
                  {item !== "Affiliates" ? <span className="ml-1 text-[10px] uppercase">Soon</span> : null}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <label className="hidden h-12 w-[min(360px,28vw)] items-center rounded-full border border-outline bg-surface-muted px-4 transition focus-within:border-primary md:flex">
              <Icon name="search" size={18} className="mr-3 text-muted" />
              <span className="sr-only">Search prompts</span>
              <input
                className="w-full bg-transparent text-base text-on-surface outline-none placeholder:text-muted/65"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search prompts..."
                value={query}
              />
            </label>
            <button
              className="hidden h-12 cursor-not-allowed items-center gap-2 rounded-lg border border-outline bg-surface-muted px-5 text-sm font-extrabold text-muted opacity-75 md:inline-flex"
              disabled
              type="button"
            >
              <Icon name="schedule" size={20} />
              Submit Soon
            </button>
            <Link
              aria-label="Open login profile"
              className="grid h-11 w-11 place-items-center rounded-full border border-outline bg-surface-green text-primary transition hover:border-primary"
              href="/login"
            >
              <Icon name="person" size={22} />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1440px]">
        <aside className="sticky top-[74px] hidden h-[calc(100vh-74px)] w-72 shrink-0 flex-col border-r border-outline bg-surface-muted p-4 lg:flex">
          <div className="px-4 pb-5 pt-4">
            <h2 className="font-display text-xl font-extrabold text-primary">Categories</h2>
            <p className="mt-1 text-sm text-muted">Browse by niche</p>
          </div>
          <nav className="grid gap-2" aria-label="Prompt categories">
            {categories.map((category) => (
              <button
                className={`flex h-12 items-center gap-3 rounded-lg px-4 text-left text-sm font-bold transition ${
                  activeCategory === category.name
                    ? "bg-surface-green text-primary"
                    : "text-muted hover:bg-surface-soft hover:text-primary"
                }`}
                key={category.name}
                onClick={() => selectCategory(category.name)}
                type="button"
              >
                <Icon name={category.icon} size={22} />
                <span className="flex flex-1 items-center justify-between gap-3">
                  <span>{category.name}</span>
                  <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-muted">
                    {categoryCounts[category.name]}
                  </span>
                </span>
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-lg border border-outline bg-surface p-4">
            <div className="flex items-center gap-3 text-primary">
              <Icon name="person" size={22} />
              <span className="text-sm font-extrabold">Guest Mode</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">
              Copying prompts is available now. Accounts and submissions are coming soon.
            </p>
          </div>
        </aside>

        <main className="w-full flex-1 px-5 pb-28 pt-6 sm:px-8 lg:pb-10">
          <div className="mx-auto max-w-3xl">
            <label className="mb-5 flex h-12 items-center rounded-full border border-outline bg-surface px-4 transition focus-within:border-primary md:hidden">
              <Icon name="search" size={18} className="mr-3 text-muted" />
              <span className="sr-only">Search prompts</span>
              <input
                className="w-full bg-transparent text-base text-on-surface outline-none placeholder:text-muted/65"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search prompts..."
                value={query}
              />
            </label>

            <div className="mb-6 flex items-center gap-3 md:hidden">
              <button
                className="inline-flex h-11 flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-outline bg-surface-muted px-4 text-sm font-extrabold text-muted opacity-75"
                disabled
                type="button"
              >
                <Icon name="schedule" size={19} />
                Submit Soon
              </button>
              <button
                className="grid h-11 w-11 place-items-center rounded-lg border border-outline bg-surface text-muted transition hover:border-primary hover:text-primary"
                onClick={showMobileFilters}
                type="button"
                aria-label="Filter prompts"
              >
                <Icon name="tune" size={21} />
              </button>
            </div>

            <div ref={categoryRailRef} className="hide-scrollbar mb-7 scroll-mt-24 overflow-x-auto pb-2 lg:hidden">
              <div className="flex min-w-max gap-3">
                {categories.map((category) => (
                  <button
                    className="flex w-20 flex-col items-center gap-2 text-center"
                    key={category.name}
                    onClick={() => selectCategory(category.name)}
                    type="button"
                  >
                    <span
                      className={`grid h-14 w-14 place-items-center rounded-full border text-primary transition ${
                        activeCategory === category.name
                          ? "border-primary bg-surface-green"
                          : "border-outline bg-surface text-muted"
                      }`}
                    >
                      <Icon name={category.icon} size={22} />
                    </span>
                    <span
                      className={`text-xs font-extrabold ${
                        activeCategory === category.name ? "text-primary" : "text-muted"
                      }`}
                    >
                      {category.name}
                    </span>
                    <span className="text-[11px] font-bold text-muted">{categoryCounts[category.name]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-extrabold text-on-surface">
                  {activeCategory === "All" ? "Affiliate Prompts" : `${activeCategory} Prompts`}
                </h1>
                <p className="mt-1 text-sm text-muted">
                  {filteredPrompts.length} prompt{filteredPrompts.length === 1 ? "" : "s"} ready to copy
                </p>
              </div>
              {activeCategory !== "All" || query ? (
                <button
                  className="h-10 rounded-lg border border-outline bg-surface px-4 text-sm font-bold text-muted transition hover:border-primary hover:text-primary"
                  onClick={resetExplore}
                  type="button"
                >
                  Clear
                </button>
              ) : null}
            </div>

            {filteredPrompts.length > 0 ? (
              <div className="grid gap-7">
                {filteredPrompts.map((prompt) => (
                  <PromptCard
                    copiedId={copiedId}
                    imageMode={imageModes[prompt.id] ?? "background"}
                    key={prompt.id}
                    kind={promptKinds[prompt.id] ?? "image"}
                    onCopy={copyText}
                    onImageModeChange={(mode) =>
                      setImageModes((current) => ({
                        ...current,
                        [prompt.id]: mode,
                      }))
                    }
                    onKindChange={(kind) =>
                      setPromptKinds((current) => ({
                        ...current,
                        [prompt.id]: kind,
                      }))
                    }
                    onVideoModeChange={(mode) =>
                      setVideoModes((current) => ({
                        ...current,
                        [prompt.id]: mode,
                      }))
                    }
                    prompt={prompt}
                    videoMode={videoModes[prompt.id] ?? "background"}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-outline bg-surface p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-surface-green text-primary">
                  <Icon name="search_off" size={28} />
                </div>
                <h2 className="font-display text-2xl font-extrabold text-on-surface">No prompts found</h2>
                <p className="mt-2 text-muted">Try another category or search term.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <nav className="pb-safe fixed bottom-0 left-0 z-50 grid w-full grid-cols-4 border-t border-outline bg-surface px-2 pt-2 lg:hidden">
        <Link className="flex flex-col items-center justify-center gap-1 py-1 text-xs font-bold text-muted" href="/">
          <Icon name="home" size={23} />
          Home
        </Link>
        <button
          className="flex flex-col items-center justify-center gap-1 py-1 text-xs font-extrabold text-primary"
          onClick={resetExplore}
          type="button"
        >
          <Icon name="storefront" size={23} filled />
          Affiliates
        </button>
        <button
          className="flex cursor-not-allowed flex-col items-center justify-center gap-1 py-1 text-xs font-bold text-muted/60"
          disabled
          type="button"
        >
          <Icon name="bookmark" size={23} />
          Saved Soon
        </button>
        <Link className="flex flex-col items-center justify-center gap-1 py-1 text-xs font-bold text-muted" href="/login">
          <Icon name="person" size={23} />
          Profile
        </Link>
      </nav>

      {toast ? (
        <div
          className="fixed bottom-24 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-on-surface px-5 py-3 text-sm font-bold text-white shadow-xl lg:bottom-8"
          role="status"
        >
          {toast}
        </div>
      ) : null}

    </div>
  );
}
