"use client";

import { TopNav } from './TopNav';

export function DashboardLayout({ children, leftPanel, rightPanel }: { children: React.ReactNode; leftPanel?: React.ReactNode; rightPanel?: React.ReactNode }) {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-algoverse-darker relative">
      {/* Background Decorators */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />

      <TopNav />

      <main className="flex-1 flex mt-16 p-4 gap-4 relative z-10 w-full h-[calc(100vh-4rem)]">
        {/* Left Control Panel */}
        {leftPanel && (
          <aside className="w-80 h-full shrink-0 flex flex-col gap-4">
            {leftPanel}
          </aside>
        )}

        {/* Center 3D Canvas */}
        <section className="flex-1 h-full rounded-2xl overflow-hidden glass-panel relative">
          {children}
        </section>

        {/* Right Info Panel */}
        {rightPanel && (
          <aside className="w-80 h-full shrink-0 flex flex-col gap-4">
            {rightPanel}
          </aside>
        )}
      </main>
    </div>
  );
}
