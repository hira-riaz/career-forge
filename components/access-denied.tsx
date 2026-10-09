interface AccessDeniedProps {
  title?: string;
  description?: string;
}

export function AccessDenied({
  title = "Access restricted",
  description = "Your system profile does not have permission to view this workspace.",
}: AccessDeniedProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 py-12 text-center text-[var(--text-bright)]">
      <section
        aria-labelledby="access-denied-title"
        className="flex max-w-md flex-col items-center rounded-[var(--radius-panel)] border border-[var(--border-faint)] bg-[var(--surface-card)] px-8 py-10"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 48 48"
          fill="none"
          className="mb-6 size-12 text-[var(--text-muted)]"
        >
          <path
            d="M15 21v-6a9 9 0 0 1 18 0v6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
          />
          <path
            d="M11 21h26v20H11z"
            fill="var(--background)"
            stroke="var(--accent-forge)"
            strokeWidth="2"
          />
          <path
            d="M24 29v5m0-8v.5"
            stroke="var(--text-bright)"
            strokeWidth="2"
            strokeLinecap="square"
          />
        </svg>
        <h1
          id="access-denied-title"
          className="font-mono text-base font-medium tracking-wide"
        >
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
          {description}
        </p>
      </section>
    </main>
  );
}
