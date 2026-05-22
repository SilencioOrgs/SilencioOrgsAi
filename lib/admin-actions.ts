"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "./supabase-server";

interface PromptModeInput {
  kind: "image" | "video";
  mode: "background" | "product" | "persona";
  content: string;
}

interface PromptData {
  title: string;
  category: string;
  tag: string;
  tag_tone: string;
  tag_icon: string;
  time_label: string;
  visual_subtitle: string;
  visual_class: string;
  order_index: number;
  image_url: string | null;
  prompt_modes: PromptModeInput[];
}

export async function addPrompt(
  data: PromptData
): Promise<{ id: string }> {
  const { prompt_modes, ...promptFields } = data;

  const { data: inserted, error: promptError } = await supabaseServer
    .from("prompts")
    .insert({
      ...promptFields,
      author: "@silencioorgs",
    })
    .select("id")
    .single();

  if (promptError || !inserted) {
    throw new Error(promptError?.message ?? "Failed to insert prompt");
  }

  const modesWithPromptId = prompt_modes.map((pm) => ({
    prompt_id: inserted.id as string,
    kind: pm.kind,
    mode: pm.mode,
    content: pm.content,
  }));

  const { error: modesError } = await supabaseServer
    .from("prompt_modes")
    .insert(modesWithPromptId);

  if (modesError) {
    // Clean up the prompt if modes fail
    await supabaseServer.from("prompts").delete().eq("id", inserted.id);
    throw new Error(modesError.message);
  }

  revalidatePath("/admin/manage-prompts");
  revalidatePath("/admin/dashboard");
  revalidatePath("/dashboard");

  return { id: inserted.id as string };
}

export async function updatePrompt(
  id: string,
  data: PromptData
): Promise<void> {
  const { prompt_modes, ...promptFields } = data;

  const { error: promptError } = await supabaseServer
    .from("prompts")
    .update(promptFields)
    .eq("id", id);

  if (promptError) {
    throw new Error(promptError.message);
  }

  // Delete existing modes and re-insert
  const { error: deleteError } = await supabaseServer
    .from("prompt_modes")
    .delete()
    .eq("prompt_id", id);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const modesWithPromptId = prompt_modes.map((pm) => ({
    prompt_id: id,
    kind: pm.kind,
    mode: pm.mode,
    content: pm.content,
  }));

  const { error: modesError } = await supabaseServer
    .from("prompt_modes")
    .insert(modesWithPromptId);

  if (modesError) {
    throw new Error(modesError.message);
  }

  revalidatePath("/admin/manage-prompts");
  revalidatePath("/admin/dashboard");
  revalidatePath("/dashboard");
}

export async function deletePrompt(id: string): Promise<void> {
  const { error } = await supabaseServer
    .from("prompts")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/manage-prompts");
  revalidatePath("/admin/dashboard");
  revalidatePath("/dashboard");
}
