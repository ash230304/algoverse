"use client";

import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { Activity, TerminalSquare, Clock, FlaskConical, GitBranch, Layers, BookOpen, ChevronRight } from 'lucide-react';
import { useMounted } from '@/hooks/useMounted';
import { useState } from 'react';

// ─── Deep dive step-by-step data ────────────────────────────────────────────
type DeepStep = {
  step: string;
  formula: string;
  note: string;
};
type DeepDive = {
  method: string;
  color: string;
  steps: DeepStep[];
  conclusion: string;
  conclusionColor: string;
};

const DEEP_DIVE: Record<string, DeepDive> = {
  bubble: {
    method: 'Substitution / Telescoping',
    color: 'border-red-500/30',
    steps: [
      { step: 'Recurrence', formula: 'T(n) = T(n−1) + cn', note: 'Each pass compares ~n pairs then reduces problem by 1' },
      { step: 'Expand once', formula: 'T(n) = T(n−2) + c(n−1) + cn', note: 'Substitute T(n−1) = T(n−2) + c(n−1)' },
      { step: 'Expand twice', formula: 'T(n) = T(n−3) + c(n−2) + c(n−1) + cn', note: 'Pattern becomes clear' },
      { step: 'Expand k times', formula: 'T(n) = T(n−k) + c·∑ᵢ₌₁ᵏ (n−i+1)', note: 'Sum of an arithmetic series emerges' },
      { step: 'Base case (k=n)', formula: 'T(n) = T(0) + c·(1 + 2 + ... + n)', note: 'T(0) = O(1), series sums to n(n+1)/2' },
      { step: 'Simplify', formula: 'T(n) = O(1) + c·n(n+1)/2', note: 'Arithmetic series formula applied' },
      { step: 'Final Result', formula: 'T(n) = O(n²)', note: 'Dominant term is n²/2 → drop constants' },
    ],
    conclusion: 'T(n) = O(n²)',
    conclusionColor: 'text-red-400',
  },
  selection: {
    method: 'Substitution / Telescoping',
    color: 'border-red-500/30',
    steps: [
      { step: 'Recurrence', formula: 'T(n) = T(n−1) + cn', note: 'Scan n elements, find min, then sort n−1 remaining' },
      { step: 'Expand k times', formula: 'T(n) = T(0) + c·(1 + 2 + ... + n)', note: 'Same telescoping as Bubble Sort' },
      { step: 'Series', formula: '∑ᵢ₌₁ⁿ i = n(n+1)/2', note: 'Arithmetic sum of first n integers' },
      { step: 'Final Result', formula: 'T(n) = O(n²)', note: 'Note: always n² swaps — no best-case improvement like bubble sort' },
    ],
    conclusion: 'T(n) = O(n²) — always',
    conclusionColor: 'text-red-400',
  },
  insertion: {
    method: 'Case Analysis',
    color: 'border-amber-500/30',
    steps: [
      { step: 'Recurrence', formula: 'T(n) = T(n−1) + cost(i)', note: 'Insert element i into sorted prefix of length i' },
      { step: 'Best Case', formula: 'cost(i) = O(1) each', note: 'Array already sorted → no shifting needed, just compare' },
      { step: '→ Best Total', formula: 'T(n) = O(n)', note: '∑ O(1) × n = O(n)' },
      { step: 'Worst Case', formula: 'cost(i) = O(i) each', note: 'Reverse sorted → shift i−1 elements for each insertion' },
      { step: '→ Worst Total', formula: 'T(n) = ∑ᵢ₌₁ⁿ i = n(n+1)/2', note: 'Sum of 1 to n' },
      { step: 'Final Result', formula: 'T(n) = O(n²) worst / O(n) best', note: 'Best algorithm for nearly-sorted data!' },
    ],
    conclusion: 'Best O(n) · Worst O(n²)',
    conclusionColor: 'text-amber-400',
  },
  merge: {
    method: 'Master Theorem (Case 2)',
    color: 'border-emerald-500/30',
    steps: [
      { step: 'Recurrence', formula: 'T(n) = 2T(n/2) + O(n)', note: '2 subproblems of size n/2, merge costs O(n)' },
      { step: 'Master Theorem', formula: 'T(n) = aT(n/b) + f(n)', note: 'a=2 (branches), b=2 (halving), f(n)=n' },
      { step: 'Compute nˡᵒᵍ_b(a)', formula: 'n^log₂(2) = n¹ = n', note: 'The critical exponent is 1' },
      { step: 'Compare f(n) vs nˡᵒᵍ_b(a)', formula: 'f(n) = n = Θ(n¹)', note: 'f(n) = Θ(n^log_b(a)) → Case 2 applies' },
      { step: 'Apply Case 2', formula: 'T(n) = Θ(n^log_b(a) · log n)', note: 'Multiply by log factor when f(n) matches boundary' },
      { step: 'Tree Verification', formula: 'log₂n levels × O(n) each level', note: 'Every level does exactly O(n) total work, n elements split across calls' },
      { step: 'Final Result', formula: 'T(n) = O(n log n)', note: 'Optimal for comparison-based sorting (proven lower bound)' },
    ],
    conclusion: 'T(n) = Θ(n log n)',
    conclusionColor: 'text-emerald-400',
  },
  quick: {
    method: 'Average Case Analysis',
    color: 'border-emerald-500/30',
    steps: [
      { step: 'Recurrence', formula: 'T(n) = T(k) + T(n−k−1) + O(n)', note: 'k = position of pivot after partition' },
      { step: 'Best Case (k = n/2)', formula: 'T(n) = 2T(n/2) + O(n)', note: 'Perfect pivot splits array exactly in half' },
      { step: '→ Best Case', formula: 'T(n) = O(n log n)', note: 'Same as Merge Sort by Master Theorem Case 2' },
      { step: 'Worst Case (k = 0 or n−1)', formula: 'T(n) = T(n−1) + O(n)', note: 'Sorted input with last-element pivot → always 1 element left' },
      { step: '→ Worst Case', formula: 'T(n) = O(n²)', note: 'Telescopes like Bubble Sort: c·(n + n−1 + ... + 1)' },
      { step: 'Average Case (expected k = n/2)', formula: 'T(n) = 2T(n/2) + O(n)', note: 'Random pivot hits median on average — provable by expectation' },
      { step: 'Final Result', formula: 'T(n) = O(n log n) avg / O(n²) worst', note: 'Fastest in practice due to cache & low constants (≈1.39n log n)' },
    ],
    conclusion: 'Avg O(n log n) · Worst O(n²)',
    conclusionColor: 'text-emerald-400',
  },
  heap: {
    method: 'Phase Analysis',
    color: 'border-emerald-500/30',
    steps: [
      { step: 'Phase 1: Build Heap', formula: 'T_build = ∑ᵢ₌₁ʰ (h − i) · 2ⁱ', note: 'Bottom-up heapify: nodes at level i have height h−i' },
      { step: 'Simplify sum', formula: '= ∑ᵢ₌₀ʰ i · 2^(h−i)', note: 'Geometric-arithmetic series' },
      { step: 'Series result', formula: '≤ n · ∑ᵢ₌₀^∞ i/2ⁱ = 2n', note: 'Series ∑ i/2ⁱ converges to 2' },
      { step: '→ Build Phase', formula: 'T_build = O(n)', note: 'Counter-intuitive: building the heap is LINEAR, not O(n log n)!' },
      { step: 'Phase 2: Extract Max (n−1 times)', formula: 'T_extract = ∑ᵢ₌₁ⁿ log i', note: 'Each extract-max calls heapify on shrinking heap of size i' },
      { step: 'Simplify', formula: '∑ᵢ₌₁ⁿ log i = log(n!) ≈ n log n', note: "Stirling's approximation: log(n!) = Θ(n log n)" },
      { step: 'Total', formula: 'T(n) = O(n) + O(n log n)', note: 'Build phase dominated by extraction phase' },
      { step: 'Final Result', formula: 'T(n) = O(n log n)', note: 'Always O(n log n) — no variance unlike QuickSort' },
    ],
    conclusion: 'T(n) = Θ(n log n) — always',
    conclusionColor: 'text-emerald-400',
  },
};

