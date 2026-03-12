export type PathEvent =
  | { type: 'explore'; node: number }
  | { type: 'path'; nodes: number[] }
  | { type: 'noPath' };

export type GridNode = {
  id: number;
  row: number;
  col: number;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
};

export function buildGrid(rows: number, cols: number): { grid: GridNode[]; start: number; end: number } {
  const grid: GridNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = r * cols + c;
      grid.push({ id, row: r, col: c, isWall: false, isStart: false, isEnd: false });
    }
  }
  const startId = 0;
  const endId = rows * cols - 1;
  grid[startId].isStart = true;
  grid[endId].isEnd = true;

  // Random walls (~25% of non-start/end cells)
  for (let i = 0; i < grid.length; i++) {
    if (!grid[i].isStart && !grid[i].isEnd && Math.random() < 0.25) {
      grid[i].isWall = true;
    }
  }

  return { grid, start: startId, end: endId };
}

function getNeighbors(id: number, cols: number, rows: number, grid: GridNode[]): number[] {
  const node = grid[id];
  const neighbors: number[] = [];
  const { row, col } = node;
  if (row > 0) neighbors.push((row - 1) * cols + col);
  if (row < rows - 1) neighbors.push((row + 1) * cols + col);
  if (col > 0) neighbors.push(row * cols + (col - 1));
  if (col < cols - 1) neighbors.push(row * cols + (col + 1));
  return neighbors.filter(nid => !grid[nid].isWall);
}

export function getDijkstraEvents(grid: GridNode[], start: number, end: number, rows: number, cols: number): PathEvent[] {
  const events: PathEvent[] = [];
  const dist = new Array(grid.length).fill(Infinity);
  const prev = new Array(grid.length).fill(-1);
  const visited = new Set<number>();
  dist[start] = 0;

  // Simple priority queue via sorted array
  const pq: { id: number; cost: number }[] = [{ id: start, cost: 0 }];

  while (pq.length > 0) {
    pq.sort((a, b) => a.cost - b.cost);
    const { id: curr } = pq.shift()!;
    if (visited.has(curr)) continue;
    visited.add(curr);
    events.push({ type: 'explore', node: curr });

    if (curr === end) break;

    for (const nid of getNeighbors(curr, cols, rows, grid)) {
      const newDist = dist[curr] + 1;
      if (newDist < dist[nid]) {
        dist[nid] = newDist;
        prev[nid] = curr;
        pq.push({ id: nid, cost: newDist });
      }
    }
  }

  // Reconstruct path
  if (dist[end] === Infinity) {
    events.push({ type: 'noPath' });
  } else {
    const path: number[] = [];
    let curr = end;
    while (curr !== -1) { path.unshift(curr); curr = prev[curr]; }
    events.push({ type: 'path', nodes: path });
  }

  return events;
}

export function getAStarEvents(grid: GridNode[], start: number, end: number, rows: number, cols: number): PathEvent[] {
  const events: PathEvent[] = [];
  const endNode = grid[end];
  const heuristic = (id: number) => {
    const n = grid[id];
    return Math.abs(n.row - endNode.row) + Math.abs(n.col - endNode.col);
  };

  const g = new Array(grid.length).fill(Infinity);
  const f = new Array(grid.length).fill(Infinity);
  const prev = new Array(grid.length).fill(-1);
  const visited = new Set<number>();
  g[start] = 0;
  f[start] = heuristic(start);

  const open: { id: number; cost: number }[] = [{ id: start, cost: f[start] }];

  while (open.length > 0) {
    open.sort((a, b) => a.cost - b.cost);
    const { id: curr } = open.shift()!;
    if (visited.has(curr)) continue;
    visited.add(curr);
    events.push({ type: 'explore', node: curr });

    if (curr === end) break;

    for (const nid of getNeighbors(curr, cols, rows, grid)) {
      const newG = g[curr] + 1;
      if (newG < g[nid]) {
        g[nid] = newG;
        f[nid] = newG + heuristic(nid);
        prev[nid] = curr;
        open.push({ id: nid, cost: f[nid] });
      }
    }
  }

  if (g[end] === Infinity) {
    events.push({ type: 'noPath' });
  } else {
    const path: number[] = [];
    let curr = end;
    while (curr !== -1) { path.unshift(curr); curr = prev[curr]; }
    events.push({ type: 'path', nodes: path });
  }

  return events;
}
