import Link from "next/link";
import { supabaseServer } from "../../../lib/supabase-server";
import { Icon } from "../../components/Icon";
import { DeletePromptButton } from "./DeletePromptButton";

interface PromptRow {
  id: string;
  title: string;
  category: string;
  tag: string | null;
  order_index: number | null;
  image_url: string | null;
  created_at: string;
}

export default async function ManagePromptsPage() {
  const { data, error } = await supabaseServer
    .from("prompts")
    .select("id, title, category, tag, order_index, image_url, created_at")
    .order("order_index", { ascending: true });

  const prompts = (data ?? []) as PromptRow[];

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-on-surface">
            Manage Prompts
          </h1>
          <p className="mt-1 text-sm text-muted">
            {prompts.length} prompt{prompts.length === 1 ? "" : "s"} total
          </p>
        </div>
        <Link
          href="/admin/add-prompt"
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-extrabold text-white shadow-sm transition hover:bg-primary-hover"
        >
          <Icon name="add" size={20} />
          Add New Prompt
        </Link>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          <Icon name="error" size={18} />
          Failed to load prompts: {error.message}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-outline bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-outline-soft bg-surface-muted text-xs font-bold uppercase tracking-wider text-muted">
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Tag</th>
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-soft">
              {prompts.length > 0 ? (
                prompts.map((prompt) => (
                  <tr
                    key={prompt.id}
                    className="transition hover:bg-surface-muted"
                  >
                    <td className="px-6 py-3">
                      {prompt.image_url ? (
                        <img
                          src={prompt.image_url}
                          alt={prompt.title}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="grid h-12 w-12 place-items-center rounded-lg bg-surface-green text-primary">
                          <Icon name="image" size={20} />
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 font-bold text-on-surface">
                      {prompt.title}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-muted">
                      {prompt.category}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3">
                      {prompt.tag ? (
                        <span className="inline-flex rounded-full bg-surface-green px-2.5 py-0.5 text-xs font-bold text-primary">
                          {prompt.tag}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-muted">
                      {prompt.order_index ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/edit-prompt/${prompt.id}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-outline bg-surface px-3 text-xs font-bold text-muted transition hover:border-primary hover:text-primary"
                        >
                          <Icon name="edit" size={15} />
                          Edit
                        </Link>
                        <DeletePromptButton
                          promptId={prompt.id}
                          promptTitle={prompt.title}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-muted"
                  >
                    No prompts found. Click &quot;Add New Prompt&quot; to create
                    one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