// ─── Deep Dive Component ─────────────────────────────────────────────────────
function DeepDiveSection({ algo }: { algo: string }) {
  const [expanded, setExpanded] = useState(true);
  const data = DEEP_DIVE[algo];
  if (!data) return null;

  return (
    <div className="glass-panel flex-shrink-0">
      <button
        onClick={() => setExpanded(e => !e)}
        className={`w-full p-4 flex items-center gap-2 text-white border-b ${expanded ? 'border-white/10' : 'border-transparent'} hover:bg-white/2 transition-colors`}
      >
        <BookOpen size={15} className="text-cyan-400" />
        <h2 className="font-semibold text-sm text-left">Complexity Deep Dive</h2>
        <span className="ml-2 text-[10px] text-cyan-600 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full font-mono">
          {data.method}
        </span>
        <ChevronRight
          size={14}
          className={`ml-auto text-slate-500 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
        />
      </button>

      {expanded && (
        <div className="p-4 flex flex-col gap-2">
          {data.steps.map((s, i) => (
            <div key={i} className={`rounded-lg border p-3 ${data.color} bg-black/20`}>
              {/* Step header */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider w-14 shrink-0">{s.step}</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              {/* Formula */}
              <div className="bg-[#0d1117] rounded-md px-3 py-2 mb-1.5 text-center">
                <code className="text-cyan-300 font-mono text-xs font-bold tracking-wide">{s.formula}</code>
              </div>
              {/* Note */}
              <p className="text-[10px] text-slate-500 leading-relaxed">{s.note}</p>
            </div>
          ))}

          {/* Conclusion */}
          <div className={`mt-1 rounded-lg border border-white/10 bg-black/40 p-3 flex items-center justify-between`}>
            <span className="text-[10px] uppercase tracking-wider text-slate-500">∴ Result</span>
            <code className={`font-mono text-base font-bold ${data.conclusionColor}`}>{data.conclusion}</code>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Also reusable for other panels ─────────────────────────────────────────
export function GenericDeepDive({ title, method, color, steps, conclusion, conclusionColor }: {
  title?: string; method: string; color: string;
  steps: DeepStep[]; conclusion: string; conclusionColor: string;
}) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="glass-panel flex-shrink-0">
      <button
        onClick={() => setExpanded(e => !e)}
        className={`w-full p-4 flex items-center gap-2 text-white border-b ${expanded ? 'border-white/10' : 'border-transparent'} transition-colors`}
      >
        <BookOpen size={15} className="text-cyan-400" />
        <h2 className="font-semibold text-sm text-left">{title ?? 'Complexity Deep Dive'}</h2>
        <span className="ml-2 text-[10px] text-cyan-600 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full font-mono">{method}</span>
        <ChevronRight size={14} className={`ml-auto text-slate-500 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
      </button>
      {expanded && (
        <div className="p-4 flex flex-col gap-2">
          {steps.map((s, i) => (
            <div key={i} className={`rounded-lg border p-3 ${color} bg-black/20`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider w-14 shrink-0">{s.step}</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              <div className="bg-[#0d1117] rounded-md px-3 py-2 mb-1.5 text-center">
                <code className="text-cyan-300 font-mono text-xs font-bold tracking-wide">{s.formula}</code>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">{s.note}</p>
            </div>
          ))}
          <div className="mt-1 rounded-lg border border-white/10 bg-black/40 p-3 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-slate-500">∴ Result</span>
            <code className={`font-mono text-base font-bold ${conclusionColor}`}>{conclusion}</code>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Remaining helpers identical to previous version ─────────────────────────
type AlgoMeta = {
  timeBest: string; timeAvg: string; timeWorst: string; space: string;
  description: string; recurrence: string; recurrenceExplain: string; code: string;
};

const ALGO_META: Record<string, AlgoMeta> = {
  bubble: {
    timeBest: 'O(n)', timeAvg: 'O(n²)', timeWorst: 'O(n²)', space: 'O(1)',
    description: 'Repeatedly swaps adjacent elements in the wrong order. Simple but slow.',
    recurrence: 'T(n) = T(n − 1) + O(n)',
    recurrenceExplain: 'Each pass reduces unsorted region by 1. n passes of up to n comparisons → O(n²).',
    code: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++)
    for (let j = 0; j < arr.length - i - 1; j++)
      if (arr[j] > arr[j+1])
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
}`,
  },
  selection: {
    timeBest: 'O(n²)', timeAvg: 'O(n²)', timeWorst: 'O(n²)', space: 'O(1)',
    description: 'Finds the minimum each pass and places it at the front.',
    recurrence: 'T(n) = T(n − 1) + O(n)',
    recurrenceExplain: 'Scan n, n-1, …, 1 elements. Sum = n(n+1)/2 = O(n²).',
    code: `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let min = i;
    for (let j = i+1; j < arr.length; j++)
      if (arr[j] < arr[min]) min = j;
    [arr[i], arr[min]] = [arr[min], arr[i]];
  }
}`,
  },
  insertion: {
    timeBest: 'O(n)', timeAvg: 'O(n²)', timeWorst: 'O(n²)', space: 'O(1)',
    description: 'Builds sorted portion by inserting each element into its correct position.',
    recurrence: 'T(n) = T(n − 1) + O(n)',
    recurrenceExplain: 'Best O(n) for sorted; worst O(n²) for reverse-sorted.',
    code: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i], j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j+1] = arr[j]; j--;
    }
    arr[j+1] = key;
  }
}`,
  },
  merge: {
    timeBest: 'O(n log n)', timeAvg: 'O(n log n)', timeWorst: 'O(n log n)', space: 'O(n)',
    description: 'Divide-and-conquer: split in half, sort each half, merge them back.',
    recurrence: 'T(n) = 2T(n/2) + O(n)',
    recurrenceExplain: 'Master Theorem Case 2: a=2, b=2, f(n)=O(n) → T(n)=O(n log n).',
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const L = mergeSort(arr.slice(0, mid));
  const R = mergeSort(arr.slice(mid));
  return merge(L, R);
}`,
  },
  quick: {
    timeBest: 'O(n log n)', timeAvg: 'O(n log n)', timeWorst: 'O(n²)', space: 'O(log n)',
    description: 'Picks a pivot, partitions around it, recursively sorts each side.',
    recurrence: 'T(n) = T(k) + T(n−k−1) + O(n)',
    recurrenceExplain: 'Avg: T(n)=2T(n/2)+O(n)→O(n log n). Worst (sorted+bad pivot): O(n²).',
    code: `function quickSort(arr, lo, hi) {
  if (lo < hi) {
    const p = partition(arr, lo, hi);
    quickSort(arr, lo, p - 1);
    quickSort(arr, p + 1, hi);
  }
}`,
  },
  heap: {
    timeBest: 'O(n log n)', timeAvg: 'O(n log n)', timeWorst: 'O(n log n)', space: 'O(1)',
    description: 'Builds max-heap, repeatedly extracts max to build sorted array.',
    recurrence: 'T(n) = T(n − 1) + O(log n)',
    recurrenceExplain: 'Build heap O(n) + extract-max n times × O(log n) = O(n log n).',
    code: `function heapSort(arr) {
  for (let i = Math.floor(arr.length/2)-1; i >= 0; i--)
    heapify(arr, arr.length, i);
  for (let i = arr.length-1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
}`,
  },
};

type TreeNode = { label: string; children: TreeNode[]; merge?: string };

function buildMergeTree(l: number, r: number, depth: number): TreeNode {
  if (r - l <= 0) return { label: `[${l}]`, children: [] };
  const mid = l + Math.floor((r - l) / 2);
  return {
    label: `[${l}..${r}]`, merge: `O(${r - l + 1})`,
    children: depth < 3 ? [buildMergeTree(l, mid, depth + 1), buildMergeTree(mid + 1, r, depth + 1)] : [],
  };
}

function buildQuickTree(lo: number, hi: number, depth: number): TreeNode {
  if (lo >= hi) return { label: lo === hi ? `[${lo}]` : '∅', children: [] };
  const pivot = Math.floor((lo + hi) / 2);
  return {
    label: `[${lo}..${hi}] p=${pivot}`,
    children: depth < 3 ? [buildQuickTree(lo, pivot - 1, depth + 1), buildQuickTree(pivot + 1, hi, depth + 1)] : [],
  };
}

function TreeNodeView({ node, depth }: { node: TreeNode; depth: number }) {
  if (depth > 3) return null;
  const colors = ['text-blue-400', 'text-purple-400', 'text-cyan-400', 'text-emerald-400'];
  const color = colors[depth % colors.length];
  return (
    <div className="flex flex-col items-center">
      <div className={`px-2 py-0.5 rounded text-[10px] font-mono border ${color} border-current/20 bg-black/40 whitespace-nowrap`}>{node.label}</div>
      {node.merge && <div className="text-[9px] text-slate-600 font-mono mt-0.5">{node.merge}</div>}
      {node.children.length > 0 && (
        <div className="flex gap-3 mt-1">
          {node.children.map((child, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-px h-2 bg-slate-700" />
              <TreeNodeView node={child} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LoopStack({ algo, n = 8 }: { algo: string; n?: number }) {
  const frames = algo === 'bubble'
    ? [{ label: `outer i = 0 → ${n - 1}`, desc: 'Pass loop' }, { label: `inner j = 0 → n−i−1`, desc: 'Compare loop' }, { label: `if arr[j] > arr[j+1] → swap`, desc: 'Swap check' }]
    : algo === 'selection'
    ? [{ label: `outer i = 0 → ${n - 2}`, desc: 'Pass loop' }, { label: `inner j = i+1 → n−1`, desc: 'Find min loop' }, { label: `arr[i] ↔ arr[min]`, desc: 'Placement' }]
    : [{ label: `outer i = 1 → ${n - 1}`, desc: 'Pass loop' }, { label: `while arr[j] > key`, desc: 'Shift loop' }, { label: `arr[j+1] = key`, desc: 'Insert' }];
  return (
    <div className="flex flex-col-reverse gap-1">
      {frames.map((f, i) => (
        <div key={i} className={`flex items-center justify-between px-3 py-1.5 rounded-md border text-[11px] font-mono ${i === frames.length - 1 ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : 'bg-black/30 border-white/5 text-slate-400'}`}>
          <span>{f.label}</span>
          <span className="text-[9px] text-slate-600">{f.desc}</span>
        </div>
      ))}
      <div className="text-center text-[10px] text-slate-600 pb-1">▲ CALL FRAMES ▲</div>
    </div>
  );
}

function ComplexityBadge({ label, value }: { label: string; value: string }) {
  const color = value.includes('n²') ? 'text-red-400' : value.includes('log') || value === 'O(n)' || value === 'O(1)' ? 'text-emerald-400' : 'text-amber-400';
  return (
    <div className="bg-black/30 p-2 rounded-lg border border-white/5 flex flex-col gap-0.5">
      <div className="text-[9px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`text-sm font-mono font-bold ${color}`}>{value}</div>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
export function InfoPanel() {
  const mounted = useMounted();
  const store = useAlgorithmStore();

  if (!mounted) return <div className="flex flex-col gap-4 h-full w-80 animate-pulse" />;

  const { activeSortingAlgorithm, comparisons, swaps, elapsedMs, playbackState, datasetSize } = store;
  const meta = ALGO_META[activeSortingAlgorithm] ?? ALGO_META.bubble;
  const isRecursive = activeSortingAlgorithm === 'merge' || activeSortingAlgorithm === 'quick';
  const treeN = Math.min(datasetSize, 8);

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto pr-0.5">
      {/* Description */}
      <div className="glass-panel p-4 text-slate-400 text-xs leading-relaxed border-l-2 border-blue-500/50 flex-shrink-0">
        <span className="text-blue-300 font-semibold">{activeSortingAlgorithm.charAt(0).toUpperCase() + activeSortingAlgorithm.slice(1)} Sort: </span>
        {meta.description}
      </div>

      {/* Live Stats */}
      <div className="glass-panel p-4 text-slate-300 flex-shrink-0">
        <div className="flex items-center gap-2 text-white border-b border-white/10 pb-2 mb-3">
          <Activity size={15} className="text-green-400" />
          <h2 className="font-semibold text-sm">Live Statistics</h2>
          {playbackState === 'completed' && elapsedMs > 0 && (
            <span className="ml-auto flex items-center gap-1 text-xs text-emerald-400">
              <Clock size={12} /> {(elapsedMs / 1000).toFixed(2)}s
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-black/30 p-3 rounded-lg border border-white/5">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Comparisons</div>
            <div className="text-2xl font-mono text-amber-400">{comparisons.toLocaleString()}</div>
          </div>
          <div className="bg-black/30 p-3 rounded-lg border border-white/5">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Swaps</div>
            <div className="text-2xl font-mono text-blue-400">{swaps.toLocaleString()}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ComplexityBadge label="Best Case" value={meta.timeBest} />
          <ComplexityBadge label="Average" value={meta.timeAvg} />
          <ComplexityBadge label="Worst Case" value={meta.timeWorst} />
          <ComplexityBadge label="Space" value={meta.space} />
        </div>
      </div>

      {/* Recurrence summary */}
      <div className="glass-panel p-4 text-slate-300 flex-shrink-0">
        <div className="flex items-center gap-2 text-white border-b border-white/10 pb-2 mb-3">
          <FlaskConical size={15} className="text-amber-400" />
          <h2 className="font-semibold text-sm">Recurrence</h2>
        </div>
        <div className="bg-[#0d1117] rounded-lg px-4 py-3 border border-white/5 mb-2 text-center">
          <code className="text-amber-300 font-mono text-sm font-bold">{meta.recurrence}</code>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">{meta.recurrenceExplain}</p>
      </div>

      {/* 🆕 Deep Dive — step by step derivation */}
      <DeepDiveSection algo={activeSortingAlgorithm} />

      {/* Recursion Tree / Loop Stack */}
      <div className="glass-panel p-4 text-slate-300 flex-shrink-0">
        <div className="flex items-center gap-2 text-white border-b border-white/10 pb-2 mb-3">
          {isRecursive ? <GitBranch size={15} className="text-purple-400" /> : <Layers size={15} className="text-blue-400" />}
          <h2 className="font-semibold text-sm">{isRecursive ? `Recursion Tree (n=${treeN})` : 'Call Frames'}</h2>
        </div>
        <div className="overflow-x-auto py-1">
          {isRecursive ? (
            <div className="flex justify-center">
              {activeSortingAlgorithm === 'merge'
                ? <TreeNodeView node={buildMergeTree(0, treeN - 1, 0)} depth={0} />
                : <TreeNodeView node={buildQuickTree(0, treeN - 1, 0)} depth={0} />}
            </div>
          ) : (
            <LoopStack algo={activeSortingAlgorithm} n={Math.min(datasetSize, 12)} />
          )}
        </div>
      </div>

      {/* Code */}
      <div className="glass-panel p-4 text-slate-300 flex flex-col">
        <div className="flex items-center gap-2 text-white border-b border-white/10 pb-2 mb-3">
          <TerminalSquare size={15} className="text-purple-400" />
          <h2 className="font-semibold text-sm">Implementation</h2>
        </div>
        <div className="bg-[#0d1117] rounded-lg p-3 border border-white/5">
          <pre className="text-[11px] font-mono text-slate-300 leading-relaxed whitespace-pre">
            <code>{meta.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
