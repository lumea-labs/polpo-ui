"use client";

export function MessageBubbleDemo() {
  return (
    <div className="rounded-xl border border-fd-border bg-fd-card overflow-hidden">
      <div className="p-6 space-y-4">
        {/* User message */}
        <div className="flex justify-end">
          <div className="group flex flex-col items-end gap-1.5">
            {/* File attachment */}
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-fd-border bg-fd-muted/30 px-2.5 py-1.5 text-xs">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              schema.prisma
            </span>
            <div className="w-fit max-w-[80%] rounded-[18px_18px_4px_18px] bg-fd-primary/10 px-4 py-3">
              <p className="text-sm">Can you add a users table with email and role fields?</p>
            </div>
            <span className="text-[11px] text-fd-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity">2m ago</span>
          </div>
        </div>

        {/* Assistant message */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-fd-primary/10 text-fd-primary">
              <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <span className="text-[13px] font-semibold text-fd-foreground">coder</span>
          </div>
          <p className="text-sm text-fd-foreground">
            I&apos;ll add the users table with email validation and a role enum. Let me update your schema and run the migration.
          </p>
        </div>
      </div>
    </div>
  );
}
