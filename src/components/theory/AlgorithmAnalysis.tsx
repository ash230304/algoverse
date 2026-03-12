// @ts-nocheck
"use client";

import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function cx(...args: (string | false | undefined | null)[]) { return args.filter(Boolean).join(' '); }
function Mono({ children, color = 'text-amber-300' }: { children: React.ReactNode; color?: string }) {
  return <code className={`font-mono font-bold ${color}`}>{children}</code>;
}
function Formula({ f, sub }: { f: string; sub?: string }) {
  return (
    <div className="bg-[#0d1117] rounded-lg px-4 py-2.5 border border-white/5 my-2 text-center">
      <code className="text-amber-300 font-mono text-sm font-bold">{f}</code>
      {sub && <div className="text-[10px] text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}
function StepBox({ n, formula, note, active }: { n: number; formula: string; note: string; active: boolean }) {
  return (
    <div className={cx('rounded-lg border p-3 transition-all', active ? 'border-cyan-500/40 bg-cyan-500/8' : 'border-white/5 bg-black/20')}>
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-[10px] text-cyan-400 font-bold shrink-0">{n}</div>
        <code className="text-sm font-mono text-white">{formula}</code>
      </div>
      <div className="text-[10px] text-slate-500 pl-7">{note}</div>
    </div>
  );
}

// ─── BINARY SEARCH ───────────────────────────────────────────────────────────
const BS_ARRAY = [2, 7, 11, 15, 23, 31, 42, 56, 67, 84];
const BS_STEPS = (() => {
  const steps: { lo: number; hi: number; mid: number; found: boolean }[] = [];
  let lo = 0, hi = BS_ARRAY.length - 1, target = 42;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    steps.push({ lo, hi, mid, found: BS_ARRAY[mid] === target });
    if (BS_ARRAY[mid] === target) break;
    else if (BS_ARRAY[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return steps;
})();

function BinarySearchSection() {
  const [step, setStep] = useState(0);
  const s = BS_STEPS[step];
  const [substep, setSubstep] = useState(0);
  const DERIVE_STEPS = [
    { formula: 'T(n) = T(n/2) + 1', note: 'One comparison, then search half. T(1) = 1 (base case)' },
    { formula: 'T(n) = T(n/4) + 1 + 1 = T(n/4) + 2', note: 'Expand T(n/2) = T(n/4) + 1' },
    { formula: 'T(n) = T(n/2ᵏ) + k', note: 'After k expansions — geometric series' },
    { formula: 'n/2ᵏ = 1  →  k = log₂n', note: 'Solve for k using base case T(1) = 1' },
    { formula: 'T(n) = T(1) + log₂n = 1 + log₂n', note: 'Substitute k = log₂n' },
    { formula: 'T(n) = O(log n) ✓', note: 'Drop constants — clean result' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Idea */}
      <div className="grid md:grid-cols-3 gap-3 text-[11px]">
        {[
          { icon: '🎯', title: 'Core Idea', desc: 'Divide sorted array in half. Compare target with mid. Discard the half that cannot contain the target.' },
          { icon: '📋', title: 'Precondition', desc: 'Array MUST be sorted. Works on any sorted collection — arrays, sorted linked lists (with pointer jumps).' },
          { icon: '⚖️', title: 'Complexity', desc: 'Best: O(1) — target = mid on first try. Worst & Avg: O(log n). Space: O(1) iterative, O(log n) recursive.' },
        ].map((c, i) => (
          <div key={i} className="bg-black/30 border border-white/8 rounded-xl p-4">
            <div className="text-xl mb-2">{c.icon}</div>
            <div className="font-bold text-white mb-1">{c.title}</div>
            <div className="text-slate-400 leading-relaxed">{c.desc}</div>
          </div>
        ))}
      </div>

      {/* Array Trace */}
      <div className="bg-black/30 border border-blue-500/20 rounded-xl p-4">
        <div className="text-xs font-bold text-blue-300 mb-1">Step-by-Step Trace — Search for <span className="text-amber-400">42</span></div>
        <div className="text-[10px] text-slate-500 mb-4">lo={s.lo} · hi={s.hi} · mid={s.mid} · arr[mid]={BS_ARRAY[s.mid]}</div>
        <div className="flex gap-1 mb-4 flex-wrap">
          {BS_ARRAY.map((v, i) => {
            const isMid = i === s.mid;
            const inRange = i >= s.lo && i <= s.hi;
            const isFound = isMid && s.found;
            return (
              <div key={i} className={cx('w-11 h-11 flex flex-col items-center justify-center rounded-lg border text-xs font-mono font-bold transition-all',
                isFound ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 scale-110' :
                isMid ? 'border-amber-400 bg-amber-500/20 text-amber-300 scale-105' :
                inRange ? 'border-blue-500/40 bg-blue-500/10 text-blue-200' :
                'border-white/5 bg-black/20 text-slate-600')}>
                {v}
                <span className="text-[8px] font-normal opacity-60">{i}</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-1 mb-3">
          {['◀ lo', 'mid ▶'].map((l, i) => (
            <span key={i} className={cx('text-[10px] px-2 py-0.5 rounded border', i === 0 ? 'border-blue-500/30 text-blue-400' : 'border-amber-500/30 text-amber-400')}>{l}</span>
          ))}
          {s.found && <span className="text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-400 ml-1">✓ FOUND!</span>}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setStep(Math.max(0, step - 1))} className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-300 hover:bg-white/5">← Prev</button>
          <button onClick={() => setStep(Math.min(BS_STEPS.length - 1, step + 1))} className="px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-xs text-blue-300 hover:bg-blue-500/30">Next Step →</button>
          <span className="ml-auto text-[10px] text-slate-500 self-center">Step {step + 1} / {BS_STEPS.length}</span>
        </div>
      </div>

      {/* Derivation */}
      <div className="bg-black/30 border border-cyan-500/20 rounded-xl p-4">
        <div className="text-xs font-bold text-cyan-300 mb-3">Recurrence Derivation by Substitution</div>
        <div className="flex flex-col gap-2">
          {DERIVE_STEPS.slice(0, substep + 1).map((s, i) => (
            <StepBox key={i} n={i + 1} formula={s.formula} note={s.note} active={i === substep} />
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={() => setSubstep(Math.max(0, substep - 1))} className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-300 hover:bg-white/5">← Back</button>
          <button onClick={() => setSubstep(Math.min(DERIVE_STEPS.length - 1, substep + 1))} className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-xs text-cyan-300">Next Step →</button>
        </div>
      </div>
    </div>
  );
}

// ─── MERGE SORT ───────────────────────────────────────────────────────────────
function MergeSortSection() {
  const [substep, setSubstep] = useState(0);
  const DERIVE = [
    { formula: 'T(n) = 2T(n/2) + cn', note: '2 recursive halves + cn for the merge step' },
    { formula: 'T(n) = 4T(n/4) + cn + cn', note: 'Expand T(n/2)=2T(n/4)+c(n/2). Each level costs cn total' },
    { formula: 'T(n) = 2ᵏT(n/2ᵏ) + k·cn', note: 'Pattern: k levels deep, and each level costs exactly cn' },
    { formula: 'k = log₂n  →  T(n) = nT(1) + cn·log₂n', note: 'Base case when n/2ᵏ = 1' },
    { formula: 'T(n) = cn + cn·log n = cn(1 + log n)', note: 'T(1)=c (base sort of 1 element)' },
    { formula: 'T(n) = O(n log n) ✓', note: 'Drop constant c and lower-order n term' },
  ];

  // Quick Master Theorem proof
  const MASTER = [
    'T(n) = aT(n/b) + f(n) with a=2, b=2, f(n)=cn',
    'Compute n^log_b(a) = n^log₂(2) = n^1 = n',
    'f(n) = cn = Θ(n¹) = Θ(n^log_b(a)) → Case 2',
    'T(n) = Θ(n^log_b(a) · log n) = Θ(n log n) ✓',
  ];

  const TREE_LEVELS = [
    { label: 'Level 0', nodes: 1, size: 'n', cost: 'cn', total: 'cn' },
    { label: 'Level 1', nodes: 2, size: 'n/2', cost: 'c(n/2)×2', total: 'cn' },
    { label: 'Level 2', nodes: 4, size: 'n/4', cost: 'c(n/4)×4', total: 'cn' },
    { label: '...', nodes: '...', size: '...', cost: '...', total: 'cn' },
    { label: 'Level log n', nodes: 'n', size: '1', cost: 'c×n', total: 'cn' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid md:grid-cols-3 gap-3 text-[11px]">
        {[
          { icon: '✂️', title: 'Divide', desc: 'Split array into two halves recursively until each subarray has ≤ 1 element (base case).' },
          { icon: '🔀', title: 'Conquer', desc: 'Each subarray of size 1 is trivially sorted. The recursion unwinds.' },
          { icon: '🔗', title: 'Merge', desc: 'Two sorted halves merged in O(n) using two-pointer technique. This is the costly step.' },
        ].map((c, i) => (
          <div key={i} className="bg-black/30 border border-white/8 rounded-xl p-4">
            <div className="text-xl mb-2">{c.icon}</div>
            <div className="font-bold text-white mb-1">{c.title}</div>
            <div className="text-slate-400 leading-relaxed">{c.desc}</div>
          </div>
        ))}
      </div>

      {/* Recursion Tree / Level Table */}
      <div className="bg-black/30 border border-purple-500/20 rounded-xl p-4">
        <div className="text-xs font-bold text-purple-300 mb-3">Recursion Tree — T(n) = 2T(n/2) + cn</div>
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-[11px]">
            <thead><tr className="border-b border-white/5">{['Level', '# Nodes', 'Subproblem', 'cost/node × nodes', 'Level Total'].map(h => (
              <th key={h} className="text-left px-3 py-2 text-slate-500 font-normal">{h}</th>))}</tr></thead>
            <tbody>
              {TREE_LEVELS.map((l, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="px-3 py-2 font-mono text-purple-300">{l.label}</td>
                  <td className="px-3 py-2 font-mono text-blue-300">{l.nodes}</td>
                  <td className="px-3 py-2 font-mono text-slate-300">T({l.size})</td>
                  <td className="px-3 py-2 font-mono text-slate-400">{l.cost}</td>
                  <td className="px-3 py-2 font-mono font-bold text-amber-400">{l.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-2 px-3 flex justify-between text-[11px]">
            <span className="text-slate-400">Total = (log n + 1) levels × cn per level</span>
            <span className="font-mono font-bold text-emerald-400">= O(n log n) ✓</span>
          </div>
        </div>
      </div>

      {/* Substitution stepper */}
      <div className="bg-black/30 border border-cyan-500/20 rounded-xl p-4">
        <div className="text-xs font-bold text-cyan-300 mb-3">Substitution Method — Step by Step</div>
        <div className="flex flex-col gap-2">
          {DERIVE.slice(0, substep + 1).map((s, i) => (
            <StepBox key={i} n={i + 1} formula={s.formula} note={s.note} active={i === substep} />
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={() => setSubstep(Math.max(0, substep - 1))} className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-300 hover:bg-white/5">← Back</button>
          <button onClick={() => setSubstep(Math.min(DERIVE.length - 1, substep + 1))} className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-xs text-cyan-300">Next →</button>
        </div>
      </div>

      {/* Master Theorem proof */}
      <div className="bg-black/30 border border-emerald-500/20 rounded-xl p-4">
        <div className="text-xs font-bold text-emerald-300 mb-3">Master Theorem Verification (Case 2)</div>
        <div className="flex flex-col gap-2">
          {MASTER.map((s, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] text-emerald-400 font-bold shrink-0">{i + 1}</div>
              <code className="text-[11px] font-mono text-slate-300">{s}</code>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between items-center border-t border-white/5 pt-3">
          <div className="flex gap-4 text-[11px]">
            {[['Best', 'O(n log n)', 'text-emerald-400'], ['Avg', 'O(n log n)', 'text-amber-400'], ['Worst', 'O(n log n)', 'text-red-400'], ['Space', 'O(n)', 'text-blue-400']].map(([l, v, c]) => (
              <span key={l}><span className="text-slate-500">{l}: </span><span className={`font-mono font-bold ${c}`}>{v}</span></span>
            ))}
          </div>
          <span className="text-[10px] text-slate-500">Stable Sort ✓</span>
        </div>
      </div>
    </div>
  );
}

// ─── QUICK SORT ───────────────────────────────────────────────────────────────
function QuickSortSection() {
  const [substep, setSubstep] = useState(0);
  const CASES = [
    { label: 'Best Case', color: 'border-emerald-500/30 bg-emerald-500/5', rec: 'T(n) = 2T(n/2) + n', result: 'O(n log n)', explain: 'Pivot always splits exactly in half → identical to Merge Sort. Master Theorem Case 2.' },
    { label: 'Average Case', color: 'border-amber-500/30 bg-amber-500/5', rec: 'T(n) = T(n/2) + n (on avg)', result: 'O(n log n)', explain: 'Random pivot ≈ median on expectation. ≈ 1.39 n log n comparisons — faster than merge sort in practice due to cache effects.' },
    { label: 'Worst Case', color: 'border-red-500/30 bg-red-500/5', rec: 'T(n) = T(n−1) + n', result: 'O(n²)', explain: 'Pivot = smallest/largest each time (already sorted array + first/last pivot). Degenerates to Bubble Sort.' },
  ];
  const WORST_DERIVE = [
    { formula: 'T(n) = T(n−1) + cn', note: 'Pivot at position 0, left=empty, right=n-1 elements' },
    { formula: 'T(n) = T(n−2) + c(n−1) + cn', note: 'Expand T(n−1) = T(n−2) + c(n−1)' },
    { formula: 'T(n) = T(0) + c·(1+2+...+n)', note: 'Telescope to base case T(0)=O(1)' },
    { formula: 'T(n) = O(1) + c·n(n+1)/2', note: 'Arithmetic series ∑i = n(n+1)/2' },
    { formula: 'T(n) = O(n²) ✗', note: 'Worst case — avoid with random or median-of-3 pivot!' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">How Partition Works</div>
          <div className="bg-black/30 border border-white/8 rounded-xl p-4 text-[11px] space-y-3">
            <div className="font-mono text-slate-300 bg-[#0d1117] rounded p-3 text-xs">{`function partition(arr, lo, hi) {
  pivot = arr[hi]      // choose pivot
  i = lo - 1
  for j = lo to hi-1:
    if arr[j] <= pivot:
      i++
      swap(arr[i], arr[j])
  swap(arr[i+1], arr[hi])
  return i + 1          // pivot's final position
}`}</div>
            <div className="text-slate-400">After partition: all elements left of pivot ≤ pivot ≤ all elements right. Pivot is in its <span className="text-emerald-400">final sorted position</span>.</div>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">Visual Partition Example</div>
          <div className="bg-black/30 border border-white/8 rounded-xl p-4">
            {[
              { label: 'Initial', arr: [3, 7, 1, 5, 9, 2, 4], pivot: 4 },
              { label: 'After', arr: [3, 1, 2, 4, 7, 5, 9], pivot: 4, pivotIdx: 3 },
            ].map((row, ri) => (
              <div key={ri} className="mb-3">
                <div className="text-[10px] text-slate-500 mb-1">{row.label} (pivot = {row.pivot}):</div>
                <div className="flex gap-1">
                  {row.arr.map((v, i) => {
                    const isPivot = 'pivotIdx' in row ? i === row.pivotIdx : v === row.pivot;
                    const isLeft = 'pivotIdx' in row && i < row.pivotIdx;
                    const isRight = 'pivotIdx' in row && i > row.pivotIdx;
                    return <div key={i} className={cx('w-9 h-9 flex items-center justify-center rounded-lg text-xs font-mono font-bold border',
                      isPivot ? 'border-amber-400 bg-amber-500/25 text-amber-300' :
                      isLeft ? 'border-blue-500/40 bg-blue-500/10 text-blue-200' :
                      isRight ? 'border-red-500/40 bg-red-500/10 text-red-200' :
                      'border-white/5 bg-black/20 text-slate-400')}>{v}</div>;
                  })}
                </div>
                {'pivotIdx' in row && <div className="flex gap-2 mt-1 text-[9px]">
                  <span className="text-blue-400">■ ≤ pivot</span>
                  <span className="text-amber-400">■ pivot</span>
                  <span className="text-red-400">■ &gt; pivot</span>
                </div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Cases */}
      <div className="grid md:grid-cols-3 gap-3">
        {CASES.map((c, i) => (
          <div key={i} className={`rounded-xl border p-4 ${c.color}`}>
            <div className="text-xs font-bold text-white mb-2">{c.label}</div>
            <div className="font-mono text-[10px] text-slate-400 mb-1">{c.rec}</div>
            <div className="font-mono text-sm font-bold text-white mb-2">{c.result}</div>
            <div className="text-[10px] text-slate-400 leading-relaxed">{c.explain}</div>
          </div>
        ))}
      </div>

      {/* Worst case derivation */}
      <div className="bg-black/30 border border-red-500/20 rounded-xl p-4">
        <div className="text-xs font-bold text-red-300 mb-3">Worst Case Derivation — Sorted Array + Last-Element Pivot</div>
        <div className="flex flex-col gap-2">
          {WORST_DERIVE.slice(0, substep + 1).map((s, i) => (
            <StepBox key={i} n={i + 1} formula={s.formula} note={s.note} active={i === substep} />
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={() => setSubstep(Math.max(0, substep - 1))} className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-300 hover:bg-white/5">← Back</button>
          <button onClick={() => setSubstep(Math.min(WORST_DERIVE.length - 1, substep + 1))} className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-xs text-red-300">Next →</button>
        </div>
      </div>

      <div className="bg-black/30 border border-white/8 rounded-xl p-4 text-[11px]">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Optimization Strategies</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { t: 'Random Pivot', d: 'Pick random index as pivot. Expected time always O(n log n). Prevents adversarial sorted inputs.' },
            { t: 'Median of 3', d: 'Pivot = median of first, middle, last. Near-optimal split. Used in real stdlib implementations.' },
            { t: '3-way Partition', d: "Dutch National Flag: equal elements go to middle region. O(n) for all-equal arrays. Used in Java's Arrays.sort." },
          ].map((s, i) => (
            <div key={i} className="bg-black/20 border border-white/5 rounded-lg p-3">
              <div className="font-bold text-amber-300 text-xs mb-1">{s.t}</div>
              <div className="text-slate-400">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── HEAP SORT ────────────────────────────────────────────────────────────────
function HeapSortSection() {
  const [substep, setSubstep] = useState(0);
  const [heapStep, setHeapStep] = useState(0);

  const HEAP_ARRAY = [4, 10, 3, 5, 1, 8, 7];
  const BUILD_STEPS = [
    { arr: [4, 10, 3, 5, 1, 8, 7], highlight: 2, label: 'Heapify at i=2 (value=3)' },
    { arr: [4, 10, 8, 5, 1, 3, 7], highlight: 2, label: 'Swap 3↔8, 8 in correct place' },
    { arr: [4, 10, 8, 5, 1, 3, 7], highlight: 1, label: 'Heapify at i=1 (value=10)' },
    { arr: [4, 10, 8, 5, 1, 3, 7], highlight: 1, label: '10 > children 5,1 — no swap' },
    { arr: [4, 10, 8, 5, 1, 3, 7], highlight: 0, label: 'Heapify at i=0 (value=4)' },
    { arr: [10, 5, 8, 4, 1, 3, 7], highlight: 0, label: 'Swap 4↔10 → max-heap built!', done: true },
  ];

  const DERIVE = [
    { formula: 'Build Heap: T_build = ∑ᵢ₌₁ʰ (h−i)·2ⁱ', note: 'Node at height h-i has 2ⁱ nodes. Heapify cost = height = h-i' },
    { formula: 'T_build = n·∑ᵢ₌₀^∞ i/2ⁱ   [substitution]', note: 'Series ∑ i/2ⁱ converges to 2 (geometric-arithmetic series)' },
    { formula: 'T_build = n · 2 = O(n)', note: '⚡ Counter-intuitive: building heap is LINEAR, not O(n log n)!' },
    { formula: 'Extract phase: ∑ᵢ₌₁ⁿ ⌊log i⌋ = log(n!) ≈ n log n', note: "Stirling's approximation: log(n!) = Θ(n log n)" },
    { formula: 'T(n) = O(n) + O(n log n)', note: 'Build + Extract phases combined' },
    { formula: 'T(n) = O(n log n) ✓', note: 'n dominates O(n): final result. Always O(n log n), never O(n²)!' },
  ];

  const hs = BUILD_STEPS[heapStep];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">Heap Structure</div>
          <div className="bg-black/30 border border-white/8 rounded-xl p-4 text-[11px] space-y-2">
            {[
              { t: 'Max-Heap Property', d: 'Parent ≥ both children at every node. Root = maximum element.' },
              { t: 'Binary Heap = Array', d: 'Stored as array. Parent(i) = ⌊(i-1)/2⌋ · Left(i) = 2i+1 · Right(i) = 2i+2' },
              { t: 'Two Phases', d: '① Build max-heap from unsorted array (O(n)) ② Extract max n times, heapify after each (O(n log n))' },
            ].map((c, i) => (
              <div key={i} className="bg-black/20 border border-white/5 rounded-lg p-3">
                <div className="font-bold text-amber-300 mb-0.5">{c.t}</div>
                <div className="text-slate-400">{c.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Build Heap Animation */}
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">Build Max-Heap — Step Trace</div>
          <div className="bg-black/30 border border-amber-500/20 rounded-xl p-4">
            <div className="text-[10px] text-amber-400 mb-3">{hs.label}</div>
            <div className="flex gap-1 mb-3">
              {hs.arr.map((v, i) => (
                <div key={i} className={cx('w-9 h-9 flex flex-col items-center justify-center rounded-lg text-xs font-mono font-bold border transition-all',
                  i === hs.highlight ? 'border-amber-400 bg-amber-500/20 text-amber-300 scale-110' :
                  (hs as any).done ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' :
                  'border-white/5 bg-black/20 text-slate-300')}>
                  {v}
                  <span className="text-[7px] opacity-50">{i}</span>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-slate-500 mb-3">Heap property: arr[parent] ≥ arr[children]<br/>Parent formula: parent(i) = ⌊(i-1)/2⌋</div>
            <div className="flex gap-2">
              <button onClick={() => setHeapStep(Math.max(0, heapStep - 1))} className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-300 hover:bg-white/5">← Back</button>
              <button onClick={() => setHeapStep(Math.min(BUILD_STEPS.length - 1, heapStep + 1))} className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300">Next →</button>
              <span className="ml-auto text-[10px] text-slate-500 self-center">{heapStep + 1}/{BUILD_STEPS.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Phase Analysis Derivation */}
      <div className="bg-black/30 border border-cyan-500/20 rounded-xl p-4">
        <div className="text-xs font-bold text-cyan-300 mb-3">Phase Analysis — Why Build Heap is O(n), not O(n log n)</div>
        <div className="flex flex-col gap-2">
          {DERIVE.slice(0, substep + 1).map((s, i) => (
            <StepBox key={i} n={i + 1} formula={s.formula} note={s.note} active={i === substep} />
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={() => setSubstep(Math.max(0, substep - 1))} className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-300 hover:bg-white/5">← Back</button>
          <button onClick={() => setSubstep(Math.min(DERIVE.length - 1, substep + 1))} className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-xs text-cyan-300">Next →</button>
        </div>
      </div>

      <div className="bg-black/30 border border-emerald-500/20 rounded-xl p-4">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">Heap Sort vs Others</div>
        <div className="grid md:grid-cols-4 gap-2 text-[11px]">
          {[['Time', 'Θ(n log n)', 'text-emerald-400', 'Always — best and worst same'], ['Space', 'O(1)', 'text-blue-400', 'In-place — no auxiliary array'], ['Stable?', 'No ✗', 'text-red-400', 'Heap operations destroy order'], ['Cache', 'Poor', 'text-amber-400', 'Non-sequential access hurts']].map(([l, v, c, d]) => (
            <div key={l} className="bg-black/20 border border-white/5 rounded-lg p-3">
              <div className="text-slate-500 text-[9px] mb-1">{l}</div>
              <div className={`font-mono font-bold ${c} text-sm mb-1`}>{v}</div>
              <div className="text-slate-500 text-[9px]">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STRASSEN ─────────────────────────────────────────────────────────────────
function StrassenSection() {
  const [substep, setSubstep] = useState(0);
  const Ms = ['M₁ = (A₁₁ + A₂₂)(B₁₁ + B₂₂)', 'M₂ = (A₂₁ + A₂₂)·B₁₁', 'M₃ = A₁₁·(B₁₂ − B₂₂)', 'M₄ = A₂₂·(B₂₁ − B₁₁)', 'M₅ = (A₁₁ + A₁₂)·B₂₂', 'M₆ = (A₂₁ − A₁₁)(B₁₁ + B₁₂)', 'M₇ = (A₁₂ − A₂₂)(B₂₁ + B₂₂)'];
  const Cs = ['C₁₁ = M₁ + M₄ − M₅ + M₇', 'C₁₂ = M₃ + M₅', 'C₂₁ = M₂ + M₄', 'C₂₂ = M₁ − M₂ + M₃ + M₆'];

  const DERIVE = [
    { formula: 'Naive: T(n) = 8T(n/2) + O(n²)', note: '8 multiplications of n/2×n/2 submatrices, O(n²) additions' },
    { formula: 'Master: a=8,b=2 → log₂8 = 3. f(n)=n², n^log_b(a)=n³', note: 'f(n)=n²=O(n³⁻¹) → Case 1 → T(n)=O(n³)' },
    { formula: 'Strassen: T(n) = 7T(n/2) + O(n²)', note: 'Strassen found 7 clever multiplications (each costs more additions, but still O(n²))' },
    { formula: 'Master: a=7,b=2 → log₂7 ≈ 2.807. f(n)=n², n^log₂7≈n^2.807', note: 'f(n)=n²=O(n^(2.807-ε)) → Case 1 applies' },
    { formula: 'T(n) = Θ(n^log₂7) ≈ Θ(n^2.807)', note: 'Leaf-dominated — recursion tree depth log n, 7^log n = n^log 7 leaves' },
    { formula: 'Savings: n^3 → n^2.807 for large n', note: 'For n=1024: naive ~10⁹ ops vs Strassen ~10^8.4 ops — ≈4× faster asymptotically' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Setup */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">Traditional vs Strassen</div>
          <div className="flex flex-col gap-2 text-[11px]">
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <div className="font-bold text-red-300 mb-2">Traditional Matrix Multiply</div>
              <div className="font-mono text-slate-400 text-xs mb-2">{`for i,j,k in range(n):\n  C[i][j] += A[i][k]*B[k][j]\n// n³ multiplications!`}</div>
              <div className="font-mono font-bold text-red-400">T(n) = O(n³)</div>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
              <div className="font-bold text-emerald-300 mb-2">Strassen's Method</div>
              <div className="text-slate-400 mb-2">Divide n×n matrices into 4 × (n/2)×(n/2) submatrices. Use <strong className="text-white">7 multiplications</strong> instead of 8 via algebraic identities.</div>
              <div className="font-mono font-bold text-emerald-400">T(n) = O(n^log₂7) ≈ O(n^2.807)</div>
            </div>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">Block Decomposition</div>
          <div className="bg-black/30 border border-white/8 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-1 mb-3 text-center text-[10px] font-mono">
              {[['A₁₁', 'A₁₂', 'B₁₁', 'B₁₂'], ['A₂₁', 'A₂₂', 'B₂₁', 'B₂₂']].map((row, ri) => (
                <div key={ri} className="col-span-2 flex gap-1 justify-center">
                  <div className="flex gap-0.5">
                    {row.slice(0, 2).map(c => <div key={c} className="w-10 h-8 rounded border border-blue-500/30 bg-blue-500/10 text-blue-300 flex items-center justify-center">{c}</div>)}
                  </div>
                  <div className="flex items-center text-slate-600 px-1">×</div>
                  <div className="flex gap-0.5">
                    {row.slice(2).map(c => <div key={c} className="w-10 h-8 rounded border border-purple-500/30 bg-purple-500/10 text-purple-300 flex items-center justify-center">{c}</div>)}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[9px] text-slate-500 text-center mb-3">Each block is an (n/2)×(n/2) matrix</div>
            <div className="text-[10px] text-slate-400">Traditional needs 8 multiplications of blocks. Strassen uses <span className="text-amber-400 font-bold">7 clever products M₁…M₇</span> and more additions (additions are cheaper).</div>
          </div>
        </div>
      </div>

      {/* 7 Multiplications */}
      <div className="bg-black/30 border border-amber-500/20 rounded-xl p-4">
        <div className="text-xs font-bold text-amber-300 mb-3">Strassen's 7 Magical Products (why 7 works)</div>
        <div className="grid md:grid-cols-2 gap-2">
          {Ms.map((m, i) => (
            <div key={i} className="flex items-center gap-2 bg-black/20 border border-white/5 rounded-lg px-3 py-2">
              <span className="text-amber-400 font-mono text-xs font-bold w-4">{i + 1}.</span>
              <code className="text-[11px] font-mono text-slate-300">{m}</code>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {Cs.map((c, i) => (
            <div key={i} className="bg-emerald-500/8 border border-emerald-500/20 rounded-lg px-2 py-1.5">
              <code className="text-[10px] font-mono text-emerald-300">{c}</code>
            </div>
          ))}
        </div>
        <div className="mt-2 text-[10px] text-slate-500">7 multiplications + 18 additions = better than 8 multiplications + 4 additions for large n</div>
      </div>

      {/* Master Theorem Derivation */}
      <div className="bg-black/30 border border-cyan-500/20 rounded-xl p-4">
        <div className="text-xs font-bold text-cyan-300 mb-3">Complexity Analysis — Master Theorem Applied</div>
        <div className="flex flex-col gap-2">
          {DERIVE.slice(0, substep + 1).map((s, i) => (
            <StepBox key={i} n={i + 1} formula={s.formula} note={s.note} active={i === substep} />
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={() => setSubstep(Math.max(0, substep - 1))} className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-300 hover:bg-white/5">← Back</button>
          <button onClick={() => setSubstep(Math.min(DERIVE.length - 1, substep + 1))} className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-xs text-cyan-300">Next →</button>
        </div>
      </div>

      {/* Complexity comparison */}
      <div className="bg-black/30 border border-white/8 rounded-xl p-4">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">Algorithm Comparison (n×n matrices)</div>
        <div className="space-y-2">
          {[
            { algo: 'Naive (schoolbook)', ops: 'n³', pct: 100, color: '#ef4444' },
            { algo: "Strassen's", ops: 'n^2.807', pct: 72, color: '#f59e0b' },
            { algo: 'Coppersmith-Winograd', ops: 'n^2.376', pct: 50, color: '#10b981' },
            { algo: 'Current best (2023)', ops: 'n^2.371', pct: 48, color: '#3b82f6' },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-44 text-[11px] text-slate-300">{r.algo}</div>
              <div className="flex-1 h-5 bg-black/40 rounded overflow-hidden">
                <div className="h-full rounded" style={{ width: `${r.pct}%`, background: r.color, opacity: 0.75 }} />
              </div>
              <div className="text-[11px] font-mono font-bold" style={{ color: r.color }}>{r.ops}</div>
            </div>
          ))}
        </div>
        <div className="text-[10px] text-slate-600 mt-2 text-center">Note: Strassen is rarely used in practice for small n due to high constants and numerical instability.</div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const ALGOS = [
  { id: 'bs', label: 'Binary Search', emoji: '🔍', color: 'border-blue-500/40 bg-blue-500/10 text-blue-300', rec: 'T(n) = T(n/2) + O(1)', result: 'O(log n)' },
  { id: 'ms', label: 'Merge Sort', emoji: '🔀', color: 'border-purple-500/40 bg-purple-500/10 text-purple-300', rec: 'T(n) = 2T(n/2) + O(n)', result: 'O(n log n)' },
  { id: 'qs', label: 'Quick Sort', emoji: '⚡', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300', rec: 'T(n) = 2T(n/2) + O(n) avg', result: 'O(n log n) avg' },
  { id: 'hs', label: 'Heap Sort', emoji: '🏔️', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300', rec: 'T(n) = T(n-1) + O(log n)', result: 'O(n log n)' },
  { id: 'st', label: "Strassen's", emoji: '🧮', color: 'border-orange-500/40 bg-orange-500/10 text-orange-300', rec: 'T(n) = 7T(n/2) + O(n²)', result: 'O(n^2.807)' },
];

export function AlgorithmAnalysis() {
  const [active, setActive] = useState('bs');

  return (
    <div className="flex flex-col gap-0">
      {/* Hero */}
      <div className="relative px-8 pt-8 pb-5 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-emerald-900/10 to-transparent" />
        <div className="relative">
          <div className="text-[11px] uppercase tracking-widest text-indigo-400 font-semibold mb-2">DAA — Unit 2 Analysis</div>
          <h1 className="text-2xl font-black text-white mb-2">
            Algorithm <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">Deep Analysis</span>
          </h1>
          <p className="text-slate-400 text-sm">Step-by-step visual derivations for Binary Search, Merge Sort, Quick Sort, Heap Sort & Strassen's. Every aspect — trace, recurrence, recursion tree, complexity.</p>
        </div>
      </div>

      {/* Selector tabs */}
      <div className="flex gap-2 p-4 border-b border-white/5 flex-wrap">
        {ALGOS.map(a => (
          <button key={a.id} onClick={() => setActive(a.id)}
            className={cx('flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all',
              active === a.id ? a.color : 'border-white/5 text-slate-400 hover:border-white/15 hover:text-white')}>
            <span>{a.emoji}</span>
            {a.label}
            {active === a.id && (
              <span className={cx('text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30 ml-1', a.color.split(' ')[2])}>{a.result}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Recurrence banner */}
        <div className="flex items-center gap-4 mb-4 bg-black/30 border border-white/8 rounded-xl px-4 py-3">
          <div className="text-2xl">{ALGOS.find(a => a.id === active)?.emoji}</div>
          <div>
            <div className="text-lg font-bold text-white">{ALGOS.find(a => a.id === active)?.label}</div>
            <div className="flex gap-4 text-[11px] mt-0.5">
              <span className="text-slate-500">Recurrence: </span>
              <Mono color="text-amber-300">{ALGOS.find(a => a.id === active)?.rec}</Mono>
              <span className="text-slate-500 ml-2">Result: </span>
              <Mono color="text-emerald-400">{ALGOS.find(a => a.id === active)?.result}</Mono>
            </div>
          </div>
        </div>

        {active === 'bs' && <BinarySearchSection />}
        {active === 'ms' && <MergeSortSection />}
        {active === 'qs' && <QuickSortSection />}
        {active === 'hs' && <HeapSortSection />}
        {active === 'st' && <StrassenSection />}
      </div>
    </div>
  );
}
