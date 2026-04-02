import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col gap-[2px]">
            <div className="h-[10px] w-[10px] bg-current" />
            <div className="ml-[12px] h-[10px] w-[10px] bg-current" />
          </div>
          <span className="font-mono text-xs font-bold tracking-[0.15em]">POLPO UI</span>
        </div>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
