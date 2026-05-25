"use client";

import { useState, useEffect, useRef } from "react";
import { Icon } from "./Icon";

type Step = {
  label: string;
  duration: number; // ms
};

const SIMULATED_STEPS: Step[] = [
  { label: "Analyzing uploaded product image...", duration: 1200 },
  { label: "Identifying main subject: 'Luxury Sunscreen Packaging'...", duration: 1400 },
  { label: "Extracting brand texture, materials, and metallic detailing...", duration: 1200 },
  { label: "Configuring urban nighttime ambient lighting variables...", duration: 1300 },
  { label: "Drafting premium cinematic camera path (handheld slide & zoom)...", duration: 1100 },
  { label: "Structuring detailed prompts for next-gen video models...", duration: 900 },
];

const MOCK_PROMPT = `Ultra realistic cinematic nighttime product showcase video of a hand holding a luxury tinted sunscreen product box outdoors in an urban city environment at night, filmed using iPhone 15 Pro style camera, UHD 4K, 60FPS, premium skincare commercial aesthetic, ultra detailed textures, cinematic realism.

The camera remains in a single continuous handheld shot with smooth realistic iPhone-style movement. The product box stays completely closed and stable at all times with no opening, no testing, and no interaction besides naturally holding it in the hand. The focus is entirely on elegant cinematic camera movement and premium nighttime atmosphere.

The hand holds the product box steadily in the foreground while the camera slowly performs subtle smooth push-in and pull-back movements, creating a realistic cinematic iPhone zoom effect without abrupt motion. The movement must remain soft, fluid, stable, and natural with no robotic motion or sudden camera shifts.

Nighttime city lights softly glow in the background with realistic bokeh and shallow depth of field. Streetlights, store lighting, reflections, and passing ambient light sources create subtle dynamic illumination across the product packaging and skin. The background remains softly alive with realistic environmental movement while keeping the product as the clear focal point.

A gentle nighttime breeze subtly moves nearby plants and softly affects tiny hairs on the hand and the bracelet, creating realistic environmental motion. Light reflections naturally shift across the glossy product box as the camera slowly moves.

The product packaging remains perfectly stable, sharp, and readable during the entire shot with realistic reflections, soft highlights, detailed printed textures, and premium material rendering. The hand maintains natural grip pressure and realistic finger micro-movements without deformities or unnatural shaking. Skin texture, fingernails, bracelet details, and shadows appear highly detailed and photorealistic.

Lighting is realistic warm urban night lighting with soft mixed tones from storefronts and streetlights, natural HDR exposure adaptation, balanced highlights, realistic reflections on the packaging, smooth shadow gradients, and stable nighttime exposure throughout the video.

The camera should emulate premium iPhone cinematic video quality with subtle handheld realism, smooth autofocus breathing, soft cinematic motion blur, realistic low-light processing, shallow depth of field, and highly detailed texture rendering while maintaining stable framing.

Extremely important: maintain temporal consistency and stable anatomy throughout the entire video. Avoid all AI artifacts including warped fingers, duplicate hands, floating objects, packaging deformation, text distortion, unstable lighting, flickering reflections, camera jitter, random zoom jumps, background warping, texture crawling, unrealistic environmental motion, or robotic movement. The product box must remain closed and visually consistent during the entire clip.

Motion must remain smooth, premium, realistic, and cinematic from beginning to end with luxury skincare commercial quality and polished nighttime influencer aesthetic.

Style keywords: ultra photorealistic, cinematic realism, luxury skincare advertisement, nighttime urban aesthetic, iPhone cinematic video, smooth handheld camera motion, realistic night lighting, premium product showcase, stable product consistency, UHD 60FPS, cinematic depth of field, natural environmental motion, high-end commercial aesthetic.`;

