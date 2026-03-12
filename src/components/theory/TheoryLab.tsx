// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from 'react';
import {
  BookOpen, Cpu, Sigma, GitBranch, FlaskConical,
  ChevronDown, ChevronRight, Zap, Search, Network,
  BarChart2, Hash, Layers, TrendingUp, CheckCircle2, Circle, Microscope
} from 'lucide-react';
import { AlgorithmAnalysis } from './AlgorithmAnalysis';
import { TreesLab } from './TreesLab';
// ─── Utility ─────────────────────────────────────────────────────────────────
function SectionCard({ icon, title, color, children }: {
  icon: React.ReactNode; title: string; color: string; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className={`bg-[#0a1628]/80 border border-white/8 rounded-2xl overflow-hidden shadow-xl`}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-3 p-5 text-left border-b border-white/5 hover:bg-white/2 transition-colors`}
      >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
        <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
        {open ? <ChevronDown size={18} className="ml-auto text-slate-500" /> : <ChevronRight size={18} className="ml-auto text-slate-500" />}
      </button>
      {open && <div className="p-5">{children}</div>}
    </div>
  );
}

function Tag({ children, color = 'bg-blue-500/15 text-blue-300 border-blue-500/20' }: { children: React.ReactNode; color?: string }) {
  return <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${color}`}>{children}</span>;
}

function Card({ title, desc, icon, color }: { title: string; desc: string; icon?: string; color: string }) {
  return (
    <div className={`rounded-xl border p-4 bg-black/20 ${color} flex flex-col gap-1.5`}>
      {icon && <span className="text-2xl">{icon}</span>}
      <div className="text-sm font-bold text-white">{title}</div>
      <div className="text-[11px] text-slate-400 leading-relaxed">{desc}</div>
    </div>
  );
}

// ─── Section 1: Notion of an Algorithm ──────────────────────────────────────
const ALGO_PROPERTIES = [
  { label: 'Input', icon: '📥', color: 'border-blue-500/30 bg-blue-500/5', desc: 'Zero or more quantities are externally supplied' },
  { label: 'Output', icon: '📤', color: 'border-emerald-500/30 bg-emerald-500/5', desc: 'At least one quantity is produced as result' },
  { label: 'Definiteness', icon: '📐', color: 'border-purple-500/30 bg-purple-500/5', desc: 'Each step must be clear, unambiguous, and precise' },
  { label: 'Finiteness', icon: '⏱️', color: 'border-amber-500/30 bg-amber-500/5', desc: 'Algorithm terminates after a finite number of steps' },
  { label: 'Effectiveness', icon: '✅', color: 'border-cyan-500/30 bg-cyan-500/5', desc: 'Each step must be feasible and basic enough to execute' },
];

