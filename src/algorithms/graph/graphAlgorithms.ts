export type GraphNode = { id: number; x: number; y: number; z: number };
export type GraphEdge = { from: number; to: number };
export type GraphEvent =
  | { type: 'visit'; node: number }
  | { type: 'explore'; from: number; to: number }
  | { type: 'markDone'; node: number }
  | { type: 'callPush'; node: number; depth: number }       // DFS pushed a new frame
  | { type: 'callPop'; node: number }                       // DFS returned from a frame
  | { type: 'queueUpdate'; queue: number[] };               // BFS current queue contents

// Larger, more complex graph with hub nodes
export function buildCircularGraph(nodeCount: number) {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const adj: number[][] = Array.from({ length: nodeCount }, () => []);
  const inner = 4, outer = nodeCount - inner;
  const innerR = 2.8, outerR = 6.2;

  // Inner hub nodes
  for (let i = 0; i < inner; i++) {
    const a = (2 * Math.PI * i) / inner;
    nodes.push({ id: i, x: Math.cos(a) * innerR, y: Math.sin(a) * innerR, z: 0 });
  }
  // Outer ring nodes
  for (let i = 0; i < outer; i++) {
    const a = (2 * Math.PI * i) / outer - Math.PI / 2;
    nodes.push({ id: inner + i, x: Math.cos(a) * outerR, y: Math.sin(a) * outerR, z: 0 });
  }

  const addEdge = (a: number, b: number) => {
    if (a !== b && !adj[a].includes(b)) {
      adj[a].push(b); adj[b].push(a);
      edges.push({ from: a, to: b });
    }
  };

  // Inner hub fully connected
  for (let i = 0; i < inner; i++)
    for (let j = i + 1; j < inner; j++) addEdge(i, j);

  // Outer ring (circular)
  for (let i = 0; i < outer; i++) addEdge(inner + i, inner + (i + 1) % outer);

  // Each outer node connects to at least one hub
  for (let i = 0; i < outer; i++) addEdge(inner + i, i % inner);

  // Extra cross-links for complexity
  const extras = [[4, 11], [5, 9], [6, 14], [7, 10], [8, 13], [12, 15], [0, 6], [1, 8]];
  extras.forEach(([a, b]) => { if (a < nodeCount && b < nodeCount) addEdge(a, b); });

  return { nodes, edges, adj };
}

// BFS — emits visit + explore + queueUpdate events
export function getBFSEvents(adj: number[][], start: number): GraphEvent[] {
  const events: GraphEvent[] = [];
  const visited = new Set<number>([start]);
  const queue: number[] = [start];
  events.push({ type: 'visit', node: start });
  events.push({ type: 'queueUpdate', queue: [...queue] });

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const neighbor of adj[current]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        events.push({ type: 'explore', from: current, to: neighbor });
        events.push({ type: 'visit', node: neighbor });
        queue.push(neighbor);
        events.push({ type: 'queueUpdate', queue: [...queue] });
      }
    }
    events.push({ type: 'markDone', node: current });
  }

  return events;
}

// DFS — emits callPush/callPop events for call stack visualization
export function getDFSEvents(adj: number[][], start: number): GraphEvent[] {
  const events: GraphEvent[] = [];
  const visited = new Set<number>();

  function dfs(node: number, depth: number) {
    visited.add(node);
    events.push({ type: 'callPush', node, depth });
    events.push({ type: 'visit', node });

    for (const neighbor of adj[node]) {
      if (!visited.has(neighbor)) {
        events.push({ type: 'explore', from: node, to: neighbor });
        dfs(neighbor, depth + 1);
      }
    }
    events.push({ type: 'markDone', node });
    events.push({ type: 'callPop', node });
  }

  dfs(start, 0);
  return events;
}
