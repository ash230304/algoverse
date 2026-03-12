import { create } from 'zustand';

export type AppTab = 'sorting' | 'graph' | 'pathfinding' | 'datastructures' | 'theory';
export type PlaybackState = 'idle' | 'playing' | 'paused' | 'completed';

interface AlgorithmStoreState {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;

  // Global Settings
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
  datasetSize: number;
  setDatasetSize: (size: number) => void;
  
  // Playback
  playbackState: PlaybackState;
  setPlaybackState: (state: PlaybackState) => void;
  
  // Sorting
  activeSortingAlgorithm: string;
  setActiveSortingAlgorithm: (algo: string) => void;
  arrayState: number[];
  setArrayState: (arr: number[]) => void;
  elementStates: Record<number, 'normal' | 'comparing' | 'sorted' | 'pivot'>;
  setElementState: (index: number, state: 'normal' | 'comparing' | 'sorted' | 'pivot') => void;
  resetElementStates: () => void;
  clearComparingStates: () => void;

  // Graph Lab
  activeGraphAlgorithm: string;
  setActiveGraphAlgorithm: (algo: string) => void;

  // Pathfinding Lab
  activePathAlgorithm: string;
  setActivePathAlgorithm: (algo: string) => void;

  // Data Structures Lab
  activeDsAlgorithm: string;
  setActiveDsAlgorithm: (algo: string) => void;

  // Live call stack / queue (for graph lab)
  callStack: number[];
  setCallStack: (stack: number[]) => void;
  queueState: number[];
  setQueueState: (q: number[]) => void;

  // Live Statistics
  comparisons: number;
  swaps: number;
  elapsedMs: number;
  incrementComparisons: () => void;
  incrementSwaps: () => void;
  setElapsedMs: (ms: number) => void;
  resetStats: () => void;
}

export const useAlgorithmStore = create<AlgorithmStoreState>((set) => ({
  activeTab: 'sorting',
  setActiveTab: (tab) => set({ activeTab: tab }),

  animationSpeed: 5,
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  
  datasetSize: 50,
  setDatasetSize: (size) => set({ datasetSize: size }),
  
  playbackState: 'idle',
  setPlaybackState: (state) => set({ playbackState: state }),
  
  activeSortingAlgorithm: 'bubble',
  setActiveSortingAlgorithm: (algo) => set({ activeSortingAlgorithm: algo }),
  
  arrayState: [],
  setArrayState: (arr) => set({ arrayState: arr }),
  
  elementStates: {},
  setElementState: (index, state) => set((prev) => ({
    elementStates: { ...prev.elementStates, [index]: state }
  })),
  resetElementStates: () => set({ elementStates: {} }),
  clearComparingStates: () => set((prev) => {
    const next = { ...prev.elementStates };
    for (const key in next) {
      if (next[key] === 'comparing' || next[key] === 'pivot') delete next[key];
    }
    return { elementStates: next };
  }),

  // Graph
  activeGraphAlgorithm: 'bfs',
  setActiveGraphAlgorithm: (algo) => set({ activeGraphAlgorithm: algo }),

  callStack: [],
  setCallStack: (stack) => set({ callStack: stack }),
  queueState: [],
  setQueueState: (q) => set({ queueState: q }),

  // Pathfinding
  activePathAlgorithm: 'dijkstra',
  setActivePathAlgorithm: (algo) => set({ activePathAlgorithm: algo }),

  // Data Structures
  activeDsAlgorithm: 'stack',
  setActiveDsAlgorithm: (algo) => set({ activeDsAlgorithm: algo }),

  // Stats
  comparisons: 0,
  swaps: 0,
  elapsedMs: 0,
  incrementComparisons: () => set((s) => ({ comparisons: s.comparisons + 1 })),
  incrementSwaps: () => set((s) => ({ swaps: s.swaps + 1 })),
  setElapsedMs: (ms) => set({ elapsedMs: ms }),
  resetStats: () => set({ comparisons: 0, swaps: 0, elapsedMs: 0 }),
}));
