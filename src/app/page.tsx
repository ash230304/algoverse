"use client";

import { DashboardLayout } from '@/components/ui/DashboardLayout';
import { PlayerControls } from '@/components/controls/PlayerControls';
import { InfoPanel } from '@/components/panels/InfoPanel';
import { GraphInfoPanel } from '@/components/panels/GraphInfoPanel';
import { PathInfoPanel } from '@/components/panels/PathInfoPanel';
import { DSInfoPanel } from '@/components/panels/DSInfoPanel';
import { SortingCanvas } from '@/components/visualization/SortingCanvas';
import { GraphCanvas } from '@/components/visualization/GraphCanvas';
import { PathCanvas } from '@/components/visualization/PathCanvas';
import { DSCanvas } from '@/components/visualization/DSCanvas';
import { TheoryLab } from '@/components/theory/TheoryLab';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';

export default function Home() {
  const activeTab = useAlgorithmStore(s => s.activeTab);

  // Theory tab: full-width, no side panels
  if (activeTab === 'theory') {
    return (
      <DashboardLayout>
        <TheoryLab />
      </DashboardLayout>
    );
  }

  const rightPanel =
    activeTab === 'graph' ? <GraphInfoPanel /> :
    activeTab === 'pathfinding' ? <PathInfoPanel /> :
    activeTab === 'datastructures' ? <DSInfoPanel /> :
    <InfoPanel />;

  const canvas =
    activeTab === 'graph' ? <GraphCanvas /> :
    activeTab === 'pathfinding' ? <PathCanvas /> :
    activeTab === 'datastructures' ? <DSCanvas /> :
    <SortingCanvas />;

  return (
    <DashboardLayout leftPanel={<PlayerControls />} rightPanel={rightPanel}>
      {canvas}
    </DashboardLayout>
  );
}
