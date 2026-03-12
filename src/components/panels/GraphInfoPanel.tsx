"use client";

import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { useMounted } from '@/hooks/useMounted';
import { Network, TerminalSquare, FlaskConical, Layers, List } from 'lucide-react';
import { GenericDeepDive } from '@/components/panels/InfoPanel';

const GRAPH_DEEP_DIVE: Record<string, Parameters<typeof GenericDeepDive>[0]> = {
  bfs: {
    method: 'Work Accounting',
    color: 'border-purple-500/30',
    conclusionColor: 'text-emerald-400',
    conclusion: 'T(V, E) = O(V + E)',
    steps: [
      { step: 'Setup', formula: 'Visited = {} , Queue = [start]', note: 'Each vertex enters and leaves the queue at most once' },
      { step: 'Vertex Work', formula: '∑_v ∈ V O(1) = O(V)', note: 'Dequeue + process each vertex exactly once → linear in #vertices' },
      { step: 'Edge Work', formula: '∑_v ∈ V |adj[v]| = O(E)', note: 'We scan adjacency list of every vertex → total edges examined = 2E (undirected)' },
      { step: 'Queue Ops', formula: 'Enqueue O(1) × V + Dequeue O(1) × V', note: 'Each of V vertices enqueued once and dequeued once → O(V)' },
      { step: 'Total', formula: 'T = O(V) + O(E) = O(V + E)', note: 'Space O(V) for visited set + queue (at most all nodes queued)' },
      { step: 'Final Result', formula: 'T(V, E) = O(V + E)', note: 'Optimal — you must touch every reachable vertex/edge at least once' },
    ],
  },
  dfs: {
    method: 'Substitution / Call Tree',
    color: 'border-purple-500/30',
    conclusionColor: 'text-emerald-400',
    conclusion: 'T(V, E) = O(V + E)',
    steps: [
      { step: 'Recurrence', formula: 'T(v) = O(1) + ∑_{u ∈ adj[v], u unvisited} T(u)', note: 'DFS on node v calls itself on each unvisited neighbor' },
      { step: 'Call Tree', formula: 'DFS tree has ≤ V−1 tree edges', note: 'Each recursive call corresponds to a tree edge; each non-tree edge just checks visited' },
      { step: 'Tree Edge Work', formula: '# tree calls = V − 1 = O(V)', note: 'Each vertex is the root of at most one recursive call in the DFS tree' },
      { step: 'Back Edge Work', formula: '# back-edge checks = E − (V − 1) = O(E)', note: 'Each already-visited neighbor triggers an O(1) check' },
      { step: 'Call Stack Depth', formula: 'depth ≤ V  →  space = O(V)', note: 'In worst case (a chain graph), recursion goes V levels deep' },
      { step: 'Final Result', formula: 'T(V, E) = O(V + E)', note: 'Identical complexity to BFS but uses recursion (stack) instead of an explicit queue' },
    ],
  },
};

const GRAPH_META: Record<string, {
  time: string; space: string; description: string;
  recurrence: string; recurrenceExplain: string; code: string;
}> = {
  bfs: {
    time: 'O(V + E)', space: 'O(V)',
    description: 'Breadth-First Search explores all neighbors level by level using a queue. Guarantees shortest path in unweighted graphs.',
    recurrence: 'T(V, E) = O(V + E)',
    recurrenceExplain: 'Each vertex enqueued once O(V); each edge examined from each endpoint O(E). Total: O(V+E).',
    code: `function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  while (queue.length) {
    const node = queue.shift();
    for (const n of graph[node])
      if (!visited.has(n)) {
        visited.add(n);
        queue.push(n);
      }
  }
}`,
  },
  dfs: {
    time: 'O(V + E)', space: 'O(V)',
    description: 'Depth-First Search explores as deep as possible before backtracking. Uses recursion — the call stack IS the algorithm.',
    recurrence: 'T(n) = T(n₁) + T(n₂) + … + O(1)',
    recurrenceExplain: 'DFS recurses once per adjacent unvisited node. Each vertex/edge processed once → O(V+E). Call stack depth bounded by O(V).',
    code: `function dfs(graph, node, visited = new Set()) {
  visited.add(node);
  for (const n of graph[node])
    if (!visited.has(n))
      dfs(graph, n, visited);
}`,
  },
};

