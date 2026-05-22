"use client";

import { useState } from "react";
import { Icon } from "../../components/Icon";
import { supabase } from "../../../lib/supabase";
import { addPrompt } from "../../../lib/admin-actions";

const CATEGORIES = ["Fashion", "Beauty", "Home", "Tech", "Fitness"];
const TAG_TONES = ["green", "yellow"] as const;

const PREDEFINED_TAGS = ["", "Trending", "Hot", "New", "Fresh", "Best Seller", "Popular", "Must Have"];
const PREDEFINED_ICONS = ["", "trending_up", "local_fire_department", "fiber_new", "bolt", "star", "favorite", "shopping_bag"];
const PREDEFINED_TIMES = ["", "Just now", "1h ago", "2h ago", "5h ago", "8h ago", "11h ago", "1d ago", "2d ago", "3d ago", "1w ago"];
const PREDEFINED_VISUALS = [
  { label: "None", value: "" },
  { label: "Soft Green", value: "bg-[#e4f6ea]" },
  { label: "Soft Purple", value: "bg-[#eef1fb]" },
  { label: "Soft Gray-Blue", value: "bg-[#f1f3ff]" },
  { label: "Light Blue", value: "bg-[#e9edff]" },
  { label: "Light Green", value: "bg-[#e7f7ec]" },
  { label: "Soft Yellow", value: "bg-[#fff7d6]" },
  { label: "Soft Red", value: "bg-[#ffebe9]" }
];

interface PromptModeField {
  kind: "image" | "video";
  mode: "background" | "product" | "persona";
  label: string;
  content: string;
}

const initialModes: PromptModeField[] = [
  { kind: "image", mode: "background", label: "Image — Background Prompt", content: "" },
  { kind: "image", mode: "product", label: "Image — Product Prompt", content: "" },
  { kind: "image", mode: "persona", label: "Image — Persona Prompt", content: "" },
  { kind: "video", mode: "background", label: "Video — Background Prompt", content: "" },
  { kind: "video", mode: "product", label: "Video — Product Prompt", content: "" },
  { kind: "video", mode: "persona", label: "Video — Persona Prompt", content: "" },
];

