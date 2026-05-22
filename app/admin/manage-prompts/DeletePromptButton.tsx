"use client";

import { useState } from "react";
import { Icon } from "../../components/Icon";
import { deletePrompt } from "../../../lib/admin-actions";

interface DeletePromptButtonProps {
  promptId: string;
  promptTitle: string;
}

export function DeletePromptButton({
  promptId,
  promptTitle,
}: DeletePromptButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await deletePrompt(promptId);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-red-600 px-3 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
        >
          {loading ? (
            <Icon name="progress_activity" size={14} className="animate-spin" />
          ) : (
            <Icon name="delete" size={14} />
          )}
          {loading ? "Deleting…" : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="inline-flex h-9 items-center rounded-lg border border-outline px-3 text-xs font-bold text-muted transition hover:text-on-surface"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`Delete "${promptTitle}"`}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-outline bg-surface px-3 text-xs font-bold text-muted transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
    >
      <Icon name="delete" size={15} />
      Delete
    </button>
  );
}
