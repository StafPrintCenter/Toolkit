export function ToolkitFooter() {
  return (
    <footer className="border-t border-border/70 bg-card/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>STAF PRINT CENTER — Porto-Novo, Bénin. Tous les calculs restent dans votre navigateur.</p>
        <div className="flex gap-4">
          <a className="hover:text-primary" href="https://brief.stafprint.com" target="_blank" rel="noreferrer">
            brief
          </a>
          <a className="hover:text-primary" href="https://docs.stafprint.com" target="_blank" rel="noreferrer">
            docs
          </a>
        </div>
      </div>
    </footer>
  );
}
