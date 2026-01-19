'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';

export const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-layer-0 app-shell-bg">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col min-w-0 bg-[hsl(var(--bg-1)/0.8)] backdrop-blur">
          <div className="sticky top-0 z-20 flex items-center justify-end gap-3 border-b border-subtle bg-[hsl(var(--bg-1)/0.8)] px-4 py-4 backdrop-blur lg:px-8">
            <TopBar />
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-24 pt-6 lg:px-8 lg:pb-12 animate-page">{children}</div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
};