export function PromptPlayground() {
  const [state, setState] = useState<"idle" | "generating" | "success">("idle");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Only accept images
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, or WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
      startGeneration();
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = () => {
    setUploadedImage("/products/product1.png");
    startGeneration();
  };

  const startGeneration = () => {
    setState("generating");
    setProgress(0);
    setCurrentStepIndex(0);
  };

  // Simulated AI reasoning steps ticker & progress bar animation
  useEffect(() => {
    if (state !== "generating") return;

    let stepTimeout: NodeJS.Timeout;
    const totalDuration = SIMULATED_STEPS.reduce((sum, s) => sum + s.duration, 0);
    const updateRate = 50; // ms
    const increment = (updateRate / totalDuration) * 100;

    const progressInterval: NodeJS.Timeout = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(prev + increment, 99.5);
      });
    }, updateRate);

    const runStep = (index: number) => {
      if (index >= SIMULATED_STEPS.length) {
        setState("success");
        setProgress(100);
        return;
      }

      setCurrentStepIndex(index);
      stepTimeout = setTimeout(() => {
        runStep(index + 1);
      }, SIMULATED_STEPS[index].duration);
    };

    runStep(0);

    return () => {
      clearTimeout(stepTimeout);
      clearInterval(progressInterval);
    };
  }, [state]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(MOCK_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy prompt: ", err);
    }
  };

  const handleReset = () => {
    setState("idle");
    setUploadedImage(null);
    setProgress(0);
    setCurrentStepIndex(0);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-outline bg-surface p-5 shadow-[0_8px_30px_rgb(0,122,50,0.04)] sm:p-7 transition-all duration-300">
      {/* Background Grid Pattern */}
      <div className="dashboard-grid absolute inset-0 opacity-40 pointer-events-none" />

      <div className="relative z-10">
        {/* Header Indicator */}
        <div className="mb-5 flex items-center justify-between border-b border-outline-soft pb-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-surface-green text-primary">
              <Icon name="auto_awesome" size={20} filled />
            </span>
            <div>
              <h3 className="font-display font-bold text-on-surface text-base sm:text-lg">
                AI Video Prompt Generator
              </h3>
              <p className="text-xs text-muted">Convert product photos into cinema-grade video prompts</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-green px-3 py-1 text-xs font-extrabold text-primary uppercase tracking-wide">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Active Playground
          </span>
        </div>

        {/* ==================== STATE 1: IDLE / UPLOAD ==================== */}
        {state === "idle" && (
          <div className="space-y-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragging
                  ? "border-primary bg-surface-green/50 scale-[1.02] shadow-lg"
                  : "border-outline hover:border-primary hover:bg-surface-muted"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-surface-green text-primary transition-transform duration-300 group-hover:scale-110 shadow-sm">
                <Icon name="cloud_upload" size={28} />
              </div>

              <h4 className="font-display text-base font-bold text-on-surface">
                Drag &amp; drop product photo here
              </h4>
              <p className="mt-2 text-xs text-muted max-w-xs leading-normal">
                Supports JPG, PNG, or WebP. Optimal sizing and compression are calculated automatically.
              </p>
              
              <button
                type="button"
                className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover active:scale-[0.98]"
              >
                <Icon name="photo_library" size={17} />
                Browse Local Files
              </button>
            </div>

            {/* Try a Sample Section */}
            <div className="rounded-xl border border-outline-soft bg-surface-muted p-4">
              <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">
                No product images? Try this high-end showcase:
              </p>
              <button
                type="button"
                onClick={handleSelectSample}
                className="flex w-full items-center gap-4 rounded-lg border border-outline bg-surface p-3 text-left transition hover:border-primary hover:shadow-sm group"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-outline-soft bg-surface-muted">
                  <img
                    src="/products/product1.png"
                    alt="Luxury Skin Care Sunscreen Box Sample"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-on-surface truncate">luxury_sunscreen_packaging.png</p>
                  <p className="text-xs text-muted mt-1 leading-normal">
                    Pre-selected high-resolution skincare product mockup box for optimal cinematic result.
                  </p>
                </div>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-surface-green text-primary opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all">
                  <Icon name="arrow_forward" size={16} />
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ==================== STATE 2: GENERATING ==================== */}
        {state === "generating" && (
          <div className="py-8 px-4 flex flex-col items-center justify-center space-y-7">
            {/* Pulsing Visual Container */}
            <div className="relative h-28 w-28 flex items-center justify-center">
              {/* Outer Pulse Rings */}
              <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping duration-1000" />
              <div className="absolute inset-2 rounded-full bg-primary/10 animate-pulse duration-700" />
              
              {/* Spinner Container */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="var(--outline-soft)"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="var(--primary)"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - progress / 100)}
                  className="transition-all duration-75 ease-out"
                />
              </svg>
              
              {/* Mini Preview inside Spinner */}
              <div className="absolute h-20 w-20 rounded-full overflow-hidden border-2 border-white bg-surface shadow-md">
                {uploadedImage && (
                  <img
                    src={uploadedImage}
                    alt="Analyzing product"
                    className="h-full w-full object-cover animate-pulse"
                  />
                )}
              </div>
            </div>

            {/* Progress Count */}
            <div className="text-center space-y-1">
              <span className="font-display text-2xl font-black text-primary">
                {Math.round(progress)}%
              </span>
              <p className="text-sm font-bold text-on-surface">Gemini AI is analyzing packaging details...</p>
            </div>

            {/* AI Thought Logs Timeline */}
            <div className="w-full max-w-sm rounded-xl border border-outline-soft bg-surface-muted p-4 space-y-3">
              {SIMULATED_STEPS.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isActive = idx === currentStepIndex;
                
                return (
                  <div
                    key={step.label}
                    className={`flex items-center gap-3 transition-opacity duration-300 ${
                      isCompleted ? "opacity-100" : isActive ? "opacity-100 font-bold" : "opacity-40"
                    }`}
                  >
                    {isCompleted ? (
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-white">
                        <Icon name="check" size={12} />
                      </span>
                    ) : isActive ? (
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/25 text-primary animate-spin">
                        <Icon name="sync" size={12} />
                      </span>
                    ) : (
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-outline text-muted">
                        <Icon name="circle" size={8} />
                      </span>
                    )}
                    <span className="text-xs text-on-surface truncate">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== STATE 3: SUCCESS / OUTPUT ==================== */}
        {state === "success" && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              
              {/* Left Panel: Prompt Output Box */}
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-muted uppercase tracking-wider">
                    Copy-Ready Cinematic Prompt
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-surface-green px-2.5 py-0.5 rounded-full">
                    <Icon name="check_circle" size={13} filled /> Optimal Structure
                  </span>
                </div>
                
                <div className="relative flex-1 group rounded-xl border border-outline bg-surface-muted shadow-inner overflow-hidden">
                  {/* Glassmorphic overlay when copying */}
                  <textarea
                    readOnly
                    value={MOCK_PROMPT}
                    className="w-full h-80 lg:h-96 p-4 pr-12 text-xs font-mono leading-relaxed text-muted bg-transparent outline-none resize-none overflow-y-auto focus:ring-0 select-all"
                  />
                  
                  {/* Floating Action Button */}
                  <div className="absolute right-3 top-3 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      title="Copy full prompt to clipboard"
                      className={`grid h-10 w-10 place-items-center rounded-lg shadow-sm border transition-all duration-300 ${
                        copied
                          ? "bg-primary border-primary text-white scale-105"
                          : "bg-surface border-outline text-muted hover:border-primary hover:text-primary hover:scale-105"
                      }`}
                    >
                      <Icon name={copied ? "check" : "content_copy"} size={18} />
                    </button>
                  </div>
                </div>

                {/* Micro Feedback */}
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>✨ Tip: Best used with Sora, Kling, Gen-3, or Luma</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                  >
                    <Icon name="content_copy" size={14} />
                    Copy all text
                  </button>
                </div>
              </div>

              {/* Right Panel: Result Showcase Frame */}
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-muted uppercase tracking-wider">
                    Visual Target Showcase (GIF)
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-warning bg-warning-surface px-2.5 py-0.5 rounded-full">
                    <Icon name="star" size={13} filled /> Gold Standard
                  </span>
                </div>

                {/* GIF Viewer Frame */}
                <div className="relative rounded-xl border border-outline bg-[#141b2b] overflow-hidden flex flex-col justify-center items-center shadow-lg group">
                  {/* Main Result GIF */}
                  <div className="aspect-video w-full h-80 lg:h-96 relative flex items-center justify-center bg-black">
                    <img
                      src="/products/Ultra_realistic_cinematic_nighttime_product_s.gif"
                      alt="Ultra realistic cinematic nighttime skincare sunscreen video showcase"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Floating GIF Indicator overlay */}
                    <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[10px] font-extrabold tracking-widest uppercase">
                      GIF Preview
                    </span>
                  </div>
                </div>

                {/* Notice Alert Banner */}
                <div className="rounded-xl border border-[#ffe082] bg-[#fff8e1] p-3 flex gap-3 text-xs leading-relaxed text-[#7f5f00]">
                  <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#ffb300] text-white">
                    <Icon name="info" size={14} filled />
                  </div>
                  <div>
                    <span className="font-extrabold block mb-0.5">Prompt Generation Notice</span>
                    This GIF shows the targeted visual standard. Because this is a high-fidelity reference GIF, output styles, framerates, and details will vary depending on your choice of third-party AI video generator (such as Sora, Luma, Kling, or Gen-3).
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-outline-soft justify-between items-center">
              <p className="text-xs text-muted text-center sm:text-left">
                Success! You can now paste this prompt into your video generator of choice.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-primary px-5 text-sm font-bold text-primary transition hover:bg-surface-green focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-[0.98]"
              >
                <Icon name="refresh" size={17} />
                Upload Another Image
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
