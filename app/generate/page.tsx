"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Icon } from "../components/Icon";
import GoogleAdSenseBanner from "../components/GoogleAdSenseBanner";

const SIMULATED_STEPS = [
  { label: "Analyzing uploaded product image...", duration: 1200 },
  { label: "Applying reference style rules...", duration: 1000 },
  { label: "Drafting cinematic camera instructions...", duration: 1100 },
  { label: "Structuring detailed prompt for video models...", duration: 900 },
];

type AspectRatio = "9:16" | "16:9" | "1:1";
type DailyPromptUsage = {
  date: string;
  count: number;
};

const PROMPT_USAGE_KEY = "silencio_daily_prompts";
const PROMPT_USAGE_EVENT = "silencio-prompt-usage";

const STYLES = [
  {
    id: "cinematic-handheld",
    label: "Cinematic Handheld",
    src: "/products/product1.png",
    previewGif: "/products/Ultra_realistic_cinematic_nighttime_product_s.gif",
  },
  {
    id: "mirror-selfie",
    label: "Mirror Selfie",
    src: "/products/Ultra_realistic_cinematic_mirror_selfie_video.gif",
    previewGif: "/products/Ultra_realistic_cinematic_mirror_selfie_video.gif",
  },
];

function getStoredPromptCount() {
  if (typeof window === "undefined") return 0;

  const today = new Date().toDateString();
  const stored = localStorage.getItem(PROMPT_USAGE_KEY);

  if (!stored) {
    return 0;
  }

  try {
    const usage = JSON.parse(stored) as Partial<DailyPromptUsage>;

    if (usage.date === today && typeof usage.count === "number") {
      return usage.count;
    }
  } catch (e) {
    console.error("Failed to parse prompt count:", e);
  }

  return 0;
}

function writeStoredPromptCount(count: number) {
  if (typeof window === "undefined") return;

  const today = new Date().toDateString();
  localStorage.setItem(PROMPT_USAGE_KEY, JSON.stringify({ date: today, count }));
  window.dispatchEvent(new Event(PROMPT_USAGE_EVENT));
}

function subscribeToPromptUsage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(PROMPT_USAGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(PROMPT_USAGE_EVENT, onStoreChange);
  };
}

