// @ts-nocheck
"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { Plus, RotateCw, Trash2, Info, ChevronRight } from 'lucide-react';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. AVL TREE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface AVLNode {
  val: number; left: AVLNode | null; right: AVLNode | null;
  h: number; bf: number;
  id: number; fresh?: boolean; rotated?: boolean;
  x?: number; y?: number;
}

let _avlId = 0;
function avlNew(v: number): AVLNode {
  return { val: v, left: null, right: null, h: 1, bf: 0, id: ++_avlId, fresh: true };
}
function avlH(n: AVLNode | null) { return n ? n.h : 0; }
function avlUpdate(n: AVLNode) {
  n.h = 1 + Math.max(avlH(n.left), avlH(n.right));
  n.bf = avlH(n.left) - avlH(n.right);
}
function avlRotL(x: AVLNode): AVLNode {
  const y = x.right!; x.right = y.left; y.left = x;
  avlUpdate(x); avlUpdate(y); y.rotated = true; return y;
}
function avlRotR(y: AVLNode): AVLNode {
  const x = y.left!; y.left = x.right; x.right = y;
  avlUpdate(y); avlUpdate(x); x.rotated = true; return x;
}
function avlInsert(n: AVLNode | null, v: number, log: string[]): { node: AVLNode; type: string } {
  if (!n) return { node: avlNew(v), type: '' };
  if (v < n.val) { const r = avlInsert(n.left, v, log); n.left = r.node; }
  else if (v > n.val) { const r = avlInsert(n.right, v, log); n.right = r.node; }
  else return { node: n, type: '' };
  avlUpdate(n);
  let type = '';
  if (n.bf > 1) {
    if (v < n.left!.val) { type = 'LL'; log.push(`LL rotation at ${n.val}`); n = avlRotR(n); }
    else { type = 'LR'; log.push(`LR rotation at ${n.val}`); n.left = avlRotL(n.left!); n = avlRotR(n); }
  } else if (n.bf < -1) {
    if (v > n.right!.val) { type = 'RR'; log.push(`RR rotation at ${n.val}`); n = avlRotL(n); }
    else { type = 'RL'; log.push(`RL rotation at ${n.val}`); n.right = avlRotR(n.right!); n = avlRotL(n); }
  }
  return { node: n, type };
}

function avlLayout(n: AVLNode | null, depth = 0, left = 0, right = 1, nodes: AVLNode[] = [], edges: [number,number,number,number][] = []) {
  if (!n) return;
  const cx = (left + right) / 2 * 800;
  const cy = depth * 90 + 50;
  n.x = cx; n.y = cy;
  nodes.push(n);
  if (n.left) {
    avlLayout(n.left, depth + 1, left, (left + right) / 2, nodes, edges);
    edges.push([cx, cy, n.left.x!, n.left.y!]);
  }
  if (n.right) {
    avlLayout(n.right, depth + 1, (left + right) / 2, right, nodes, edges);
    edges.push([cx, cy, n.right.x!, n.right.y!]);
  }
}

