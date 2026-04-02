import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="625" height="136" viewBox="0 0 625 136" className="h-5 w-auto" fill="currentColor">
            <rect x="0" y="2" width="59" height="59" />
            <rect x="72" y="74" width="59" height="59" />
            <text x="173" y="104" fontFamily="JetBrains Mono, Geist Mono, monospace" fontWeight="700" fontSize="100" letterSpacing="30">POLPO</text>
          </svg>
          <span className="font-mono text-sm font-bold tracking-[0.15em] opacity-40">UI</span>
        </div>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
