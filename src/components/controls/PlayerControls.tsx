"use client";

import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { Play, Pause, StepForward, RotateCcw, Settings2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useMounted } from '@/hooks/useMounted';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const SORTING_ALGORITHMS = [
  { id: 'bubble', name: 'Bubble Sort', complexity: 'O(n²)' },
  { id: 'selection', name: 'Selection Sort', complexity: 'O(n²)' },
  { id: 'insertion', name: 'Insertion Sort', complexity: 'O(n²)' },
  { id: 'merge', name: 'Merge Sort', complexity: 'O(n log n)' },
  { id: 'quick', name: 'Quick Sort', complexity: 'O(n log n)' },
  { id: 'heap', name: 'Heap Sort', complexity: 'O(n log n)' },
];

const GRAPH_ALGORITHMS = [
  { id: 'bfs', name: 'Breadth-First Search', complexity: 'O(V+E)' },
  { id: 'dfs', name: 'Depth-First Search', complexity: 'O(V+E)' },
];

const PATH_ALGORITHMS = [
  { id: 'dijkstra', name: "Dijkstra's", complexity: 'O((V+E)logV)' },
  { id: 'astar', name: 'A* Search', complexity: 'O(E log V)' },
];

const DS_ALGORITHMS = [
  { id: 'stack', name: 'Stack', complexity: 'O(1) ops' },
  { id: 'queue', name: 'Queue', complexity: 'O(1) ops' },
  { id: 'bst', name: 'Binary Search Tree', complexity: 'O(log n)' },
];

function AlgoButton({ id, name, complexity, active, onClick }: {
  id: string; name: string; complexity: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-left px-3 py-2 rounded-md text-sm transition-all border flex items-center justify-between",
        active
          ? "bg-blue-500/20 text-blue-200 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
          : "border-transparent hover:bg-white/5 hover:text-white"
      )}
    >
      <span>{name}</span>
      <span className={cn(
        "text-[10px] font-mono px-1.5 py-0.5 rounded ml-2 shrink-0",
        complexity.includes('log') || complexity.includes('ops') ? "text-emerald-400 bg-emerald-400/10" : "text-slate-500 bg-white/5"
      )}>{complexity}</span>
    </button>
  );
}

export function PlayerControls() {
  const mounted = useMounted();
  const store = useAlgorithmStore();

  if (!mounted) {
    return <div className="glass-panel p-5 flex flex-col gap-6 h-full text-slate-300 w-80 animate-pulse" />;
  }

  const {
    activeTab,
    activeSortingAlgorithm, setActiveSortingAlgorithm,
    activeGraphAlgorithm, setActiveGraphAlgorithm,
    activePathAlgorithm, setActivePathAlgorithm,
    activeDsAlgorithm, setActiveDsAlgorithm,
    animationSpeed, setAnimationSpeed,
    datasetSize, setDatasetSize,
    playbackState, setPlaybackState,
    setArrayState
  } = store;

  const isPlaying = playbackState === 'playing';
  const isCompleted = playbackState === 'completed';
  const isSorting = activeTab === 'sorting';

  const generateNewArray = (size: number) =>
    Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);

  const handleReset = () => {
    setPlaybackState('idle');
    if (isSorting) setArrayState(generateNewArray(datasetSize));
  };

  const handlePlayPause = () => {
    if (isCompleted) {
      if (isSorting) setArrayState(generateNewArray(datasetSize));
      setPlaybackState('idle');
      setTimeout(() => setPlaybackState('playing'), 60);
    } else {
      setPlaybackState(isPlaying ? 'paused' : 'playing');
    }
  };

  return (
    <div className="glass-panel p-5 flex flex-col gap-5 h-full text-slate-300">
      <div className="flex items-center gap-2 text-white border-b border-white/10 pb-3">
        <Settings2 size={18} className="text-blue-400" />
        <h2 className="font-semibold text-lg tracking-wide">Controls</h2>
      </div>

      <div className="flex flex-col gap-2 flex-1 overflow-y-auto min-h-0">
        <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Algorithm</label>

        {activeTab === 'sorting' && SORTING_ALGORITHMS.map(a => (
          <AlgoButton key={a.id} {...a} active={activeSortingAlgorithm === a.id}
            onClick={() => { if (activeSortingAlgorithm !== a.id) { setActiveSortingAlgorithm(a.id); handleReset(); } }} />
        ))}

        {activeTab === 'graph' && GRAPH_ALGORITHMS.map(a => (
          <AlgoButton key={a.id} {...a} active={activeGraphAlgorithm === a.id}
            onClick={() => { setActiveGraphAlgorithm(a.id); handleReset(); }} />
        ))}

        {activeTab === 'pathfinding' && PATH_ALGORITHMS.map(a => (
          <AlgoButton key={a.id} {...a} active={activePathAlgorithm === a.id}
            onClick={() => { setActivePathAlgorithm(a.id); handleReset(); }} />
        ))}

        {activeTab === 'datastructures' && DS_ALGORITHMS.map(a => (
          <AlgoButton key={a.id} {...a} active={activeDsAlgorithm === a.id}
            onClick={() => { setActiveDsAlgorithm(a.id); handleReset(); }} />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {isSorting && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Dataset Size</span>
              <span className="text-white font-mono">{datasetSize}</span>
            </div>
            <input
              type="range" min="10" max="150" step="5"
              value={datasetSize}
              onChange={(e) => { setDatasetSize(Number(e.target.value)); setPlaybackState('idle'); }}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Animation Speed</span>
            <span className="text-white font-mono">{animationSpeed}x</span>
          </div>
          <input
            type="range" min="1" max="10" step="1"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(Number(e.target.value))}
            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10">
          <button
            onClick={handleReset}
            className="flex items-center justify-center py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors group"
            title="Reset & Shuffle"
          >
            <RotateCcw size={18} className="group-hover:-rotate-90 transition-transform duration-300" />
          </button>

          <button
            onClick={handlePlayPause}
            className={cn(
              "flex items-center justify-center py-3 rounded-lg text-white transition-all shadow-lg",
              isPlaying
                ? "bg-amber-500/20 text-amber-500 border border-amber-500/50"
                : isCompleted
                ? "bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/50"
                : "bg-blue-600 hover:bg-blue-500 border border-blue-400/50 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            )}
            title={isPlaying ? "Pause" : isCompleted ? "Play Again" : "Play"}
          >
            {isPlaying
              ? <Pause size={18} className="fill-current" />
              : <Play size={18} className="fill-current ml-1" />}
          </button>

          <button
            className="flex items-center justify-center py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors opacity-40 cursor-not-allowed"
            title="Step Forward (coming soon)"
            disabled
          >
            <StepForward size={18} />
          </button>
        </div>

        {isCompleted && (
          <div className="text-center text-xs text-emerald-400">
            ✓ Complete — press Play to replay
          </div>
        )}
      </div>
    </div>
  );
}
