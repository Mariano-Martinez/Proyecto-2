'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { ScrollReveal } from './ScrollReveal';

export const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-layer-0">
      <ScrollReveal />
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col min-w-0">
          <div className="flex items-center justify-between gap-3 px-4 pt-4 lg:px-8 lg:pt-6">
            <div className="hidden lg:block">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">TrackHub AR</p>
              <p className="text-sm font-semibold text-strong">Panel operativo</p>
            </div>
            <TopBar />
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4 lg:px-8 lg:pb-12 lg:pt-6">{children}</div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
};
