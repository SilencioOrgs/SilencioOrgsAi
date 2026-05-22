import { supabaseServer } from "../../lib/supabase-server";
import type { Prompt } from "../../lib/types";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  let prompts: Prompt[] = [];

  try {
    const { data, error } = await supabaseServer
      .from("prompts")
      .select("*, prompt_modes(*)")
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Failed to fetch prompts:", error.message);
    } else if (data) {
      prompts = data as Prompt[];
    }
  } catch (err) {
    console.error("Unexpected error fetching prompts:", err);
  }

  return <DashboardClient prompts={prompts} />;
}