// Visual call stack for DFS
function CallStackView({ stack }: { stack: number[] }) {
  if (stack.length === 0) {
    return (
      <div className="flex items-center justify-center h-16 text-slate-600 text-xs italic">
        Stack empty — press Play to run DFS
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse gap-1 max-h-48 overflow-y-auto">
      {stack.map((node, i) => {
        const isTop = i === stack.length - 1;
        const depth = i;
        return (
          <div key={i} className="flex items-center gap-2" style={{ paddingLeft: `${depth * 6}px` }}>
            <div className={`flex-1 flex items-center justify-between px-3 py-1.5 rounded-md border text-sm font-mono transition-all ${
              isTop
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                : 'bg-black/30 border-white/5 text-slate-400'
            }`}>
              <span>dfs(<span className={isTop ? 'text-amber-400 font-bold' : 'text-purple-300'}>{node}</span>)</span>
              <span className="text-[10px] text-slate-600">depth {depth}</span>
            </div>
          </div>
        );
      })}
      <div className="flex items-center justify-center py-1 text-[10px] text-slate-600 border-t border-white/5 mt-1">
        ▲ CALL STACK ▲ (push ↑ / pop ↓)
      </div>
    </div>
  );
}

// BFS queue viewer
function QueueView({ queue }: { queue: number[] }) {
  if (queue.length === 0) {
    return (
      <div className="flex items-center justify-center h-12 text-slate-600 text-xs italic">
        Queue empty — press Play to run BFS
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-[10px] text-emerald-500 font-mono mr-1">FRONT→</span>
        {queue.map((n, i) => (
          <div key={i} className={`px-2 py-1 rounded text-xs font-mono font-bold border transition-all ${
            i === 0
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
              : i === queue.length - 1
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
              : 'bg-black/30 border-white/5 text-slate-300'
          }`}>
            {n}
          </div>
        ))}
        <span className="text-[10px] text-amber-500 font-mono ml-1">←REAR</span>
      </div>
      <div className="text-[10px] text-slate-600 text-center">{queue.length} node{queue.length !== 1 ? 's' : ''} in queue</div>
    </div>
  );
}

export function GraphInfoPanel() {
  const mounted = useMounted();
  const store = useAlgorithmStore();

  if (!mounted) return <div className="flex flex-col gap-4 h-full w-80 animate-pulse" />;

  const { activeGraphAlgorithm, comparisons, elapsedMs, playbackState, callStack, queueState } = store;
  const meta = GRAPH_META[activeGraphAlgorithm] ?? GRAPH_META.bfs;
  const isDFS = activeGraphAlgorithm === 'dfs';

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto">
      {/* Description */}
      <div className="glass-panel p-4 text-slate-400 text-xs leading-relaxed border-l-2 border-purple-500/50 flex-shrink-0">
        <span className="text-purple-300 font-semibold">{activeGraphAlgorithm.toUpperCase()}: </span>
        {meta.description}
      </div>

      {/* Live Call Stack / Queue */}
      <div className="glass-panel p-4 text-slate-300 flex-shrink-0">
        <div className="flex items-center gap-2 text-white border-b border-white/10 pb-2 mb-3">
          {isDFS ? <Layers size={15} className="text-amber-400" /> : <List size={15} className="text-emerald-400" />}
          <h2 className="font-semibold text-sm">{isDFS ? 'Call Stack (Live)' : 'Queue State (Live)'}</h2>
          <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full border font-mono ${
            playbackState === 'playing'
              ? 'text-green-400 border-green-500/30 bg-green-500/10 animate-pulse'
              : 'text-slate-600 border-slate-700'
          }`}>{playbackState === 'playing' ? '● LIVE' : '○ IDLE'}</span>
        </div>
        {isDFS
          ? <CallStackView stack={callStack} />
          : <QueueView queue={queueState} />
        }
      </div>

      {/* Stats */}
      <div className="glass-panel p-4 text-slate-300 flex-shrink-0">
        <div className="flex items-center gap-2 text-white border-b border-white/10 pb-2 mb-3">
          <Network size={15} className="text-purple-400" />
          <h2 className="font-semibold text-sm">Graph Stats</h2>
          {playbackState === 'completed' && elapsedMs > 0 && (
            <span className="ml-auto text-xs text-emerald-400">{(elapsedMs / 1000).toFixed(2)}s</span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-black/30 p-2 rounded-lg border border-white/5 text-center">
            <div className="text-[9px] uppercase text-slate-500 mb-1">Visited</div>
            <div className="text-xl font-mono text-purple-400">{comparisons}</div>
          </div>
          <div className="bg-black/30 p-2 rounded-lg border border-white/5 text-center">
            <div className="text-[9px] uppercase text-slate-500 mb-1">Nodes</div>
            <div className="text-xl font-mono text-slate-300">16</div>
          </div>
          <div className="bg-black/30 p-2 rounded-lg border border-white/5 text-center">
            <div className="text-[9px] uppercase text-slate-500 mb-1">{isDFS ? 'Depth' : 'Queue'}</div>
            <div className="text-xl font-mono text-amber-400">
              {isDFS ? callStack.length : queueState.length}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-black/30 p-2 rounded-lg border border-white/5">
            <div className="text-[9px] uppercase text-slate-500">Time</div>
            <div className="text-sm font-mono text-emerald-400">{meta.time}</div>
          </div>
          <div className="bg-black/30 p-2 rounded-lg border border-white/5">
            <div className="text-[9px] uppercase text-slate-500">Space</div>
            <div className="text-sm font-mono text-emerald-400">{meta.space}</div>
          </div>
        </div>
      </div>

      {/* Recurrence */}
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

      {/* Deep Dive */}
      <GenericDeepDive {...GRAPH_DEEP_DIVE[activeGraphAlgorithm]} />

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