export default function GeneratePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Configuration State
  const [selectedStyleId, setSelectedStyleId] = useState<string>("cinematic-handheld");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("9:16");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [previewGif, setPreviewGif] = useState<string | null>(null);
  
  // Upload & Gen State
  const [uploadState, setUploadState] = useState<"idle" | "generating" | "success">("idle");
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [genStep, setGenStep] = useState(0);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [promptCopied, setPromptCopied] = useState(false);
  const promptCount = useSyncExternalStore(subscribeToPromptUsage, getStoredPromptCount, () => 0);
  const [adTimer, setAdTimer] = useState<number>(0);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);

  function triggerAdUnlock() {
    const adLink = process.env.NEXT_PUBLIC_SPONSOR_UNLOCK_LINK;

    if (!adLink) {
      flash("Sponsor unlock is not configured yet.");
      return;
    }
    
    window.open(adLink, "_blank", "noopener,noreferrer");
    
    setIsUnlocking(true);
    setAdTimer(10);
    
    let remainingSeconds = 10;
    const interval = setInterval(() => {
      remainingSeconds -= 1;
      setAdTimer(remainingSeconds);

      if (remainingSeconds <= 0) {
        clearInterval(interval);
        setIsUnlocking(false);
        writeStoredPromptCount(0);
        flash("Daily limit reset! Enjoy 3 new prompts.");
      }
    }, 1000);
  }

  // Auto-scroll chat to bottom
  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [genStep, uploadState]);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      flash("Please upload an image file (JPG, PNG, or WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function openFilePicker() {
    if (!fileInputRef.current) return;

    fileInputRef.current.value = "";
    fileInputRef.current.click();
  }

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  async function startGeneration() {
    if (promptCount >= 3) {
      flash("You've reached your daily limit of 3 free prompts!");
      return;
    }
    if (!uploadedPreview) {
      flash("Please upload a product image first.");
      return;
    }
    setUploadState("generating");
    setGenStep(0);
    
    try {
      const selectedStyle = STYLES.find(s => s.id === selectedStyleId)?.label || "Cinematic";
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: uploadedPreview,
          style: selectedStyle,
          aspectRatio,
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }
      
      setGeneratedPrompt(data.prompt);
      setUploadState("success");
      setGenStep(SIMULATED_STEPS.length);

      // Increment daily limit
      const newCount = promptCount + 1;
      writeStoredPromptCount(newCount);
    } catch (err: unknown) {
      flash(err instanceof Error ? err.message : "Something went wrong.");
      setUploadState("idle");
      setGenStep(0);
    }
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setPromptCopied(true);
      flash("Prompt copied to clipboard.");
      setTimeout(() => setPromptCopied(false), 2200);
    } catch {
      flash("Clipboard access blocked. Please copy manually.");
    }
  }

  function resetUpload() {
    setUploadState("idle");
    setUploadedPreview(null);
    setGenStep(0);
    setPromptCopied(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  useEffect(() => {
    if (uploadState !== "generating") return;
    let timeout: ReturnType<typeof setTimeout>;
    const runStep = (idx: number) => {
      if (idx >= SIMULATED_STEPS.length - 1) {
        // Halt at the last step (spinner keeps spinning) until fetch completes
        setGenStep(SIMULATED_STEPS.length - 1);
        return;
      }
      setGenStep(idx);
      timeout = setTimeout(() => runStep(idx + 1), SIMULATED_STEPS[idx].duration);
    };
    runStep(0);
    return () => clearTimeout(timeout);
  }, [uploadState]);

  return (
    <div className="flex h-screen w-full flex-col bg-background text-on-surface overflow-hidden relative">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-outline-soft bg-surface/95 px-4 backdrop-blur sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="Back to home">
          <img src="/assets/logo.png" alt="Silencio Orgs Logo" className="h-8 w-8 object-contain" />
          <span className="font-display font-extrabold text-on-surface">Silencio Orgs</span>
        </Link>
        <button onClick={resetUpload} title="New Prompt" className="grid h-9 w-9 place-items-center rounded-lg border border-outline-soft text-muted hover:border-primary hover:text-primary transition">
          <Icon name="edit_square" size={18} />
        </button>
      </header>

      {/* ─── MAIN CONTENT: Chat Area ─── */}
      <main className="flex-1 overflow-y-auto bg-surface-muted p-4 sm:p-6 lg:p-10 hide-scrollbar scroll-smooth pb-48 sm:pb-48">
        <div className="mx-auto max-w-3xl space-y-6">
          
          {/* Initial Welcome Bubble */}
          {uploadState === "idle" && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-white">
                  <Icon name="auto_awesome" size={16} filled />
                </div>
                <div className="flex-1 rounded-2xl rounded-tl-none border border-outline-soft bg-surface p-5 shadow-sm max-w-lg">
                  {!uploadedPreview ? (
                    <p className="text-sm leading-relaxed text-on-surface">
                      Welcome to the AI Prompt Generator. Tap the upload icon below to add your product image and select your desired reference style.
                      <br/><br/>
                      I will analyze your image and generate a cinema-grade prompt ready for Sora, Kling, or Runway.
                      <br/><br/>
                      <span className="font-extrabold text-primary">You have {promptCount >= 3 ? "0" : 3 - promptCount} free prompts remaining today.</span>
                    </p>
                  ) : (
                    <p className="text-sm leading-relaxed text-on-surface">
                      Image uploaded successfully!
                      <br/><br/>
                      If you&apos;d like to adjust the reference style or change the aspect ratio, tap the **product thumbnail** at the bottom left.
                      <br/><br/>
                      When you are ready, click the **Generate Prompt** button below to create your cinema-grade prompt!
                      <br/><br/>
                      <span className="font-extrabold text-primary">You have {promptCount >= 3 ? "0" : 3 - promptCount} free prompts remaining today.</span>
                    </p>
                  )}
                </div>
              </div>
              
              <GoogleAdSenseBanner />
            </div>
          )}

          {/* User Request Bubble */}
          {(uploadState === "generating" || uploadState === "success") && uploadedPreview && (
            <div className="flex gap-4 flex-row-reverse">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-green text-primary border border-primary/20">
                <Icon name="person" size={18} />
              </div>
              <div className="flex flex-col items-end gap-2 max-w-[85%] sm:max-w-[70%]">
                <div className="overflow-hidden rounded-2xl rounded-tr-none border border-outline-soft bg-surface shadow-sm p-1.5">
                  <img src={uploadedPreview} alt="User request" className="w-56 h-auto rounded-xl object-contain bg-black/5" />
                </div>
                <div className="flex flex-wrap justify-end gap-1.5">
                  <span className="rounded-full bg-surface px-3 py-1 text-[10px] font-bold text-muted border border-outline-soft shadow-sm">
                    {STYLES.find(s => s.id === selectedStyleId)?.label}
                  </span>
                  <span className="rounded-full bg-surface px-3 py-1 text-[10px] font-bold text-muted border border-outline-soft shadow-sm">
                    {aspectRatio}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* AI Processing / Output Bubble */}
          {(uploadState === "generating" || uploadState === "success") && (
            <div className="flex gap-4">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-white">
                <Icon name="auto_awesome" size={16} filled />
              </div>
              <div className="flex-1 rounded-2xl rounded-tl-none border border-outline-soft bg-surface shadow-sm overflow-hidden">
                
                {/* Processing Steps */}
                <div className={`p-5 ${uploadState === "success" ? "border-b border-outline-soft bg-surface-muted/50" : ""}`}>
                  <div className="space-y-3">
                    {SIMULATED_STEPS.map((step, idx) => {
                      const done = uploadState === "success" || idx < genStep;
                      const active = uploadState === "generating" && idx === genStep;
                      if (!done && !active) return null; // Hide future steps

                      return (
                        <div key={step.label} className={`flex items-center gap-3 text-xs transition-opacity ${done || active ? "opacity-100" : "opacity-0"}`}>
                          {done ? (
                            <Icon name="check_circle" size={16} className="text-primary" filled />
                          ) : (
                            <Icon name="sync" size={16} className="text-primary animate-spin" />
                          )}
                          <span className={`text-on-surface ${active ? "font-bold text-sm" : ""}`}>{step.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Final Output */}
                {uploadState === "success" && (
                  <div className="p-5 bg-surface relative group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-muted">Generated Prompt</span>
                    </div>
                    <textarea
                      readOnly
                      value={generatedPrompt}
                      className="w-full h-72 resize-none bg-background p-4 rounded-xl font-mono text-xs leading-relaxed text-muted outline-none border border-outline-soft focus:border-primary transition"
                      onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                    />
                    <button
                      onClick={copyPrompt}
                      className={`mt-4 w-full flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-extrabold shadow-sm transition-all active:scale-[0.98] ${
                        promptCopied ? "bg-surface-green text-primary border border-primary/20" : "bg-primary text-white shadow-primary/20 hover:bg-primary-hover"
                      }`}
                    >
                      <Icon name={promptCopied ? "check" : "content_copy"} size={18} />
                      {promptCopied ? "Copied to Clipboard" : "Copy Full Prompt"}
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* ─── BOTTOM INPUT BAR ─── */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-outline-soft bg-surface px-4 py-4 sm:px-6 z-20 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.05)]">
        <div className="mx-auto max-w-3xl flex flex-col gap-3">
          
          {/* Limit Lockout Alert on Main Page */}
          {uploadState === "idle" && promptCount >= 3 && (
            isUnlocking ? (
              <div className="overflow-hidden rounded-2xl border border-primary/30 bg-surface p-5 text-center shadow-md flex flex-col items-center justify-center gap-3">
                <div className="flex items-center gap-2">
                  <Icon name="sync" size={24} className="text-primary animate-spin" />
                  <span className="text-sm font-extrabold text-on-surface">Verifying Quota Unlock...</span>
                </div>
                <div className="w-full bg-outline-soft h-1.5 rounded-full overflow-hidden max-w-[240px]">
                  <div 
                    className="bg-primary h-full transition-all duration-1000 ease-out" 
                    style={{ width: `${(10 - adTimer) * 10}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted font-bold">
                  Please keep the ad window open for {adTimer}s to complete the reward verification.
                </span>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-primary/20 bg-surface p-5 text-center shadow-md flex flex-col items-center justify-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <Icon name="vpn_key" size={26} className="text-primary animate-pulse" filled />
                  <span className="text-sm font-extrabold text-on-surface">Daily Prompt Limit Reached</span>
                  <span className="text-[11px] text-muted max-w-[280px]">
                    You have used all 3 of your free daily cinematic prompts. Unlock 3 more instantly by watching a quick sponsor link!
                  </span>
                </div>
                <button
                  onClick={triggerAdUnlock}
                  className="flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-extrabold text-white shadow-md shadow-primary/20 transition hover:bg-primary-hover active:scale-[0.98]"
                >
                  <Icon name="ads_click" size={16} filled />
                  Unlock 3 More Prompts
                </button>
              </div>
            )
          )}

          {/* Action Row */}
          <div className={`flex gap-3 w-full ${uploadState === "success" ? "flex-col sm:flex-row items-stretch" : "flex-row items-center"}`}>
            {uploadState === "success" ? (
              <>
                <button
                  onClick={resetUpload}
                  className="flex h-[52px] w-full sm:flex-1 items-center justify-center gap-2 rounded-2xl border border-outline-soft bg-surface px-6 text-sm font-extrabold text-muted hover:border-primary hover:text-primary transition active:scale-[0.98]"
                >
                  <Icon name="restart_alt" size={20} />
                  Start New Prompt
                </button>
                <button
                  onClick={() => {
                    resetUpload();
                    setShowSettingsModal(true);
                  }}
                  className="flex h-[52px] w-full sm:flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-extrabold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover active:scale-[0.98]"
                >
                  <Icon name="add_photo_alternate" size={20} filled />
                  Upload New Image
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowSettingsModal(true)}
                  disabled={uploadState === "generating"}
                  className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-2xl border border-outline-soft bg-surface-muted text-muted transition hover:border-primary hover:text-primary disabled:opacity-50 group flex items-center justify-center"
                  title="Upload Image & Settings"
                >
                  {uploadedPreview ? (
                    <img src={uploadedPreview} alt="Uploaded product" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  ) : (
                    <Icon name="add_photo_alternate" size={24} />
                  )}
                </button>
                <button
                  onClick={startGeneration}
                  disabled={promptCount >= 3 || !uploadedPreview || uploadState === "generating"}
                  className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-extrabold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                >
                  <Icon name={uploadState === "generating" ? "sync" : "auto_awesome"} size={20} className={uploadState === "generating" ? "animate-spin" : ""} filled={uploadState !== "generating"} />
                  {uploadState === "generating" ? "Generating Prompt..." : isUnlocking ? "Verifying..." : promptCount >= 3 ? "Limit Reached" : "Generate Prompt"}
                </button>
              </>
            )}
          </div>

          {/* Counter Badge */}
          {uploadState !== "success" && (
            <div className="text-center pt-1">
              <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">
                {isUnlocking ? `Verifying unlock in ${adTimer}s...` : promptCount >= 3 ? "0 of 3 free prompts remaining today" : `${3 - promptCount} of 3 free prompts remaining today`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ─── UPLOAD & CONFIGURATION MODAL ─── */}
      {showSettingsModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity"
          onClick={() => setShowSettingsModal(false)}
        >
          <div 
            className="w-full max-w-md overflow-hidden rounded-3xl bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-outline-soft px-6 py-4">
              <span className="font-display text-lg font-extrabold text-on-surface">Upload & Configuration</span>
              <button onClick={() => setShowSettingsModal(false)} className="text-muted hover:text-primary transition">
                <Icon name="close" size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Product Image Section */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-muted">Product Image</label>
                <div className="overflow-hidden rounded-2xl border border-outline-soft bg-background p-2">
                  {uploadedPreview ? (
                    <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-outline-soft group mx-auto">
                      <img src={uploadedPreview} alt="Uploaded product preview" className="h-full w-full object-cover" />
                      <button
                        onClick={() => setUploadedPreview(null)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        title="Remove Image"
                      >
                        <Icon name="close" size={24} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={openFilePicker}
                      className={`flex h-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed transition-all ${
                        isDragging ? "border-primary bg-surface-green" : "border-outline-soft hover:border-primary hover:bg-surface-muted"
                      }`}
                    >
                      <Icon name="add_photo_alternate" size={26} className="text-primary animate-pulse" />
                      <span className="text-xs font-bold text-muted">Upload Product Image</span>
                      <span className="text-[10px] text-muted/60">Drag and drop or click here</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Reference Style */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-muted">Reference Style</label>
                <div className="grid grid-cols-2 gap-3">
                  {STYLES.map((style) => {
                    const isSelected = selectedStyleId === style.id;
                    return (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyleId(style.id)}
                        className={`group relative flex flex-col items-center gap-2 rounded-xl border-2 p-1.5 transition-all ${
                          isSelected ? "border-primary bg-surface-green/30" : "border-transparent hover:bg-surface-muted"
                        }`}
                      >
                        <div className={`relative overflow-hidden rounded-lg transition-transform ${isSelected ? "ring-2 ring-primary ring-offset-1 scale-[0.98]" : "group-hover:scale-105"}`}>
                          <img src={style.src} alt={style.label} className="aspect-square w-full object-cover" />
                          {style.previewGif && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewGif(style.previewGif!);
                              }}
                              title="Preview Video Style"
                              className="absolute bottom-1 right-1 grid h-6 w-6 place-items-center rounded bg-black/70 text-white backdrop-blur-sm transition hover:bg-primary hover:scale-110 cursor-pointer"
                            >
                              <Icon name="play_arrow" size={16} filled />
                            </div>
                          )}
                        </div>
                        <span className={`text-[10px] font-extrabold text-center leading-tight ${isSelected ? "text-primary" : "text-muted"}`}>
                          {style.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-muted">Aspect Ratio</label>
                <div className="flex rounded-xl border border-outline-soft bg-surface-muted p-1.5 shadow-inner">
                  {(["9:16", "16:9", "1:1"] as AspectRatio[]).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`flex-1 rounded-lg py-2 text-sm font-extrabold transition-all ${
                        aspectRatio === ratio
                          ? "bg-surface text-primary shadow-sm ring-1 ring-outline-soft"
                          : "text-muted hover:text-on-surface"
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-outline-soft bg-surface-muted p-4">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-full h-12 rounded-xl bg-primary text-sm font-extrabold text-white shadow-sm transition hover:bg-primary-hover active:scale-[0.98]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── GIF PREVIEW MODAL ─── */}
      {previewGif && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity"
          onClick={() => setPreviewGif(null)}
        >
          <div className="relative w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-white/80 text-xs font-bold uppercase tracking-widest">Style Preview</span>
              <button onClick={() => setPreviewGif(null)} className="text-white/60 hover:text-white transition">
                <Icon name="close" size={24} />
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl bg-black border border-white/10 shadow-2xl">
              <img src={previewGif} alt="Style Preview" className="w-full h-auto" />
            </div>
          </div>
        </div>
      )}

      {/* ─── COPY SUCCESS & SPONSOR POPUP ─── */}
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-32 right-1/2 translate-x-1/2 z-[80] rounded-full bg-on-surface px-6 py-3.5 text-sm font-bold text-white shadow-xl whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  );
}
