import Link from "next/link";
import { supabaseServer } from "../../../lib/supabase-server";
import { Icon } from "../../components/Icon";

interface PromptRow {
  id: string;
  title: string;
  category: string;
  tag: string | null;
  order_index: number | null;
  created_at: string;
}

export default async function AdminDashboardPage() {
  // Fetch counts
  const [promptsResult, modesResult] = await Promise.all([
    supabaseServer.from("prompts").select("id, title, category, tag, order_index, created_at"),
    supabaseServer.from("prompt_modes").select("id", { count: "exact", head: true }),
  ]);

  const prompts = (promptsResult.data ?? []) as PromptRow[];
  const totalModes = modesResult.count ?? 0;

  const uniqueCategories = new Set(prompts.map((p) => p.category));
  const recentPrompts = prompts
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  const stats = [
    {
      label: "Total Prompts",
      value: prompts.length,
      icon: "article",
      color: "bg-primary text-white",
    },
    {
      label: "Total Categories",
      value: uniqueCategories.size,
      icon: "category",
      color: "bg-surface-green text-primary",
    },
    {
      label: "Total Prompt Modes",
      value: totalModes,
      icon: "tune",
      color: "bg-surface-muted text-secondary",
    },
  ];

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-on-surface">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted">
            Overview of your prompts and content.
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

      {/* Stat Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-xl border border-outline bg-surface p-5 shadow-sm transition hover:shadow-md"
          >
            <div
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${stat.color}`}
            >
              <Icon name={stat.icon} size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-muted">{stat.label}</p>
              <p className="font-display text-2xl font-extrabold text-on-surface">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Prompts Table */}
      <div className="rounded-xl border border-outline bg-surface shadow-sm">
        <div className="flex items-center justify-between border-b border-outline-soft px-6 py-4">
          <h2 className="font-display text-lg font-extrabold text-on-surface">
            Recent Prompts
          </h2>
          <Link
            href="/admin/manage-prompts"
            className="text-sm font-bold text-primary transition hover:text-primary-hover"
          >
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-outline-soft bg-surface-muted text-xs font-bold uppercase tracking-wider text-muted">
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Tag</th>
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-soft">
              {recentPrompts.length > 0 ? (
                recentPrompts.map((prompt) => (
                  <tr
                    key={prompt.id}
                    className="transition hover:bg-surface-muted"
                  >
                    <td className="whitespace-nowrap px-6 py-3.5 font-bold text-on-surface">
                      {prompt.title}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3.5 text-muted">
                      {prompt.category}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3.5">
                      {prompt.tag ? (
                        <span className="inline-flex rounded-full bg-surface-green px-2.5 py-0.5 text-xs font-bold text-primary">
                          {prompt.tag}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3.5 text-muted">
                      {prompt.order_index ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3.5 text-muted">
                      {new Date(prompt.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-muted"
                  >
                    No prompts yet. Click &quot;Add New Prompt&quot; to get
                    started.
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