function NotionSection() {
  const [active, setActive] = useState(0);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Definition block */}
      <div className="flex flex-col gap-3">
        <div className="bg-black/30 border border-white/8 rounded-xl p-4">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Definition</div>
          <p className="text-sm text-slate-300 leading-relaxed">
            An <span className="text-blue-300 font-semibold">algorithm</span> is a finite sequence of unambiguous instructions to solve a problem or compute a function. It takes an input and produces an output in a finite amount of time.
          </p>
        </div>
        <div className="bg-black/30 border border-white/8 rounded-xl p-4">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">Algorithm vs Program</div>
          <div className="flex gap-4">
            <div className="flex-1 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
              <div className="text-xs font-bold text-blue-300 mb-1">Algorithm</div>
              <ul className="text-[11px] text-slate-400 space-y-1">
                <li>• Language-independent</li><li>• Design level</li><li>• Finite steps</li>
              </ul>
            </div>
            <div className="flex-1 rounded-lg border border-purple-500/20 bg-purple-500/5 p-3">
              <div className="text-xs font-bold text-purple-300 mb-1">Program</div>
              <ul className="text-[11px] text-slate-400 space-y-1">
                <li>• Language-specific</li><li>• Implementation</li><li>• May not terminate</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Flowchart */}
        <div className="bg-black/30 border border-white/8 rounded-xl p-4">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">Algorithm Lifecycle</div>
          <div className="flex flex-col gap-1 items-center">
            {['Problem Statement', 'Design Algorithm', 'Prove Correctness', 'Analyze Efficiency', 'Implement & Test'].map((s, i) => (
              <div key={i} className="flex flex-col items-center w-full">
                <div className={`w-full text-center text-[11px] font-mono py-1.5 px-3 rounded-lg border ${i === 2 ? 'bg-blue-500/15 border-blue-500/30 text-blue-300' : 'bg-black/20 border-white/5 text-slate-300'}`}>{s}</div>
                {i < 4 && <div className="w-px h-3 bg-slate-700" />}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 5 Properties */}
      <div className="flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">5 Properties of an Algorithm (click each)</div>
        {ALGO_PROPERTIES.map((p, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${active === i ? p.color + ' scale-[1.01]' : 'border-white/5 bg-black/20 hover:bg-white/3'}`}>
            <span className="text-xl shrink-0">{p.icon}</span>
            <div>
              <div className="text-sm font-bold text-white">{p.label}</div>
              {active === i && <div className="text-[11px] text-slate-400 mt-1">{p.desc}</div>}
            </div>
            {active === i ? <CheckCircle2 size={16} className="ml-auto text-emerald-400 shrink-0" /> : <Circle size={16} className="ml-auto text-slate-700 shrink-0" />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Section 2: Problem Types ─────────────────────────────────────────────────
const PROBLEM_TYPES = [
  { icon: '🔢', title: 'Sorting', color: 'border-blue-500/25', desc: 'Rearrange elements in order. Bubble, Merge, Quick, Heap Sort.', examples: 'n log n lower bound' },
  { icon: '🔍', title: 'Searching', color: 'border-emerald-500/25', desc: 'Find element in a collection. Binary Search, BFS, DFS.', examples: 'O(log n) binary search' },
  { icon: '🕸️', title: 'Graph Problems', color: 'border-purple-500/25', desc: 'Shortest path, spanning tree, connectivity, flow networks.', examples: "Dijkstra, Floyd-Warshall" },
  { icon: '🧩', title: 'Combinatorial', color: 'border-amber-500/25', desc: 'Permutations, combinations, optimization. Often NP-hard.', examples: 'TSP, Knapsack' },
  { icon: '📐', title: 'Geometric', color: 'border-cyan-500/25', desc: 'Points, lines, polygons. Convex hull, intersection.', examples: 'Graham scan O(n log n)' },
  { icon: '🔢', title: 'Numerical', color: 'border-orange-500/25', desc: 'Continuous math: equations, integration, matrix ops.', examples: 'GCD, primality' },
];

function ProblemTypesSection() {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {PROBLEM_TYPES.map((p, i) => (
        <button key={i} onClick={() => setSel(sel === i ? null : i)}
          className={`flex flex-col gap-2 p-4 rounded-xl border text-left transition-all ${sel === i ? p.color + ' bg-white/4 scale-[1.02]' : 'border-white/5 bg-black/20 hover:bg-white/3'}`}>
          <span className="text-2xl">{p.icon}</span>
          <div className="text-sm font-bold text-white">{p.title}</div>
          <div className="text-[11px] text-slate-400 leading-relaxed">{p.desc}</div>
          {sel === i && (
            <div className="mt-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-2 py-1">
              Example: {p.examples}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Section 3: Analysis & Efficiency ────────────────────────────────────────
const EFFICIENCY_ROWS = [
  { label: 'Best Case', symbol: 'Tbest(n)', color: 'text-emerald-400', desc: 'Input that causes minimum operations. Lower bound of efficiency.' },
  { label: 'Worst Case', symbol: 'Tworst(n)', color: 'text-red-400', desc: 'Input causing maximum operations. Guarantee of upper bound.' },
  { label: 'Average Case', symbol: 'Tavg(n)', color: 'text-amber-400', desc: 'Expected over all inputs (probability distribution required).' },
];

function AnalysisSection() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="flex flex-col gap-3">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">What We Measure</div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { title: 'Time Complexity', icon: '⏱️', desc: '# of basic operations as function of input size n' },
            { title: 'Space Complexity', icon: '💾', desc: 'Memory used as function of input size n' },
            { title: 'Input Size n', icon: '📏', desc: '# items in array, digits in number, nodes in graph' },
            { title: 'Basic Operation', icon: '⚙️', desc: 'The most frequent op: comparison, addition, pointer move' },
          ].map((c, i) => (
            <div key={i} className="bg-black/30 border border-white/5 rounded-xl p-3">
              <div className="text-lg mb-1">{c.icon}</div>
              <div className="text-xs font-bold text-white mb-1">{c.title}</div>
              <div className="text-[10px] text-slate-500">{c.desc}</div>
            </div>
          ))}
        </div>
        <div className="bg-black/30 border border-white/8 rounded-xl p-4">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">Non-recursive Analysis Steps</div>
          {['Decide on parameter n', 'Find basic operation', 'Check if count varies on same n', 'Set up sum for count', 'Simplify closed form'].map((s, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[10px] text-blue-400 font-bold shrink-0">{i + 1}</div>
              <div className="text-[11px] text-slate-300">{s}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Case Analysis</div>
        {EFFICIENCY_ROWS.map((r, i) => (
          <div key={i} className="bg-black/30 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`font-mono text-sm font-bold ${r.color}`}>{r.symbol}</span>
              <span className="text-xs text-white font-semibold">— {r.label}</span>
            </div>
            <div className="text-[11px] text-slate-400">{r.desc}</div>
          </div>
        ))}
        <div className="bg-black/30 border border-white/8 rounded-xl p-4">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">Example: Linear Search</div>
          <div className="space-y-2">
            <div className="flex justify-between text-[11px]"><span className="text-slate-400">Best (first element)</span><span className="text-emerald-400 font-mono">O(1)</span></div>
            <div className="h-px bg-white/5" />
            <div className="flex justify-between text-[11px]"><span className="text-slate-400">Worst (not found)</span><span className="text-red-400 font-mono">O(n)</span></div>
            <div className="h-px bg-white/5" />
            <div className="flex justify-between text-[11px]"><span className="text-slate-400">Average (middle)</span><span className="text-amber-400 font-mono">O(n/2) = O(n)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section 4: Asymptotic Notations ─────────────────────────────────────────
const NOTATIONS = [
  {
    sym: 'O(g(n))', name: 'Big-Oh (Upper Bound)', color: 'text-red-400', border: 'border-red-500/30 bg-red-500/5',
    def: 'f(n) = O(g(n)) if ∃ c > 0, n₀ such that f(n) ≤ c·g(n) ∀ n ≥ n₀',
    meaning: 'f grows AT MOST as fast as g. Worst-case guarantee.',
    properties: ['O(f) + O(g) = O(max(f,g))', 'O(c·f) = O(f)', 'O(f·g) = O(f)·O(g)'],
  },
  {
    sym: 'Ω(g(n))', name: 'Omega (Lower Bound)', color: 'text-emerald-400', border: 'border-emerald-500/30 bg-emerald-500/5',
    def: 'f(n) = Ω(g(n)) if ∃ c > 0, n₀ such that f(n) ≥ c·g(n) ∀ n ≥ n₀',
    meaning: 'f grows AT LEAST as fast as g. Best-case or impossibility proof.',
    properties: ['f = Ω(g) ↔ g = O(f)', 'Ω(f) + Ω(g) = Ω(min(f,g))', 'Ω establishes lower bounds'],
  },
  {
    sym: 'Θ(g(n))', name: 'Theta (Tight Bound)', color: 'text-amber-400', border: 'border-amber-500/30 bg-amber-500/5',
    def: 'f(n) = Θ(g(n)) if f = O(g(n)) AND f = Ω(g(n))',
    meaning: 'f grows EXACTLY as fast as g (asymptotically). Strongest statement.',
    properties: ['Θ(f) = O(f) ∩ Ω(f)', 'Most precise bound', 'Used when best=worst'],
  },
];

const COMPLEXITY_ORDER = [
  { label: 'O(1)', color: '#10b981', width: 2, example: 'Array access' },
  { label: 'O(log n)', color: '#34d399', width: 8, example: 'Binary search' },
  { label: 'O(n)', color: '#6ee7b7', width: 20, example: 'Linear scan' },
  { label: 'O(n log n)', color: '#f59e0b', width: 40, example: 'Merge sort' },
  { label: 'O(n²)', color: '#f97316', width: 65, example: 'Bubble sort' },
  { label: 'O(2ⁿ)', color: '#ef4444', width: 90, example: 'Brute force subset' },
  { label: 'O(n!)', color: '#dc2626', width: 100, example: 'All permutations' },
];

function AsymptoticSection() {
  const [active, setActive] = useState(0);
  const n = NOTATIONS[active];
  return (
    <div className="flex flex-col gap-6">
      {/* Notation Cards */}
      <div className="grid grid-cols-3 gap-3">
        {NOTATIONS.map((n, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`p-4 rounded-xl border text-left transition-all ${active === i ? n.border : 'border-white/5 bg-black/20 hover:bg-white/3'}`}>
            <div className={`text-xl font-mono font-black mb-1 ${n.color}`}>{n.sym}</div>
            <div className="text-xs text-white font-semibold">{n.name}</div>
          </button>
        ))}
      </div>

      {/* Detail Panel */}
      <div className={`rounded-xl border p-5 ${n.border}`}>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Formal Definition</div>
            <div className="bg-[#0d1117] rounded-lg p-3 border border-white/5 mb-3">
              <code className={`font-mono text-xs ${n.color} leading-relaxed`}>{n.def}</code>
            </div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Interpretation</div>
            <div className="text-xs text-slate-300 leading-relaxed">{n.meaning}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Key Properties</div>
            <div className="flex flex-col gap-2">
              {n.properties.map((p, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-current shrink-0 mt-1.5" style={{ color: n.color.replace('text-', '') }} />
                  <code className="text-[11px] font-mono text-slate-300">{p}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Growth Rate Chart */}
      <div className="bg-black/30 border border-white/8 rounded-xl p-5">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-4">Complexity Growth Rate (n = 100)</div>
        <div className="flex flex-col gap-2">
          {COMPLEXITY_ORDER.map((c, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-20 text-right text-[11px] font-mono" style={{ color: c.color }}>{c.label}</div>
              <div className="flex-1 h-5 bg-black/40 rounded overflow-hidden">
                <div className="h-full rounded transition-all" style={{ width: `${c.width}%`, background: c.color, opacity: 0.8 }} />
              </div>
              <div className="text-[10px] text-slate-500 w-28">{c.example}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-[10px] text-slate-600 text-center">
          ← Faster ·····················Slower →
        </div>
      </div>

      {/* Notation summary table */}
      <div className="bg-black/30 border border-white/8 rounded-xl overflow-hidden">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 p-4 pb-2">Notation Comparison</div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-4 py-2 text-slate-500 font-normal">f(n)</th>
              <th className="text-left px-4 py-2 text-slate-500 font-normal">O notation</th>
              <th className="text-left px-4 py-2 text-slate-500 font-normal">Ω notation</th>
              <th className="text-left px-4 py-2 text-slate-500 font-normal">Θ notation</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['5n²+3n', 'O(n²)', 'Ω(n²)', 'Θ(n²)'],
              ['2n log n', 'O(n log n)', 'Ω(n log n)', 'Θ(n log n)'],
              ['n³+2n', 'O(n³)', 'Ω(n³)', 'Θ(n³)'],
            ].map((row, i) => (
              <tr key={i} className="border-b border-white/5">
                <td className="px-4 py-2 font-mono text-amber-300">{row[0]}</td>
                <td className="px-4 py-2 font-mono text-red-400">{row[1]}</td>
                <td className="px-4 py-2 font-mono text-emerald-400">{row[2]}</td>
                <td className="px-4 py-2 font-mono text-blue-400">{row[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Section 5: Recurrence Relations — Substitution ──────────────────────────
const SUBSTITUTION_EXAMPLES = [
  {
    title: 'Binary Search: T(n) = T(n/2) + O(1)',
    steps: [
      { eq: 'T(n) = T(n/2) + 1', note: 'Original recurrence' },
      { eq: 'T(n) = T(n/4) + 1 + 1', note: 'Expand T(n/2) = T(n/4) + 1' },
      { eq: 'T(n) = T(n/8) + 1 + 1 + 1', note: 'Expand once more' },
      { eq: 'T(n) = T(n/2ᵏ) + k', note: 'After k expansions' },
      { eq: 'Set n/2ᵏ = 1 → k = log₂n', note: 'Base case T(1) = O(1)' },
      { eq: 'T(n) = T(1) + log₂n = O(log n)', note: '✓ Final answer' },
    ],
    result: 'O(log n)',
    resultColor: 'text-emerald-400',
  },
  {
    title: 'Merge Sort: T(n) = 2T(n/2) + n',
    steps: [
      { eq: 'T(n) = 2T(n/2) + n', note: 'Original' },
      { eq: 'T(n) = 2[2T(n/4) + n/2] + n = 4T(n/4) + 2n', note: 'Expand once' },
      { eq: 'T(n) = 4[2T(n/8) + n/4] + 2n = 8T(n/8) + 3n', note: 'Expand twice' },
      { eq: 'T(n) = 2ᵏ·T(n/2ᵏ) + k·n', note: 'After k expansions' },
      { eq: 'Set n/2ᵏ = 1 → k = log₂n', note: 'Base case' },
      { eq: 'T(n) = n·T(1) + n·log₂n = O(n log n)', note: '✓ Final answer' },
    ],
    result: 'O(n log n)',
    resultColor: 'text-emerald-400',
  },
];

function SubstitutionSection() {
  const [ex, setEx] = useState(0);
  const [visibleStep, setVisibleStep] = useState(0);
  const example = SUBSTITUTION_EXAMPLES[ex];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {SUBSTITUTION_EXAMPLES.map((e, i) => (
          <button key={i} onClick={() => { setEx(i); setVisibleStep(0); }}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${ex === i ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300' : 'border-white/5 text-slate-400 hover:border-white/15'}`}>
            {e.title.split(':')[0]}
          </button>
        ))}
      </div>
      <div className="bg-black/30 border border-cyan-500/20 rounded-xl p-4">
        <div className="text-xs font-bold text-cyan-300 mb-3">{example.title}</div>
        <div className="flex flex-col gap-2">
          {example.steps.slice(0, visibleStep + 1).map((s, i) => (
            <div key={i} className={`flex items-start gap-3 rounded-lg p-3 border transition-all ${i === visibleStep ? 'border-cyan-500/30 bg-cyan-500/8' : 'border-white/5 bg-black/20'}`}>
              <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-[10px] text-cyan-400 font-bold shrink-0">{i + 1}</div>
              <div>
                <code className="text-sm font-mono text-white">{s.eq}</code>
                <div className="text-[10px] text-slate-500 mt-0.5">{s.note}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={() => setVisibleStep(Math.max(0, visibleStep - 1))}
            className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-300 hover:bg-white/5">← Back</button>
          <button onClick={() => setVisibleStep(Math.min(example.steps.length - 1, visibleStep + 1))}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-xs text-cyan-300 hover:bg-cyan-500/30">Next Step →</button>
          {visibleStep === example.steps.length - 1 && (
            <div className={`ml-auto flex items-center gap-2 text-sm font-mono font-bold ${example.resultColor}`}>
              T(n) = {example.result} ✓
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Section 6: Recursion Tree Method ─────────────────────────────────────────
type RTreeNode = { label: string; cost: string; color: string; children: RTreeNode[] };

function buildMergeSortTree(depth: number, n: string, maxDepth = 3): RTreeNode {
  if (depth >= maxDepth) return { label: n, cost: 'O(1)', color: '#10b981', children: [] };
  const half = depth === 0 ? 'n/2' : `${n}/2`;
  return {
    label: n, cost: depth === 0 ? 'O(n)' : `O(${n})`,
    color: ['#3b82f6', '#7c3aed', '#ec4899', '#f59e0b'][depth] ?? '#f59e0b',
    children: depth < maxDepth - 1 ? [buildMergeSortTree(depth + 1, half), buildMergeSortTree(depth + 1, half)] : [],
  };
}

function TreeViz({ node, depth = 0 }: { node: RTreeNode; depth?: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <div className="px-2 py-1 rounded-lg border text-[10px] font-mono font-bold" style={{ borderColor: node.color + '50', background: node.color + '15', color: node.color }}>
          T({node.label})
        </div>
        <div className="text-[9px] text-slate-600 font-mono">{node.cost}</div>
      </div>
      {node.children.length > 0 && (
        <div className="flex gap-4 mt-1 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-3 bg-slate-700" />
          {node.children.map((c, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-px h-3 bg-slate-700" />
              <TreeViz node={c} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RecursionTreeSection() {
  const LEVELS = [
    { label: 'Level 0', cost: 'c·n', nodes: 1, totalCost: 'cn' },
    { label: 'Level 1', cost: 'c·n/2', nodes: 2, totalCost: 'cn' },
    { label: 'Level 2', cost: 'c·n/4', nodes: 4, totalCost: 'cn' },
    { label: '...', cost: 'c·n/2ᵢ', nodes: '2ⁱ', totalCost: 'cn per level' },
    { label: 'Level log n', cost: 'O(1)', nodes: 'n', totalCost: 'cn' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-black/30 border border-white/8 rounded-xl p-4">
        <div className="text-xs font-bold text-purple-300 mb-1">T(n) = 2T(n/2) + cn — Recursion Tree</div>
        <div className="text-[11px] text-slate-500 mb-4">Each node represents a subproblem. Cost at each node = work done (not counting recursion).</div>
        <div className="overflow-x-auto">
          <div className="flex justify-center py-2">
            <TreeViz node={buildMergeSortTree(0, 'n')} />
          </div>
        </div>
      </div>

      {/* Level cost table */}
      <div className="bg-black/30 border border-white/8 rounded-xl overflow-hidden">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 px-4 pt-4 pb-2">Level-by-Level Cost Analysis</div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-4 py-2 text-slate-500 font-normal">Level</th>
              <th className="text-left px-4 py-2 text-slate-500 font-normal">Nodes</th>
              <th className="text-left px-4 py-2 text-slate-500 font-normal">Cost/Node</th>
              <th className="text-left px-4 py-2 text-slate-500 font-normal">Level Total</th>
            </tr>
          </thead>
          <tbody>
            {LEVELS.map((l, i) => (
              <tr key={i} className="border-b border-white/5">
                <td className="px-4 py-2 font-mono text-purple-300">{l.label}</td>
                <td className="px-4 py-2 font-mono text-blue-300">{l.nodes}</td>
                <td className="px-4 py-2 font-mono text-slate-300">{l.cost}</td>
                <td className="px-4 py-2 font-mono text-amber-400">{l.totalCost}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Total = (log n + 1) levels × cn per level</span>
          <code className="text-sm font-mono font-bold text-emerald-400">T(n) = O(n log n) ✓</code>
        </div>
      </div>
    </div>
  );
}

// ─── Section 7: Master Theorem ────────────────────────────────────────────────
function MasterSection() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(2);
  const [k, setK] = useState(1); // f(n) = O(n^k)

  const logba = Math.log(a) / Math.log(b);
  let result = '';
  let explanation = '';
  let caseNum = 0;
  if (k < logba) {
    caseNum = 1;
    result = `Θ(n^log_${b}(${a})) = Θ(n^${logba.toFixed(2)})`;
    explanation = `f(n) = O(n^k) where k=${k} < log_b(a)=${logba.toFixed(2)}. Work dominated by LEAVES of recursion tree.`;
  } else if (Math.abs(k - logba) < 0.01) {
    caseNum = 2;
    result = `Θ(n^${logba.toFixed(2)} · log n)`;
    explanation = `f(n) = Θ(n^log_b(a)) = Θ(n^${logba.toFixed(2)}). Equal work at every level → multiply by log n.`;
  } else {
    caseNum = 3;
    result = `Θ(f(n)) = Θ(n^${k})`;
    explanation = `f(n) = Ω(n^k) where k=${k} > log_b(a)=${logba.toFixed(2)}. Work dominated by ROOT (top level).`;
  }

  const CASES = [
    { n: 1, title: 'Case 1: Leaves dominate', f: 'f(n) = O(nˡᵒᵍ_b(a)⁻ᵋ)', result: 'T(n) = Θ(nˡᵒᵍ_b(a))', color: 'border-blue-500/30 bg-blue-500/5 text-blue-300' },
    { n: 2, title: 'Case 2: Equal work', f: 'f(n) = Θ(nˡᵒᵍ_b(a))', result: 'T(n) = Θ(nˡᵒᵍ_b(a) log n)', color: 'border-amber-500/30 bg-amber-500/5 text-amber-300' },
    { n: 3, title: 'Case 3: Root dominates', f: 'f(n) = Ω(nˡᵒᵍ_b(a)⁺ᵋ)', result: 'T(n) = Θ(f(n))', color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Statement */}
      <div className="bg-black/30 border border-white/8 rounded-xl p-4">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Master Theorem Statement</div>
        <div className="bg-[#0d1117] rounded-lg p-4 border border-white/5 text-center mb-3">
          <code className="text-amber-300 font-mono text-sm font-bold">T(n) = a·T(n/b) + f(n)</code>
          <div className="text-[11px] text-slate-500 mt-2">where a ≥ 1 (branches), b &gt; 1 (shrink factor), f(n) = poly(n)</div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {CASES.map((c) => (
            <div key={c.n} className={`rounded-xl border p-3 ${caseNum === c.n ? c.color : 'border-white/5 bg-black/20'} transition-all`}>
              <div className="text-[10px] font-bold mb-1">{c.title}</div>
              <div className="text-[10px] font-mono text-slate-400 mb-1">{c.f}</div>
              <div className="text-[10px] font-mono font-bold">{c.result}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Calculator */}
      <div className="bg-black/30 border border-purple-500/20 rounded-xl p-4">
        <div className="text-xs font-bold text-purple-300 mb-4">🧮 Interactive Master Theorem Calculator</div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[{ label: 'a (branches)', val: a, set: setA, min: 1, max: 8 },
            { label: 'b (shrink factor)', val: b, set: setB, min: 2, max: 8 },
            { label: 'k in f(n)=nᵏ', val: k, set: setK, min: 0, max: 4 }
          ].map((ctrl, i) => (
            <div key={i}>
              <div className="text-[10px] text-slate-500 mb-2">{ctrl.label}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => ctrl.set(Math.max(ctrl.min, ctrl.val - 1))} className="w-6 h-6 rounded bg-white/5 text-white text-sm">−</button>
                <span className="text-lg font-mono font-bold text-white w-8 text-center">{ctrl.val}</span>
                <button onClick={() => ctrl.set(Math.min(ctrl.max, ctrl.val + 1))} className="w-6 h-6 rounded bg-white/5 text-white text-sm">+</button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-[#0d1117] rounded-lg p-3 border border-purple-500/20 mb-2 text-center">
          <code className="font-mono text-purple-200 text-sm">T(n) = {a}·T(n/{b}) + n^{k}</code>
        </div>
        <div className={`rounded-lg p-3 border ${caseNum === 1 ? 'border-blue-500/30 bg-blue-500/5' : caseNum === 2 ? 'border-amber-500/30 bg-amber-500/5' : 'border-emerald-500/30 bg-emerald-500/5'}`}>
          <div className="text-[10px] text-slate-500 mb-1">Case {caseNum} applies</div>
          <div className="text-sm font-mono font-bold text-white mb-1">{result}</div>
          <div className="text-[10px] text-slate-400">{explanation}</div>
        </div>
      </div>

      {/* Classic Examples */}
      <div className="bg-black/30 border border-white/8 rounded-xl overflow-hidden">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 px-4 pt-4 pb-2">Classic Recurrences</div>
        <table className="w-full text-[11px]">
          <thead><tr className="border-b border-white/5">
            <th className="text-left px-4 py-2 text-slate-500 font-normal">Recurrence</th>
            <th className="text-left px-4 py-2 text-slate-500 font-normal">a, b, f(n)</th>
            <th className="text-left px-4 py-2 text-slate-500 font-normal">Case</th>
            <th className="text-left px-4 py-2 text-slate-500 font-normal">Result</th>
          </tr></thead>
          <tbody>
            {[
              ['T(n) = 2T(n/2) + n', 'a=2,b=2,Θ(n)', '2', 'Θ(n log n)'],
              ['T(n) = T(n/2) + 1', 'a=1,b=2,Θ(1)', '2', 'Θ(log n)'],
              ['T(n) = 9T(n/3) + n', 'a=9,b=3,O(n)', '1', 'Θ(n²)'],
              ['T(n) = 4T(n/2) + n²', 'a=4,b=2,Θ(n²)', '2', 'Θ(n² log n)'],
              ['T(n) = 3T(n/4) + n log n', 'a=3,b=4,Θ(n lg n)', '3', 'Θ(n log n)'],
            ].map((r, i) => (
              <tr key={i} className="border-b border-white/5">
                <td className="px-4 py-2 font-mono text-amber-300">{r[0]}</td>
                <td className="px-4 py-2 text-slate-400">{r[1]}</td>
                <td className="px-4 py-2"><span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${r[2] === '1' ? 'bg-blue-500/15 text-blue-300' : r[2] === '2' ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-300'}`}>Case {r[2]}</span></td>
                <td className="px-4 py-2 font-mono text-emerald-400">{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main TheoryLab ───────────────────────────────────────────────────────────
export function TheoryLab() {
  const [view, setView] = useState<'theory' | 'analysis' | 'trees'>('theory');
  return (
    <div className="w-full h-full overflow-y-auto bg-[#030d1c]">
      {/* Sub-navigation */}
      <div className="sticky top-0 z-10 flex gap-1 px-8 pt-4 pb-3 bg-[#030d1c]/95 backdrop-blur-sm border-b border-white/5">
        <button onClick={() => setView('theory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === 'theory' ? 'bg-blue-500/15 border border-blue-500/30 text-blue-300' : 'text-slate-400 hover:text-white border border-transparent hover:bg-white/5'}`}>
          <BookOpen size={15} /> Unit 1 — Fundamentals
        </button>
        <button onClick={() => setView('analysis')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === 'analysis' ? 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-300' : 'text-slate-400 hover:text-white border border-transparent hover:bg-white/5'}`}>
          <Microscope size={15} /> Algorithm Deep Analysis
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">5 algos</span>
        </button>
        <button onClick={() => setView('trees')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === 'trees' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : 'text-slate-400 hover:text-white border border-transparent hover:bg-white/5'}`}>
          <Network size={15} /> Advanced Trees
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">AVL, B, RB</span>
        </button>
      </div>

      {view === 'analysis' && <AlgorithmAnalysis />}
      {view === 'trees' && <TreesLab />}

      {view === 'theory' && (
      <>
      {/* Hero Banner */}
      <div className="relative px-8 pt-8 pb-6 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={20} className="text-blue-400" />
            <span className="text-[11px] uppercase tracking-widest text-blue-400 font-semibold">DAA — Design & Analysis of Algorithms</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
            Unit 1 — <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Algorithm Fundamentals</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            Interactive visual study guide covering the complete Unit 1 syllabus — from algorithm properties to Master Theorem derivations. Click sections to expand/collapse.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {['Notion of Algorithm', 'Problem Types', 'Efficiency Analysis', 'Ω O Θ Notations', 'Substitution Method', 'Recursion Tree', 'Master Theorem'].map((t, i) => (
              <span key={i} className="text-[10px] px-2.5 py-1 rounded-full border border-blue-500/20 bg-blue-500/8 text-blue-300">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-8 py-6 flex flex-col gap-5 max-w-6xl mx-auto">
        <SectionCard icon={<Cpu size={18} className="text-blue-300" />} title="1. Notion of an Algorithm" color="bg-blue-500/15">
          <NotionSection />
        </SectionCard>

        <SectionCard icon={<Search size={18} className="text-emerald-300" />} title="2. Problem Types in CS" color="bg-emerald-500/15">
          <ProblemTypesSection />
        </SectionCard>

        <SectionCard icon={<TrendingUp size={18} className="text-amber-300" />} title="3. Algorithm Efficiency Analysis" color="bg-amber-500/15">
          <AnalysisSection />
        </SectionCard>

        <SectionCard icon={<Sigma size={18} className="text-red-300" />} title="4. Asymptotic Notations — O, Ω, Θ" color="bg-red-500/15">
          <AsymptoticSection />
        </SectionCard>

        <SectionCard icon={<Hash size={18} className="text-cyan-300" />} title="5. Recurrences — Substitution Method" color="bg-cyan-500/15">
          <SubstitutionSection />
        </SectionCard>

        <SectionCard icon={<GitBranch size={18} className="text-purple-300" />} title="6. Recurrences — Recursion Tree Method" color="bg-purple-500/15">
          <RecursionTreeSection />
        </SectionCard>

        <SectionCard icon={<Zap size={18} className="text-orange-300" />} title="7. Recurrences — Master Theorem" color="bg-orange-500/15">
          <MasterSection />
        </SectionCard>

        {/* Quick Reference */}
        <div className="bg-[#0a1628]/80 border border-white/8 rounded-2xl p-5">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-4">📋 Quick Reference Cheatsheet</div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs font-bold text-white mb-2">5 Properties</div>
              {['Input', 'Output', 'Definiteness', 'Finiteness', 'Effectiveness'].map((p, i) => (
                <div key={i} className="text-[11px] text-slate-400 py-0.5">{i + 1}. {p}</div>
              ))}
            </div>
            <div>
              <div className="text-xs font-bold text-white mb-2">Notation Rules</div>
              {['f=O(g): f grows ≤ g', 'f=Ω(g): f grows ≥ g', 'f=Θ(g): f grows = g', 'O(cn)=O(n), drop constants', 'O(n²+n)=O(n²), drop lower'].map((p, i) => (
                <div key={i} className="text-[11px] text-slate-400 font-mono py-0.5">{p}</div>
              ))}
            </div>
            <div>
              <div className="text-xs font-bold text-white mb-2">Master Theorem</div>
              <div className="text-[11px] font-mono text-amber-300 mb-2">T(n)=aT(n/b)+f(n)</div>
              {['Case 1: f=O(nˡᵒᵍ⁻ᵋ) → Θ(nˡᵒᵍ)', 'Case 2: f=Θ(nˡᵒᵍ) → Θ(nˡᵒᵍ lgn)', 'Case 3: f=Ω(nˡᵒᵍ⁺ᵋ) → Θ(f)'].map((p, i) => (
                <div key={i} className="text-[10px] text-slate-400 font-mono py-0.5">{p}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