function AVLViz({ root }: { root: AVLNode | null }) {
  const nodes: AVLNode[] = [], edges: [number,number,number,number][] = [];
  if (root) avlLayout(root, 0, 0, 1, nodes, edges);
  const h = Math.max(250, (nodes.length > 0 ? Math.max(...nodes.map(n => n.y!)) + 80 : 250));

  return (
    <svg width="100%" viewBox={`0 0 800 ${h}`} className="w-full">
      {edges.map(([x1,y1,x2,y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#334155" strokeWidth="2" />
      ))}
      {nodes.map(n => {
        const bf = n.bf;
        const ring = Math.abs(bf) > 1 ? '#ef4444' : Math.abs(bf) === 1 ? '#f59e0b' : '#10b981';
        const fill = n.fresh ? '#1e3a5f' : '#0f172a';
        return (
          <g key={n.id} className="transition-all duration-500" style={{ transform: `translate(0,0)` }}>
            {n.fresh && (
              <circle cx={n.x} cy={n.y} r={28} fill={ring} opacity={0.15}>
                <animate attributeName="r" from="20" to="28" dur="0.4s" fill="freeze" />
                <animate attributeName="opacity" from="0" to="0.15" dur="0.4s" fill="freeze" />
              </circle>
            )}
            <circle cx={n.x} cy={n.y} r={22} fill={fill} stroke={ring} strokeWidth={n.rotated ? 3.5 : 2} className="transition-all duration-300">
              {n.fresh && <animate attributeName="r" from="0" to="22" dur="0.35s" fill="freeze" />}
            </circle>
            <text x={n.x} y={n.y! + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="monospace">
              {n.val}
            </text>
            <text x={n.x! + 24} y={n.y! - 16} textAnchor="middle" fontSize="10" fill={ring} fontFamily="monospace" fontWeight="bold">
              bf={bf}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function AVLSection() {
  const [root, setRoot] = useState<AVLNode | null>(null);
  const [input, setInput] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const [lastOp, setLastOp] = useState('');

  const insert = () => {
    const v = parseInt(input); if (isNaN(v)) return;
    const newLog: string[] = [];
    const { node, type } = avlInsert(root, v, newLog);
    // Clear fresh flags
    function clearFresh(n: AVLNode | null) { if (!n) return; n.fresh = false; n.rotated = false; clearFresh(n.left); clearFresh(n.right); }
    if (root) clearFresh(root);
    setRoot({ ...node });
    setLog(prev => [...prev, newLog.length > 0 ? newLog.join(' → ') : `Inserted ${v} (balanced)`]);
    setLastOp(type ? `${type} Rotation performed at node` : `Inserted ${v} — tree balanced ✓`);
    setInput('');
  };

  const ROTATION_TYPES = [
    { t: 'LL', d: 'Left-Left: node and left child both left-heavy → single right rotation', color: 'text-blue-400' },
    { t: 'RR', d: 'Right-Right: node and right child both right-heavy → single left rotation', color: 'text-purple-400' },
    { t: 'LR', d: 'Left-Right: node left-heavy, left child right-heavy → left-rot child, then right-rot node', color: 'text-amber-400' },
    { t: 'RL', d: 'Right-Left: node right-heavy, right child left-heavy → right-rot child, then left-rot node', color: 'text-emerald-400' },
  ];

  const presets = [10, 20, 30, 15, 25, 5, 35, 7, 12];

  return (
    <div className="flex flex-col gap-4">
      {/* Properties */}
      <div className="grid grid-cols-3 gap-3 text-[11px]">
        {[
          { t: 'Time Complexity', v: 'O(log n)', c: 'text-emerald-400', d: 'Insert, Delete, Search — all O(log n) always' },
          { t: 'Balance Factor', v: 'bf = h(L) - h(R)', c: 'text-amber-400', d: 'Every node: |bf| ≤ 1. Rotation restores balance.' },
          { t: 'Height', v: 'h ≤ 1.44 log n', c: 'text-blue-400', d: 'AVL is tighter than BST (which can reach O(n))' },
        ].map((c, i) => (
          <div key={i} className="bg-black/30 border border-white/8 rounded-xl p-3">
            <div className="text-slate-500 mb-1">{c.t}</div>
            <div className={`font-mono font-bold ${c.c} mb-1`}>{c.v}</div>
            <div className="text-slate-500 leading-relaxed">{c.d}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && insert()}
          placeholder="Enter value…" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50 font-mono min-w-0 max-w-36" />
        <button onClick={insert} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600/30 border border-blue-500/30 rounded-lg text-sm text-blue-300 hover:bg-blue-600/40 font-semibold">
          <Plus size={15} /> Insert
        </button>
        <button onClick={() => {
          const arr = [...presets];
          let r: AVLNode | null = null;
          const l: string[] = [];
          arr.forEach(v => { const res = avlInsert(r, v, l); r = res.node; });
          setRoot({ ...r! }); setLog(['Preset loaded: ' + arr.join(', ')]);
        }} className="px-3 py-2 bg-purple-600/20 border border-purple-500/20 rounded-lg text-xs text-purple-300 hover:bg-purple-600/30">
          Load Preset
        </button>
        <button onClick={() => { _avlId = 0; setRoot(null); setLog([]); setLastOp(''); }}
          className="px-3 py-2 bg-red-600/15 border border-red-500/20 rounded-lg text-xs text-red-400 hover:bg-red-600/25">
          <Trash2 size={14} />
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-3 text-[10px]">
        {[['#10b981', 'Balanced (bf=0)'], ['#f59e0b', 'Slightly off (|bf|=1)'], ['#ef4444', '|bf|>1 — needs rotation']].map(([c, l]) => (
          <span key={l} className="flex items-center gap-1.5 text-slate-400"><span className="w-3 h-3 rounded-full inline-block" style={{ background: c as string }} />{l}</span>
        ))}
      </div>

      {lastOp && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2 text-xs text-blue-300 font-mono">{lastOp}</div>
      )}

      {/* Tree Canvas */}
      <div className="bg-black/40 border border-white/8 rounded-2xl overflow-hidden" style={{ minHeight: 260 }}>
        {!root ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-600 text-sm gap-2">
            <span className="text-3xl">🌳</span>
            Insert values or click "Load Preset" to start
          </div>
        ) : <AVLViz root={root} />}
      </div>

      {/* Rotation types */}
      <div className="grid grid-cols-2 gap-2">
        {ROTATION_TYPES.map((r, i) => (
          <div key={i} className="bg-black/30 border border-white/5 rounded-xl p-3 text-[11px]">
            <span className={`font-mono font-black text-sm ${r.color} mr-2`}>{r.t}</span>
            <span className="text-slate-400">{r.d}</span>
          </div>
        ))}
      </div>

      {/* Log */}
      {log.length > 0 && (
        <div className="bg-black/30 border border-white/5 rounded-xl p-3 max-h-32 overflow-y-auto">
          <div className="text-[10px] uppercase text-slate-600 mb-2">Operation Log</div>
          {log.slice(-8).reverse().map((l, i) => (
            <div key={i} className="text-[11px] font-mono text-slate-400 py-0.5 border-b border-white/5">{l}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. B-TREE (order 3: max 2 keys, max 3 children)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface BNode {
  keys: number[]; children: BNode[]; leaf: boolean;
  id: number; fresh?: boolean;
  x?: number; y?: number; w?: number;
}

let _bid = 0;
const ORDER = 3; // min degree t=2, max keys = 3
function bNew(leaf = true): BNode { return { keys: [], children: [], leaf, id: ++_bid }; }

function bSplitChild(parent: BNode, i: number, full: BNode) {
  const t = Math.ceil(ORDER / 2);
  const newNode = bNew(full.leaf);
  newNode.keys = full.keys.splice(t, full.keys.length - t);
  if (!full.leaf) newNode.children = full.children.splice(t, full.children.length - t);
  const mid = full.keys.pop()!;
  parent.keys.splice(i, 0, mid);
  parent.children.splice(i + 1, 0, newNode);
  newNode.fresh = true;
}

function bInsertNonFull(n: BNode, v: number) {
  if (n.leaf) { let i = n.keys.length - 1; while (i >= 0 && v < n.keys[i]) i--; n.keys.splice(i + 1, 0, v); n.fresh = true; return; }
  let i = n.keys.length - 1; while (i >= 0 && v < n.keys[i]) i--; i++;
  if (n.children[i].keys.length === ORDER) { bSplitChild(n, i, n.children[i]); if (v > n.keys[i]) i++; }
  bInsertNonFull(n.children[i], v);
}

function bInsert(root: BNode, v: number): { root: BNode; splitMsg: string } {
  let splitMsg = '';
  if (root.keys.length === ORDER) {
    const newRoot = bNew(false); newRoot.children = [root];
    bSplitChild(newRoot, 0, root);
    bInsertNonFull(newRoot, v);
    splitMsg = `Root split! Key promoted: ${newRoot.keys[0]}`;
    return { root: newRoot, splitMsg };
  }
  bInsertNonFull(root, v);
  return { root, splitMsg };
}

function BTreeViz({ root }: { root: BNode }) {
  const nodes: BNode[] = [], edges: [number,number,number,number][] = [];
  function layout(n: BNode, depth: number, left: number, right: number) {
    const cx = (left + right) / 2 * 780 + 10;
    const cy = depth * 100 + 45;
    const w = Math.max(60, n.keys.length * 34 + 20);
    n.x = cx; n.y = cy; n.w = w;
    nodes.push(n);
    if (!n.leaf && n.children.length > 0) {
      const span = (right - left) / n.children.length;
      n.children.forEach((c, i) => {
        layout(c, depth + 1, left + span * i, left + span * (i + 1));
        edges.push([cx, cy + 18, c.x!, c.y! - 18]);
      });
    }
  }
  layout(root, 0, 0, 1);
  const maxY = Math.max(200, ...nodes.map(n => n.y! + 60));

  return (
    <svg width="100%" viewBox={`0 0 800 ${maxY}`} className="w-full">
      {edges.map(([x1,y1,x2,y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#334155" strokeWidth="1.5" />
      ))}
      {nodes.map(n => {
        const w = n.w!;
        return (
          <g key={n.id}>
            {n.fresh && <rect x={n.x! - w / 2 - 4} y={n.y! - 22} width={w + 8} height={44} rx={8} fill="#1d4ed8" opacity="0.15">
              <animate attributeName="opacity" from="0" to="0.15" dur="0.4s" fill="freeze" />
            </rect>}
            <rect x={n.x! - w / 2} y={n.y! - 18} width={w} height={36} rx={6}
              fill={n.fresh ? '#0f2744' : '#0a1628'} stroke={n.fresh ? '#3b82f6' : '#334155'} strokeWidth={n.fresh ? 2 : 1.5} />
            {n.keys.map((k, ki) => {
              const kx = n.x! - w / 2 + 17 + ki * 34;
              return (
                <g key={ki}>
                  {ki < n.keys.length - 1 && <line x1={kx + 17} y1={n.y! - 18} x2={kx + 17} y2={n.y! + 18} stroke="#334155" strokeWidth="1" />}
                  <text x={kx} y={n.y! + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="monospace">{k}</text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

function BTreeSection() {
  const [root, setRoot] = useState<BNode>(() => bNew(true));
  const [input, setInput] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const [splitMsg, setSplitMsg] = useState('');

  const insert = () => {
    const v = parseInt(input); if (isNaN(v)) return;
    function clearFresh(n: BNode) { n.fresh = false; n.children.forEach(clearFresh); }
    clearFresh(root);
    const res = bInsert(root, v);
    setRoot({ ...res.root });
    setSplitMsg(res.splitMsg);
    setLog(prev => [...prev, res.splitMsg ? `Insert ${v} → ${res.splitMsg}` : `Insert ${v} (no split)`]);
    setInput('');
  };

  const presets = [10, 20, 5, 30, 15, 25, 40, 35, 3, 7, 22, 28];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3 text-[11px]">
        {[
          { t: 'Order', v: 'Order 3 (t=2)', c: 'text-amber-400', d: 'Max 2 keys, max 3 children per node. Min degree t=2.' },
          { t: 'Complexity', v: 'O(log n)', c: 'text-emerald-400', d: 'Height = O(logₜ n). Disk-friendly — minimizes I/O.' },
          { t: 'Key Use Case', v: 'Databases, FS', c: 'text-blue-400', d: 'PostgreSQL, MySQL index pages. Fits in disk blocks.' },
        ].map((c, i) => (
          <div key={i} className="bg-black/30 border border-white/8 rounded-xl p-3">
            <div className="text-slate-500 mb-1">{c.t}</div>
            <div className={`font-mono font-bold ${c.c} mb-1`}>{c.v}</div>
            <div className="text-slate-500 leading-relaxed">{c.d}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && insert()}
          placeholder="Enter value…" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500/50 font-mono min-w-0 max-w-36" />
        <button onClick={insert} className="flex items-center gap-1.5 px-4 py-2 bg-amber-600/30 border border-amber-500/30 rounded-lg text-sm text-amber-300 hover:bg-amber-600/40 font-semibold">
          <Plus size={15} /> Insert
        </button>
        <button onClick={() => {
          _bid = 0; let r = bNew(true);
          presets.forEach(v => { const res = bInsert(r, v); r = res.node ?? res.root; });
          setRoot({ ...r }); setLog(['Preset loaded: ' + presets.join(', ')]);
        }} className="px-3 py-2 bg-purple-600/20 border border-purple-500/20 rounded-lg text-xs text-purple-300">
          Load Preset
        </button>
        <button onClick={() => { _bid = 0; setRoot(bNew(true)); setLog([]); setSplitMsg(''); }}
          className="px-3 py-2 bg-red-600/15 border border-red-500/20 rounded-lg text-xs text-red-400">
          <Trash2 size={14} />
        </button>
      </div>

      {splitMsg && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2 text-xs text-amber-300 font-mono">
          ✂️ {splitMsg}
        </div>
      )}

      <div className="bg-black/40 border border-white/8 rounded-2xl overflow-hidden" style={{ minHeight: 200 }}>
        <BTreeViz root={root} />
      </div>

      {/* B-tree rules */}
      <div className="bg-black/30 border border-white/8 rounded-xl p-4 text-[11px]">
        <div className="text-[10px] uppercase text-slate-500 mb-3">B-Tree Rules (Order 3)</div>
        <div className="grid md:grid-cols-2 gap-2">
          {[
            '1. Leaf nodes hold keys — internal nodes hold separator keys and child pointers',
            '2. Each node: at most ORDER−1 = 2 keys, at least ⌈ORDER/2⌉−1 = 1 key (except root)',
            '3. All leaves are at the same depth (perfectly balanced height)',
            '4. When a node overflows (3 keys), the middle key is promoted and node splits',
            '5. Root may have 1 key (and 2 children) to up to ORDER−1 keys',
            '6. Every non-leaf with k keys has exactly k+1 children',
          ].map((r, i) => (
            <div key={i} className="flex gap-2 text-slate-400"><span className="text-amber-500 shrink-0">•</span>{r}</div>
          ))}
        </div>
      </div>

      {log.length > 0 && (
        <div className="bg-black/30 border border-white/5 rounded-xl p-3 max-h-28 overflow-y-auto">
          {log.slice(-6).reverse().map((l, i) => (
            <div key={i} className="text-[11px] font-mono text-slate-400 py-0.5">{l}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. RED-BLACK TREE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type RBColor = 'RED' | 'BLACK';
interface RBNode {
  val: number; color: RBColor; left: RBNode | null; right: RBNode | null; parent: RBNode | null;
  id: number; fresh?: boolean;
  x?: number; y?: number;
}

let _rbId = 0;
class RBTree {
  root: RBNode | null = null;
  NIL: RBNode = { val: 0, color: 'BLACK', left: null, right: null, parent: null, id: 0 };

  newNode(v: number): RBNode {
    return { val: v, color: 'RED', left: this.NIL, right: this.NIL, parent: this.NIL, id: ++_rbId, fresh: true };
  }

  rotLeft(x: RBNode) {
    const y = x.right!; x.right = y.left;
    if (y.left !== this.NIL) y.left.parent = x;
    y.parent = x.parent;
    if (x.parent === this.NIL) this.root = y;
    else if (x === x.parent.left) x.parent.left = y;
    else x.parent.right = y;
    y.left = x; x.parent = y;
  }
  rotRight(y: RBNode) {
    const x = y.left!; y.left = x.right;
    if (x.right !== this.NIL) x.right.parent = y;
    x.parent = y.parent;
    if (y.parent === this.NIL) this.root = x;
    else if (y === y.parent.right) y.parent.right = x;
    else y.parent.left = x;
    x.right = y; y.parent = x;
  }

  fixInsert(z: RBNode) {
    while (z.parent.color === 'RED') {
      if (z.parent === z.parent.parent.left) {
        const y = z.parent.parent.right;
        if (y?.color === 'RED') {
          z.parent.color = 'BLACK'; y.color = 'BLACK';
          z.parent.parent.color = 'RED'; z = z.parent.parent;
        } else {
          if (z === z.parent.right) { z = z.parent; this.rotLeft(z); }
          z.parent.color = 'BLACK'; z.parent.parent.color = 'RED'; this.rotRight(z.parent.parent);
        }
      } else {
        const y = z.parent.parent.left;
        if (y?.color === 'RED') {
          z.parent.color = 'BLACK'; y.color = 'BLACK';
          z.parent.parent.color = 'RED'; z = z.parent.parent;
        } else {
          if (z === z.parent.left) { z = z.parent; this.rotRight(z); }
          z.parent.color = 'BLACK'; z.parent.parent.color = 'RED'; this.rotLeft(z.parent.parent);
        }
      }
    }
    this.root!.color = 'BLACK';
  }

  insert(v: number): string {
    const z = this.newNode(v);
    let y = this.NIL, x = this.root ?? this.NIL;
    while (x !== this.NIL && x !== null) { y = x; x = v < x.val ? x.left! : x.right!; }
    z.parent = y;
    if (y === this.NIL) this.root = z;
    else if (v < y.val) y.left = z;
    else y.right = z;
    this.fixInsert(z);
    return '';
  }
}

function rbLayout(n: RBNode | null, NIL: RBNode, depth = 0, left = 0, right = 1, nodes: RBNode[] = [], edges: [number,number,number,number,string][] = []) {
  if (!n || n === NIL) return;
  const cx = (left + right) / 2 * 800;
  const cy = depth * 85 + 50;
  n.x = cx; n.y = cy;
  nodes.push(n);
  if (n.left && n.left !== NIL) {
    rbLayout(n.left, NIL, depth + 1, left, (left + right) / 2, nodes, edges);
    edges.push([cx, cy, n.left.x!, n.left.y!, n.left.color]);
  }
  if (n.right && n.right !== NIL) {
    rbLayout(n.right, NIL, depth + 1, (left + right) / 2, right, nodes, edges);
    edges.push([cx, cy, n.right.x!, n.right.y!, n.right.color]);
  }
}

function RBViz({ root, NIL }: { root: RBNode | null; NIL: RBNode }) {
  const nodes: RBNode[] = [], edges: [number,number,number,number,string][] = [];
  if (root) rbLayout(root, NIL, 0, 0, 1, nodes, edges);
  const h = Math.max(250, (nodes.length > 0 ? Math.max(...nodes.map(n => n.y!)) + 80 : 250));

  return (
    <svg width="100%" viewBox={`0 0 800 ${h}`} className="w-full">
      {edges.map(([x1,y1,x2,y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#334155" strokeWidth="2" />
      ))}
      {nodes.map(n => {
        const isRed = n.color === 'RED';
        const fill = isRed ? '#7f1d1d' : '#1e293b';
        const stroke = isRed ? '#ef4444' : '#64748b';
        const glow = isRed ? '0 0 12px rgba(239,68,68,0.5)' : '0 0 6px rgba(100,116,139,0.2)';
        return (
          <g key={n.id}>
            {n.fresh && (
              <circle cx={n.x} cy={n.y} r={30} fill={stroke} opacity={0.1}>
                <animate attributeName="r" from="14" to="30" dur="0.4s" fill="freeze" />
                <animate attributeName="opacity" from="0.3" to="0.1" dur="0.4s" fill="freeze" />
              </circle>
            )}
            <circle cx={n.x} cy={n.y} r={22} fill={fill} stroke={stroke} strokeWidth={isRed ? 2.5 : 1.5}>
              {n.fresh && <animate attributeName="r" from="0" to="22" dur="0.35s" fill="freeze" />}
            </circle>
            <text x={n.x} y={n.y! + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="monospace">
              {n.val}
            </text>
            <text x={n.x! + 25} y={n.y! - 16} fontSize="9" fill={stroke} fontFamily="monospace">
              {n.color === 'RED' ? 'R' : 'B'}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function RBSection() {
  const treeRef = useRef(new RBTree());
  const [snapshot, setSnapshot] = useState<{ root: RBNode | null; NIL: RBNode }>({ root: null, NIL: treeRef.current.NIL });
  const [input, setInput] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const [lastOp, setLastOp] = useState('');

  const insert = () => {
    const v = parseInt(input); if (isNaN(v)) return;
    treeRef.current.insert(v);
    setSnapshot({ root: treeRef.current.root, NIL: treeRef.current.NIL });
    setLog(prev => [...prev, `Inserted ${v}`]);
    setLastOp(`Inserted ${v} → Root is always BLACK`);
    setInput('');
  };

  const presets = [20, 10, 30, 5, 15, 25, 35, 3, 7, 40];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 text-[11px]">
        {[
          { t: '5 RB Properties', v: '', c: 'text-red-400', items: ['Every node is RED or BLACK', 'Root is always BLACK', 'Every leaf (NIL) is BLACK', 'RED node → both children are BLACK', 'All paths from node to leaves: same BLACK count'] },
          { t: 'vs AVL Tree', v: '', c: 'text-amber-400', items: ['AVL: stricter balance (height diff ≤ 1)', 'RB: height ≤ 2·log(n+1) — slightly looser', 'AVL: faster search (lower height)', 'RB: faster insert/delete (fewer rotations)', 'RB used in: Linux kernel, Java TreeMap, C++ map'] },
        ].map((c, i) => (
          <div key={i} className="bg-black/30 border border-white/8 rounded-xl p-3">
            <div className={`font-bold ${c.c} mb-2 text-xs`}>{c.t}</div>
            {c.items.map((item, j) => (
              <div key={j} className="flex gap-2 text-slate-400 py-0.5">
                <span className={c.color}>{j + 1}.</span>{item}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && insert()}
          placeholder="Enter value…" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-red-500/50 font-mono min-w-0 max-w-36" />
        <button onClick={insert} className="flex items-center gap-1.5 px-4 py-2 bg-red-600/30 border border-red-500/30 rounded-lg text-sm text-red-300 hover:bg-red-600/40 font-semibold">
          <Plus size={15} /> Insert
        </button>
        <button onClick={() => {
          _rbId = 0; treeRef.current = new RBTree();
          presets.forEach(v => treeRef.current.insert(v));
          setSnapshot({ root: treeRef.current.root, NIL: treeRef.current.NIL });
          setLog(['Preset loaded: ' + presets.join(', ')]);
        }} className="px-3 py-2 bg-purple-600/20 border border-purple-500/20 rounded-lg text-xs text-purple-300">
          Load Preset
        </button>
        <button onClick={() => { _rbId = 0; treeRef.current = new RBTree(); setSnapshot({ root: null, NIL: treeRef.current.NIL }); setLog([]); setLastOp(''); }}
          className="px-3 py-2 bg-red-600/15 border border-red-500/20 rounded-lg text-xs text-red-400">
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex gap-3 text-[10px]">
        {[['#ef4444', 'RED node'], ['#64748b', 'BLACK node'], ['○', 'NIL (implicit BLACK leaves)']].map(([c, l], i) => (
          <span key={i} className="flex items-center gap-1.5 text-slate-400">
            {typeof c === 'string' && c !== '○' ? <span className="w-3 h-3 rounded-full inline-block" style={{ background: c }} /> : <span className="text-slate-500 text-xs">○</span>}
            {l}
          </span>
        ))}
      </div>

      {lastOp && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 text-xs text-red-300 font-mono">{lastOp}</div>}

      <div className="bg-black/40 border border-white/8 rounded-2xl overflow-hidden" style={{ minHeight: 260 }}>
        {!snapshot.root ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-600 text-sm gap-2">
            <span className="text-3xl">🌲</span>
            Insert values or click "Load Preset"
          </div>
        ) : <RBViz root={snapshot.root} NIL={snapshot.NIL} />}
      </div>

      <div className="bg-black/30 border border-white/8 rounded-xl p-4 text-[11px]">
        <div className="text-[10px] uppercase text-slate-500 mb-2">How Fix-Insert Works</div>
        <div className="space-y-1.5 text-slate-400">
          <div>🔴 <span className="text-white">Case 1 - Uncle is RED:</span> Recolor parent + uncle → BLACK, grandparent → RED. Move up.</div>
          <div>🔄 <span className="text-white">Case 2 - Uncle is BLACK, node is inner child:</span> Rotate parent toward uncle. Fall into Case 3.</div>
          <div>🔄 <span className="text-white">Case 3 - Uncle is BLACK, node is outer child:</span> Recolor parent ↔ grandparent colors, rotate grandparent. Done.</div>
        </div>
      </div>

      {log.length > 0 && (
        <div className="bg-black/30 border border-white/5 rounded-xl p-3 max-h-28 overflow-y-auto">
          {log.slice(-6).reverse().map((l, i) => (
            <div key={i} className="text-[11px] font-mono text-slate-400 py-0.5">{l}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const TREES = [
  { id: 'avl', label: 'AVL Tree', emoji: '⚖️', color: 'border-blue-500/40 bg-blue-500/10 text-blue-300', desc: 'Height-balanced BST with balance factors. O(log n) guaranteed.' },
  { id: 'btree', label: 'B-Tree', emoji: '🗄️', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300', desc: 'Multi-key disk-friendly tree. Used in databases & filesystems.' },
  { id: 'rbtree', label: 'Red-Black Tree', emoji: '🔴', color: 'border-red-500/40 bg-red-500/10 text-red-300', desc: 'Color-balanced BST. Fewer rotations than AVL. Used in Linux/Java.' },
];

export function TreesLab() {
  const [active, setActive] = useState('avl');
  const tree = TREES.find(t => t.id === active)!;

  return (
    <div className="flex flex-col gap-0">
      {/* Hero */}
      <div className="relative px-8 pt-6 pb-5 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/15 via-emerald-900/10 to-transparent" />
        <div className="relative">
          <div className="text-[11px] uppercase tracking-widest text-emerald-400 font-semibold mb-1">DAA — Advanced Data Structures</div>
          <h1 className="text-2xl font-black text-white mb-1">
            Balanced <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Tree Visualizer</span>
          </h1>
          <p className="text-slate-400 text-sm">Insert values one by one and watch the tree rebalance with smooth animations. See every rotation, split, and recolor in real time.</p>
        </div>
      </div>

      {/* Tree Selector */}
      <div className="flex gap-2 p-4 border-b border-white/5 flex-wrap">
        {TREES.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all ${active === t.id ? t.color + ' scale-[1.02]' : 'border-white/5 text-slate-400 hover:border-white/15 hover:text-white'}`}>
            <span className="text-lg">{t.emoji}</span>
            <div className="text-left">
              <div>{t.label}</div>
              {active === t.id && <div className="text-[10px] font-normal opacity-70">{t.desc}</div>}
            </div>
          </button>
        ))}
      </div>

      <div className="p-6 max-w-5xl">
        {active === 'avl' && <AVLSection />}
        {active === 'btree' && <BTreeSection />}
        {active === 'rbtree' && <RBSection />}
      </div>
    </div>
  );
}
