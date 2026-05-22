import { notFound } from "next/navigation";
import { supabaseServer } from "../../../../lib/supabase-server";
import { EditPromptClient } from "./EditPromptClient";

interface PromptModeRow {
  id: string;
  prompt_id: string;
  kind: "image" | "video";
  mode: "background" | "product" | "persona";
  content: string;
}

interface PromptRow {
  id: string;
  title: string;
  category: string;
  tag: string | null;
  tag_tone: string | null;
  tag_icon: string | null;
  author: string | null;
  time_label: string | null;
  visual_subtitle: string | null;
  visual_class: string | null;
  order_index: number | null;
  image_url: string | null;
  created_at: string;
  prompt_modes: PromptModeRow[];
}

export default async function EditPromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await supabaseServer
    .from("prompts")
    .select("*, prompt_modes(*)")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const prompt = data as PromptRow;

  return <EditPromptClient prompt={prompt} />;
}
