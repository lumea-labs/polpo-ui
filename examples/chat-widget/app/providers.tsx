"use client";

import { PolpoProvider } from "@polpo-ai/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PolpoProvider
      baseUrl={process.env.NEXT_PUBLIC_POLPO_URL || "https://api.polpo.sh"}
      apiKey={process.env.NEXT_PUBLIC_POLPO_API_KEY}
      autoConnect={false}
    >
      {children}
    </PolpoProvider>
  );
}
