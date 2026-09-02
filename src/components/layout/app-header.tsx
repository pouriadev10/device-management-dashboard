export function AppHeader() {
  return (
    <header className="bg-surface border-b">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        <span
          aria-hidden
          className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-xl text-sm font-bold"
        >
          DM
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Device Management</p>
          <p className="text-muted text-xs">Network operations console</p>
        </div>
      </div>
    </header>
  );
}