export default function AddPromptPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tag, setTag] = useState("");
  const [tagTone, setTagTone] = useState<"green" | "yellow">("green");
  const [tagIcon, setTagIcon] = useState("");
  const [timeLabel, setTimeLabel] = useState("");
  const [visualSubtitle, setVisualSubtitle] = useState("");
  const [visualClass, setVisualClass] = useState("");
  const [orderIndex, setOrderIndex] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [modes, setModes] = useState<PromptModeField[]>(
    initialModes.map((m) => ({ ...m }))
  );
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  function updateModeContent(index: number, content: string) {
    setModes((prev) =>
      prev.map((m, i) => (i === index ? { ...m, content } : m))
    );
  }

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  function resetForm() {
    setTitle("");
    setCategory(CATEGORIES[0]);
    setTag("");
    setTagTone("green");
    setTagIcon("");
    setTimeLabel("");
    setVisualSubtitle("");
    setVisualClass("");
    setOrderIndex(0);
    setImageFile(null);
    setImagePreview(null);
    setModes(initialModes.map((m) => ({ ...m })));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Upload image if selected
      let imageUrl: string | null = null;

      if (imageFile) {
        const filePath = `${category}/${Date.now()}_${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("prompt-images")
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from("prompt-images")
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      // Step 2: Insert prompt + modes via Server Action
      await addPrompt({
        title,
        category,
        tag,
        tag_tone: tagTone,
        tag_icon: tagIcon,
        time_label: timeLabel,
        visual_subtitle: visualSubtitle,
        visual_class: visualClass,
        order_index: orderIndex,
        image_url: imageUrl,
        prompt_modes: modes.map((m) => ({
          kind: m.kind,
          mode: m.mode,
          content: m.content,
        })),
      });

      showToast("Prompt added successfully", "success");
      resetForm();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-extrabold text-on-surface">
          Add New Prompt
        </h1>
        <p className="mt-1 text-sm text-muted">
          Fill in all sections below to create a new prompt entry.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section A: Metadata */}
        <section className="rounded-xl border border-outline bg-surface p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 font-display text-base font-extrabold text-on-surface">
            <Icon name="edit_note" size={22} className="text-primary" />
            Prompt Metadata
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Title */}
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-bold text-on-surface">
                Title <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Fashion Drop"
                className="h-11 w-full rounded-lg border border-outline bg-surface-muted px-4 text-sm text-on-surface outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-surface-green"
              />
            </label>

            {/* Category */}
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-on-surface">
                Category <span className="text-red-500">*</span>
              </span>
              <span className="relative block">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-11 w-full appearance-none rounded-lg border border-outline bg-surface-muted px-4 pr-10 text-sm font-bold text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-surface-green"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <Icon
                  name="expand_more"
                  size={20}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                />
              </span>
            </label>

            {/* Tag */}
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-on-surface">
                Tag
              </span>
              <span className="relative block">
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="h-11 w-full appearance-none rounded-lg border border-outline bg-surface-muted px-4 pr-10 text-sm font-bold text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-surface-green"
                >
                  {PREDEFINED_TAGS.map((t) => (
                    <option key={t} value={t}>
                      {t === "" ? "None" : t}
                    </option>
                  ))}
                </select>
                <Icon
                  name="expand_more"
                  size={20}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                />
              </span>
            </label>

            {/* Tag Tone */}
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-on-surface">
                Tag Tone
              </span>
              <span className="relative block">
                <select
                  value={tagTone}
                  onChange={(e) =>
                    setTagTone(e.target.value as "green" | "yellow")
                  }
                  className="h-11 w-full appearance-none rounded-lg border border-outline bg-surface-muted px-4 pr-10 text-sm font-bold text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-surface-green"
                >
                  {TAG_TONES.map((tone) => (
                    <option key={tone} value={tone}>
                      {tone.charAt(0).toUpperCase() + tone.slice(1)}
                    </option>
                  ))}
                </select>
                <Icon
                  name="expand_more"
                  size={20}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                />
              </span>
            </label>

            {/* Tag Icon */}
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-on-surface">
                Tag Icon
              </span>
              <span className="relative block">
                <select
                  value={tagIcon}
                  onChange={(e) => setTagIcon(e.target.value)}
                  className="h-11 w-full appearance-none rounded-lg border border-outline bg-surface-muted px-4 pr-10 text-sm font-bold text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-surface-green"
                >
                  {PREDEFINED_ICONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon === "" ? "None" : icon}
                    </option>
                  ))}
                </select>
                <Icon
                  name="expand_more"
                  size={20}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                />
              </span>
            </label>

            {/* Time Label */}
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-on-surface">
                Time Label
              </span>
              <span className="relative block">
                <select
                  value={timeLabel}
                  onChange={(e) => setTimeLabel(e.target.value)}
                  className="h-11 w-full appearance-none rounded-lg border border-outline bg-surface-muted px-4 pr-10 text-sm font-bold text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-surface-green"
                >
                  {PREDEFINED_TIMES.map((time) => (
                    <option key={time} value={time}>
                      {time === "" ? "None" : time}
                    </option>
                  ))}
                </select>
                <Icon
                  name="expand_more"
                  size={20}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                />
              </span>
            </label>

            {/* Visual Subtitle */}
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-on-surface">
                Visual Subtitle
              </span>
              <input
                type="text"
                value={visualSubtitle}
                onChange={(e) => setVisualSubtitle(e.target.value)}
                placeholder="e.g. Soft daylight outfit demo"
                className="h-11 w-full rounded-lg border border-outline bg-surface-muted px-4 text-sm text-on-surface outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-surface-green"
              />
            </label>

            {/* Visual Class */}
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-on-surface">
                Visual Class
              </span>
              <span className="relative block">
                <select
                  value={visualClass}
                  onChange={(e) => setVisualClass(e.target.value)}
                  className="h-11 w-full appearance-none rounded-lg border border-outline bg-surface-muted px-4 pr-10 text-sm font-bold text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-surface-green"
                >
                  {PREDEFINED_VISUALS.map((vis) => (
                    <option key={vis.value} value={vis.value}>
                      {vis.label}
                    </option>
                  ))}
                </select>
                <Icon
                  name="expand_more"
                  size={20}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                />
              </span>
            </label>

            {/* Order Index */}
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-on-surface">
                Order Index
              </span>
              <input
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(Number(e.target.value))}
                min={0}
                className="h-11 w-full rounded-lg border border-outline bg-surface-muted px-4 text-sm text-on-surface outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-surface-green"
              />
            </label>
          </div>
        </section>

        {/* Section B: Image Upload */}
        <section className="rounded-xl border border-outline bg-surface p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 font-display text-base font-extrabold text-on-surface">
            <Icon name="image" size={22} className="text-primary" />
            Image Upload
          </h2>
          <div className="flex flex-col items-start gap-5 sm:flex-row">
            <label className="group relative flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-outline bg-surface-muted transition hover:border-primary sm:w-60">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted transition group-hover:text-primary">
                  <Icon name="cloud_upload" size={32} />
                  <span className="text-xs font-bold">Click to upload</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>
            <div className="text-sm text-muted">
              <p className="font-bold text-on-surface">Upload a prompt image</p>
              <p className="mt-1">
                Accepted formats: JPG, PNG, WebP, GIF. The image will be
                uploaded to the &quot;prompt-images&quot; Supabase Storage
                bucket.
              </p>
              {imageFile && (
                <p className="mt-2 font-bold text-primary">
                  Selected: {imageFile.name} (
                  {(imageFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Section C: Prompt Modes */}
        <section className="rounded-xl border border-outline bg-surface p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 font-display text-base font-extrabold text-on-surface">
            <Icon name="tune" size={22} className="text-primary" />
            Prompt Modes
          </h2>
          <div className="grid gap-5 lg:grid-cols-2">
            {modes.map((field, index) => (
              <label key={`${field.kind}-${field.mode}`} className="block">
                <span className="mb-1.5 flex items-center gap-2 text-sm font-bold text-on-surface">
                  <Icon
                    name={field.kind === "image" ? "image" : "movie"}
                    size={16}
                    className="text-primary"
                  />
                  {field.label}
                </span>
                <textarea
                  value={field.content}
                  onChange={(e) => updateModeContent(index, e.target.value)}
                  placeholder={`Enter ${field.label.toLowerCase()}…`}
                  rows={3}
                  className="min-h-[80px] w-full resize-y rounded-lg border border-outline bg-surface-muted px-4 py-3 text-sm leading-relaxed text-on-surface outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-surface-green"
                />
              </label>
            ))}
          </div>
        </section>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={resetForm}
            className="h-11 rounded-lg border border-outline px-6 text-sm font-bold text-muted transition hover:border-primary hover:text-primary"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-extrabold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-60"
          >
            {loading ? (
              <>
                <Icon
                  name="progress_activity"
                  size={18}
                  className="animate-spin"
                />
                Saving…
              </>
            ) : (
              <>
                <Icon name="save" size={18} />
                Save Prompt
              </>
            )}
          </button>
        </div>
      </form>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-8 right-8 z-[80] flex items-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold shadow-xl ${
            toast.type === "success"
              ? "bg-primary text-white"
              : "bg-red-600 text-white"
          }`}
          role="status"
        >
          <Icon
            name={toast.type === "success" ? "check_circle" : "error"}
            size={20}
          />
          {toast.message}
        </div>
      )}
    </div>
  );
}
