"use client";

import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { useMounted } from '@/hooks/useMounted';
import { Waypoints, TerminalSquare, FlaskConical } from 'lucide-react';

const PATH_META: Record<string, {
  time: string; space: string; description: string;
  recurrence: string; recurrenceExplain: string; code: string;
}> = {
  dijkstra: {
    time: 'O((V + E) log V)', space: 'O(V)',
    description: "Dijkstra's algorithm finds shortest paths from a source by greedily visiting the closest unvisited node. Optimal for non-negative weights.",
    recurrence: 'T(V, E) = O((V + E) log V)',
    recurrenceExplain: 'Each of V vertices is extracted from the min-heap (O(log V)). Each of E edges may trigger a decrease-key (O(log V)). Total: O((V+E) log V).',
    code: `function dijkstra(graph, start) {
  const dist = {[start]: 0};
  const pq = [[0, start]];
  while (pq.length) {
    const [d, u] = pq.shift();
    for (const [v, w] of graph[u]) {
      if ((dist[v] ?? Inf) > d + w) {
        dist[v] = d + w;
        pq.push([dist[v], v]);
      }
    }
  }
  return dist;
}`,
  },
  astar: {
    time: 'O(E log V)', space: 'O(V)',
    description: 'A* uses a heuristic (Manhattan distance) to guide the search toward the goal, making it much faster than Dijkstra while still finding the optimal path.',
    recurrence: 'T(n) = O(E log V)  [heuristic-guided]',
    recurrenceExplain: 'A* explores far fewer nodes than Dijkstra because f(n) = g(n) + h(n) prunes unpromising paths. With a perfect heuristic, complexity approaches O(E).',
    code: `function aStar(grid, start, end) {
  const open = [[h(start), start]];
  const g = {[start]: 0};
  const prev = {};
  while (open.length) {
    const [, curr] = open.shift();
    if (curr === end) return reconstruct(prev, end);
    for (const next of neighbors(curr)) {
      const ng = g[curr] + 1;
      if (ng < (g[next] ?? Inf)) {
        g[next] = ng;
        open.push([ng + h(next), next]);
        prev[next] = curr;
      }
    }
  }
}`,
  },
};

export function PathInfoPanel() {
  const mounted = useMounted();
  const store = useAlgorithmStore();

  if (!mounted) return <div className="flex flex-col gap-4 h-full w-80 animate-pulse" />;

  const { activePathAlgorithm, comparisons, swaps, elapsedMs, playbackState } = store;
  const meta = PATH_META[activePathAlgorithm] ?? PATH_META.dijkstra;

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto">
      <div className="glass-panel p-4 text-slate-400 text-xs leading-relaxed border-l-2 border-cyan-500/50 flex-shrink-0">
        <span className="text-cyan-300 font-semibold">
          {activePathAlgorithm === 'astar' ? 'A*' : "Dijkstra's"}: {' '}
        </span>
        {meta.description}
      </div>

      <div className="glass-panel p-4 text-slate-300 flex-shrink-0">
        <div className="flex items-center gap-2 text-white border-b border-white/10 pb-2 mb-3">
          <Waypoints size={15} className="text-cyan-400" />
          <h2 className="font-semibold text-sm">Path Stats</h2>
          {playbackState === 'completed' && elapsedMs > 0 && (
            <span className="ml-auto text-xs text-emerald-400">{(elapsedMs / 1000).toFixed(2)}s</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-black/30 p-3 rounded-lg border border-white/5">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Cells Explored</div>
            <div className="text-2xl font-mono text-cyan-400">{comparisons}</div>
          </div>
          <div className="bg-black/30 p-3 rounded-lg border border-white/5">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Path Length</div>
            <div className="text-2xl font-mono text-amber-400">{swaps > 0 ? swaps : '—'}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-black/30 p-2 rounded-lg border border-white/5">
            <div className="text-[9px] uppercase text-slate-500">Time</div>
            <div className="text-xs font-mono text-emerald-400">{meta.time}</div>
          </div>
          <div className="bg-black/30 p-2 rounded-lg border border-white/5">
            <div className="text-[9px] uppercase text-slate-500">Space</div>
            <div className="text-xs font-mono text-emerald-400">{meta.space}</div>
          </div>
        </div>
      </div>

      {/* Recurrence */}
      <div className="glass-panel p-4 text-slate-300 flex-shrink-0">
        <div className="flex items-center gap-2 text-white border-b border-white/10 pb-2 mb-3">
          <FlaskConical size={15} className="text-amber-400" />
          <h2 className="font-semibold text-sm">Recurrence / Complexity</h2>
        </div>
        <div className="bg-[#0d1117] rounded-lg px-4 py-3 border border-white/5 mb-2 text-center">
          <code className="text-amber-300 font-mono text-sm font-bold">{meta.recurrence}</code>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">{meta.recurrenceExplain}</p>
      </div>

      <div className="glass-panel p-4 text-slate-300 flex flex-col min-h-0">
        <div className="flex items-center gap-2 text-white border-b border-white/10 pb-2 mb-3">
          <TerminalSquare size={15} className="text-cyan-400" />
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
