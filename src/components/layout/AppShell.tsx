'use client';

import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

type AppShellProps = {
  children: ReactNode;
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
  primaryActionHref?: string;
};

export const AppShell = ({ children, onPrimaryAction, primaryActionLabel, primaryActionHref }: AppShellProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
      <div className="relative min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:pl-72">
          <TopHeader
            onMenu={() => setSidebarOpen(true)}
            onPrimaryAction={onPrimaryAction}
            primaryActionLabel={primaryActionLabel}
            primaryActionHref={primaryActionHref}
          />
          <main className="flex-1 px-4 pb-12 pt-6 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
};
