"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "../components/Icon";

const navLinks = [
  { href: "/admin/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/admin/add-prompt", icon: "add_circle", label: "Add Prompt" },
  { href: "/admin/manage-prompts", icon: "list_alt", label: "Manage Prompts" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-outline bg-surface">
      {/* Brand */}
      <div className="flex h-[74px] items-center gap-3 border-b border-outline-soft px-6">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-sm font-extrabold text-white">
          SO
        </span>
        <span className="font-display text-lg font-extrabold text-primary">
          Silencio Orgs
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-muted">
          Admin Panel
        </p>
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold transition ${
                isActive
                  ? "bg-surface-green text-primary"
                  : "text-muted hover:bg-surface-muted hover:text-primary"
              }`}
            >
              <Icon name={link.icon} size={20} filled={isActive} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-outline-soft p-4">
        <button
          onClick={handleLogout}
          type="button"
          className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-bold text-muted transition hover:bg-red-50 hover:text-red-600"
        >
          <Icon name="logout" size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
