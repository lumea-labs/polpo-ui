"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon } from "lucide-react";

const nav = [
  { href: "/docs", label: "Docs" },
  { href: "/components/chat", label: "Components" },
  { href: "/examples", label: "Examples" },
];

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = useCallback(() => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }, [dark]);

  return (
    <button
      onClick={toggle}
      className="flex items-center justify-center size-8 rounded-md text-fd-muted-foreground hover:text-fd-foreground transition-colors"
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-fd-background">
      <div className="mx-auto flex h-14 w-full items-center gap-6 px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="625" height="136" viewBox="0 0 625 136" className="h-4 w-auto" fill="currentColor">
            <rect x="0" y="2" width="59" height="59" />
            <rect x="72" y="74" width="59" height="59" />
            <text x="173" y="104" fontFamily="JetBrains Mono, Geist Mono, monospace" fontWeight="700" fontSize="100" letterSpacing="30">POLPO</text>
          </svg>
          <span className="font-mono text-xs font-bold tracking-[0.15em] opacity-40">UI</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-fd-foreground"
                    : "text-fd-muted-foreground hover:text-fd-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <a
            href="https://github.com/lumea-labs/polpo-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center size-8 rounded-md text-fd-muted-foreground hover:text-fd-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden border-t px-4 py-3 flex flex-col gap-1 bg-fd-background">
          {nav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-fd-foreground bg-fd-accent/10"
                    : "text-fd-muted-foreground hover:text-fd-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
