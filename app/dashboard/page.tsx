const documentPanels = [
  { title: "Profile Source", id: "profile-source" },
  { title: "Target Role", id: "target-role" },
  { title: "Optimized Draft", id: "optimized-draft" },
] as const;

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-[var(--text-muted)] uppercase">
          Technical Optimization Suite
        </p>
        <h1 className="mt-2 text-lg font-medium text-[var(--text-bright)]">
          CareerForge
        </h1>
      </header>
      <div className="grid min-h-[55vh] grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {documentPanels.map((panel) => (
          <section
            key={panel.id}
            aria-labelledby={`${panel.id}-title`}
            className="flex min-h-64 flex-col rounded-[var(--radius-panel)] border border-[var(--border-faint)] bg-[var(--surface-card)]"
          >
            <h2
              id={`${panel.id}-title`}
              className="border-b border-[var(--border-faint)] px-4 py-3 font-mono text-xs tracking-wide text-[var(--text-muted)] uppercase"
            >
              {panel.title}
            </h2>
            <div className="flex-1 p-4" />
          </section>
        ))}
      </div>
    </div>
  );
}
