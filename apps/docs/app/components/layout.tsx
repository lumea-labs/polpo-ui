import { componentsSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/components2'>) {
  return (
    <DocsLayout
      tree={componentsSource.getPageTree()}
      {...baseOptions()}
      sidebar={{ collapsible: false }}
      themeSwitch={{ enabled: false }}
      containerProps={{
        style: {
          "--fd-docs-height": "100dvh",
          "--fd-docs-row-1": "3.5rem",
        } as React.CSSProperties,
      }}
    >
      {children}
    </DocsLayout>
  );
}
