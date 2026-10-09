"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { useState, type ReactNode } from "react";

interface DashboardShellProps {
  children: ReactNode;
}

interface NavigationItem {
  label: string;
  href: string;
}

const navigationItems: NavigationItem[] = [
  { label: "Overview", href: "#overview" },
  { label: "Applications", href: "#applications" },
  { label: "Resume Studio", href: "#resume-studio" },
  { label: "Career Paths", href: "#career-paths" },
  { label: "Interview Log", href: "#interview-log" },
];

export function DashboardShell({ children }: DashboardShellProps) {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-bright)]">
      <header className="relative z-20 border-b border-[var(--border-faint)] bg-[var(--background)]">
        <div className="grid min-h-16 grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 sm:gap-4 sm:px-6 lg:grid-cols-[1fr_minmax(16rem,2fr)_1fr] lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-expanded={isNavigationOpen}
              aria-controls="application-navigation"
              onClick={() => setIsNavigationOpen((isOpen) => !isOpen)}
              className="inline-flex size-9 items-center justify-center rounded-[var(--radius-control)] border border-[var(--border-faint)] text-[var(--text-muted)] transition hover:border-[var(--text-muted)] hover:text-[var(--text-bright)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-forge)]"
            >
              <span className="sr-only">
                {isNavigationOpen ? "Close navigation" : "Open navigation"}
              </span>
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="size-4"
              >
                <path
                  d="M3 5h14M3 10h14M3 15h14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
              </svg>
            </button>
            <Link
              href="/"
              className="font-mono text-sm font-semibold tracking-wide text-[var(--text-bright)]"
            >
              CareerForge
            </Link>
          </div>

          <div className="flex min-w-0 items-center justify-center gap-1 sm:gap-2">
            <span className="hidden shrink-0 font-mono text-[10px] tracking-wide text-[var(--text-muted)] uppercase xl:block">
              Active documents
            </span>
            <div className="flex min-w-0 items-center gap-1 rounded-[var(--radius-panel)] border border-[var(--border-faint)] bg-[var(--surface-card)] p-1">
              <button
                type="button"
                aria-current="page"
                className="truncate rounded-[var(--radius-control)] border border-[var(--border-faint)] bg-[var(--background)] px-3 py-1.5 font-mono text-xs text-[var(--text-bright)]"
              >
                <span className="sm:hidden">Resume</span>
                <span className="hidden sm:inline">Resume Draft</span>
              </button>
              <button
                type="button"
                className="hidden truncate px-3 py-1.5 font-mono text-xs text-[var(--text-muted)] transition hover:text-[var(--text-bright)] md:block"
              >
                Target Role
              </button>
            </div>
          </div>

          <div className="flex items-center justify-self-end gap-3">
            <span className="hidden text-right sm:block">
              <span className="block font-mono text-xs text-[var(--text-bright)]">
                System Profile
              </span>
              <span className="block text-[10px] text-[var(--text-muted)]">
                Workspace settings
              </span>
            </span>
            <UserButton />
          </div>
        </div>

        {isNavigationOpen && (
          <nav
            id="application-navigation"
            aria-label="Application tracking"
            className="absolute left-4 top-[calc(100%+0.75rem)] z-30 w-64 rounded-[var(--radius-panel)] border border-[var(--border-faint)] bg-[var(--surface-card)] p-2 shadow-2xl shadow-black/50 sm:left-6 lg:left-8"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-faint)] px-3 py-2">
              <span className="font-mono text-[10px] tracking-wide text-[var(--text-muted)] uppercase">
                Application tracking
              </span>
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setIsNavigationOpen(false)}
                className="rounded px-2 py-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-bright)] focus-visible:outline-2 focus-visible:outline-[var(--accent-forge)]"
              >
                x
              </button>
            </div>
            <ul className="space-y-1 py-2">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsNavigationOpen(false)}
                    className="block rounded-[var(--radius-control)] px-3 py-2 text-sm text-[var(--text-muted)] transition hover:bg-[var(--background)] hover:text-[var(--text-bright)] focus-visible:outline-2 focus-visible:outline-[var(--accent-forge)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
      <main className="relative min-h-[calc(100vh-4rem)]">{children}</main>
    </div>
  );
}
