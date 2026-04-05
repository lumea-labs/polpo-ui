export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        /* Hide docs navbar and reset body */
        header { display: none !important; }
        body {
          min-height: auto !important;
          font-family: "DM Sans", system-ui, sans-serif !important;
        }

        /* Reset ALL Tailwind tokens to defaults — isolate from Fumadocs @theme */
        :root {
          --color-gray-50: #f9fafb !important;
          --color-gray-100: #f3f4f6 !important;
          --color-gray-200: #e5e7eb !important;
          --color-gray-300: #d1d5db !important;
          --color-gray-400: #9ca3af !important;
          --color-gray-500: #6b7280 !important;
          --color-gray-600: #4b5563 !important;
          --color-gray-700: #374151 !important;
          --color-gray-800: #1f2937 !important;
          --color-gray-900: #111827 !important;
          --color-blue-50: #eff6ff !important;
          --color-blue-400: #60a5fa !important;
          --color-blue-500: #3b82f6 !important;
          --color-blue-600: #2563eb !important;
          --color-blue-700: #1d4ed8 !important;
          --color-green-600: #16a34a !important;
          --color-green-700: #15803d !important;
          --color-red-50: #fef2f2 !important;
          --color-red-200: #fecaca !important;
          --color-red-500: #ef4444 !important;
          --color-white: #ffffff !important;
          --font-sans: "DM Sans", system-ui, sans-serif !important;
        }

        /* Kill Fumadocs-specific styles that leak in */
        .fd-background, .fd-card, .fd-border, .fd-foreground,
        .fd-muted, .fd-muted-foreground, .fd-primary { all: unset; }
      `}</style>
      {children}
    </>
  );
}
