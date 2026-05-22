export interface PromptModeRow {
  id: string;
  prompt_id: string;
  kind: "image" | "video";
  mode: "background" | "product" | "persona";
  content: string;
}

export interface Prompt {
  id: string;
  title: string;
  category: string;
  tag: string;
  tag_tone: "green" | "yellow";
  tag_icon: string;
  author: string;
  time_label: string;
  visual_subtitle: string;
  visual_class: string;
  order_index: number;
  created_at: string;
  prompt_modes: PromptModeRow[];
}

export type PromptKind = "image" | "video";

export type PromptModeType = "background" | "product" | "persona";
