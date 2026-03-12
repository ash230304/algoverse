"use client";

import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { useMounted } from '@/hooks/useMounted';
import { Box, TerminalSquare, FlaskConical } from 'lucide-react';

const DS_META: Record<string, {
  time: Record<string, string>; space: string; description: string;
  recurrence: string; recurrenceExplain: string; code: string;
}> = {
  stack: {
    time: { push: 'O(1)', pop: 'O(1)', peek: 'O(1)' }, space: 'O(n)',
    description: 'A Stack is a LIFO structure — elements are pushed and popped from the same end (top). Used for recursion, undo/redo, and expression parsing.',
    recurrence: 'T(push/pop) = O(1)',
    recurrenceExplain: 'All stack operations access only the top element — no traversal needed. This makes the call stack O(1) per frame, total O(n) for n operations.',
    code: `class Stack {
  constructor() { this.items = []; }
  push(val) { this.items.push(val); }
  pop() { return this.items.pop(); }
  peek() { return this.items.at(-1); }
  isEmpty() { return this.items.length === 0; }
}`,
  },
  queue: {
    time: { enqueue: 'O(1)', dequeue: 'O(1)', peek: 'O(1)' }, space: 'O(n)',
    description: 'A Queue is a FIFO structure — elements are enqueued at the rear and dequeued from the front. Used in BFS, task scheduling, and buffering.',
    recurrence: 'T(enqueue/dequeue) = O(1)',
    recurrenceExplain: 'With a linked list or circular buffer, both ends are accessed in O(1). Simple array-based dequeue is O(n) due to shifting; use a deque for true O(1).',
    code: `class Queue {
  constructor() { this.items = []; }
  enqueue(val) { this.items.push(val); }
  dequeue() { return this.items.shift(); }
  front() { return this.items[0]; }
  isEmpty() { return this.items.length === 0; }
}`,
  },
  bst: {
    time: { insert: 'O(log n)', search: 'O(log n)', delete: 'O(log n)' }, space: 'O(n)',
    description: 'A Binary Search Tree keeps left < root < right at every node, enabling fast O(log n) average operations. Worst case O(n) on a skewed tree.',
    recurrence: 'T(n) = T(n/2) + O(1)',
    recurrenceExplain: 'At each level, only one subtree is visited (halving the problem). By Master Theorem (Case 2): T(n) = O(log n). Balanced BST guarantees this; unbalanced degrades to O(n).',
    code: `function insert(root, val) {
  if (!root) return { val, left: null, right: null };
  if (val < root.val)
    root.left = insert(root.left, val);
  else
    root.right = insert(root.right, val);
  return root;
}`,
  },
};

export function DSInfoPanel() {
  const mounted = useMounted();
  const store = useAlgorithmStore();

  if (!mounted) return <div className="flex flex-col gap-4 h-full w-80 animate-pulse" />;

  const { activeDsAlgorithm } = store;
  const meta = DS_META[activeDsAlgorithm] ?? DS_META.stack;

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto">
      <div className="glass-panel p-4 text-slate-400 text-xs leading-relaxed border-l-2 border-orange-500/50 flex-shrink-0">
        <span className="text-orange-300 font-semibold">
          {activeDsAlgorithm.toUpperCase()}: {' '}
        </span>
        {meta.description}
      </div>

      <div className="glass-panel p-4 text-slate-300 flex-shrink-0">
        <div className="flex items-center gap-2 text-white border-b border-white/10 pb-2 mb-3">
          <Box size={15} className="text-orange-400" />
          <h2 className="font-semibold text-sm">Operation Complexity</h2>
        </div>
        <div className="flex flex-col gap-2">
          {Object.entries(meta.time).map(([op, complexity]) => (
            <div key={op} className="flex items-center justify-between bg-black/30 px-3 py-2 rounded-lg border border-white/5">
              <span className="text-sm text-slate-300 font-mono">{op}()</span>
              <span className="text-sm font-mono text-emerald-400">{complexity}</span>
            </div>
          ))}
          <div className="flex items-center justify-between bg-black/30 px-3 py-2 rounded-lg border border-white/5">
            <span className="text-sm text-slate-300 font-mono">Space</span>
            <span className="text-sm font-mono text-amber-400">{meta.space}</span>
          </div>
        </div>
      </div>

      {/* Recurrence */}
      <div className="glass-panel p-4 text-slate-300 flex-shrink-0">
        <div className="flex items-center gap-2 text-white border-b border-white/10 pb-2 mb-3">
          <FlaskConical size={15} className="text-amber-400" />
          <h2 className="font-semibold text-sm">Recurrence / Analysis</h2>
        </div>
        <div className="bg-[#0d1117] rounded-lg px-4 py-3 border border-white/5 mb-2 text-center">
          <code className="text-amber-300 font-mono text-sm font-bold">{meta.recurrence}</code>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">{meta.recurrenceExplain}</p>
      </div>

      <div className="glass-panel p-4 text-slate-300 flex flex-col min-h-0">
        <div className="flex items-center gap-2 text-white border-b border-white/10 pb-2 mb-3">
          <TerminalSquare size={15} className="text-orange-400" />
          <h2 className="font-semibold text-sm">Implementation</h2>
        </div>
        <div className="bg-[#0d1117] rounded-lg p-3 overflow-y-auto border border-white/5">
          <pre className="text-[11px] font-mono text-slate-300 leading-relaxed whitespace-pre">
            <code>{meta.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
