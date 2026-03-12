// @ts-nocheck
"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Text } from '@react-three/drei';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { useMounted } from '@/hooks/useMounted';
import {
  buildCircularGraph, getBFSEvents, getDFSEvents,
  GraphNode, GraphEdge, GraphEvent
} from '@/algorithms/graph/graphAlgorithms';
import * as THREE from 'three';

type NodeState = 'idle' | 'visiting' | 'done' | 'queued';

const NODE_COLORS: Record<NodeState, string> = {
  idle:     '#1e3a5f',
  queued:   '#7c3aed',
  visiting: '#f59e0b',
  done:     '#10b981',
};
const NODE_EMISSIVE: Record<NodeState, string> = {
  idle: '#000', queued: '#3b1f6e', visiting: '#78350f', done: '#064e3b',
};

function GraphNodeMesh({ node, state, order }: { node: GraphNode; state: NodeState; order: number | null }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const tc = new THREE.Color(NODE_COLORS[state]);
  const te = new THREE.Color(NODE_EMISSIVE[state]);

  useFrame((_, d) => {
    if (!meshRef.current || !matRef.current) return;
    matRef.current.color.lerp(tc, d * 10);
    matRef.current.emissive.lerp(te, d * 10);
    const ts = state === 'visiting' ? 1.4 : state === 'queued' ? 1.15 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(ts, ts, ts), d * 10);
  });

  // Hub nodes (id < 4) are larger
  const isHub = node.id < 4;
  const r = isHub ? 0.62 : 0.48;

  return (
    <group position={[node.x, node.y, 0]}>
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[r, 24, 24]} />
        <meshStandardMaterial
          ref={matRef}
          color={NODE_COLORS[state]}
          emissive={NODE_EMISSIVE[state]}
          emissiveIntensity={state === 'visiting' ? 0.9 : state === 'queued' ? 0.5 : state === 'done' ? 0.3 : 0.05}
          metalness={0.6} roughness={0.3}
        />
      </mesh>
      <Text position={[0, 0, r + 0.12]} fontSize={isHub ? 0.42 : 0.33} color="white" anchorX="center" anchorY="middle" renderOrder={10}>
        {String(node.id)}
      </Text>
      {order !== null && (
        <Text position={[r + 0.15, r + 0.15, 0.2]} fontSize={0.26} color="#f59e0b" anchorX="center" anchorY="middle" renderOrder={11}>
          #{order}
        </Text>
      )}
    </group>
  );
}

function GraphEdgeLine({ from, to, active, isHubEdge }: { from: GraphNode; to: GraphNode; active: boolean; isHubEdge: boolean }) {
  return (
    <Line
      points={[new THREE.Vector3(from.x, from.y, 0), new THREE.Vector3(to.x, to.y, 0)]}
      color={active ? '#f59e0b' : isHubEdge ? '#3b4e6e' : '#1e3a5f'}
      lineWidth={active ? 3.5 : isHubEdge ? 1.5 : 1}
    />
  );
}

const GRAPH_DATA = buildCircularGraph(16);

export function GraphCanvas() {
  const mounted = useMounted();
  const {
    playbackState, setPlaybackState, activeGraphAlgorithm, animationSpeed,
    incrementComparisons, resetStats, setElapsedMs,
    setCallStack, setQueueState
  } = useAlgorithmStore();

  const [nodeStates, setNodeStates] = useState<Record<number, NodeState>>({});
  const [activeEdges, setActiveEdges] = useState<Set<string>>(new Set());
  const [visitOrder, setVisitOrder] = useState<Record<number, number>>({});
  const [traversalOrder, setTraversalOrder] = useState<number[]>([]);

  const eventsRef = useRef<GraphEvent[]>([]);
  const idxRef = useRef(0);
  const animatingRef = useRef(false);
  const startRef = useRef(0);
  const callStackRef = useRef<number[]>([]);
  const visitCountRef = useRef(0);

  const resetVisuals = useCallback(() => {
    setNodeStates({});
    setActiveEdges(new Set());
    setVisitOrder({});
    setTraversalOrder([]);
    eventsRef.current = [];
    idxRef.current = 0;
    visitCountRef.current = 0;
    animatingRef.current = false;
    callStackRef.current = [];
    setCallStack([]);
    setQueueState([]);
    resetStats();
  }, [resetStats, setCallStack, setQueueState]);

  useEffect(() => {
    if (playbackState === 'playing') {
      if (eventsRef.current.length === 0) {
        const fn = activeGraphAlgorithm === 'dfs' ? getDFSEvents : getBFSEvents;
        eventsRef.current = fn(GRAPH_DATA.adj, 0);
        startRef.current = performance.now();
      }
      animatingRef.current = true;
    } else if (playbackState === 'idle') {
      animatingRef.current = false;
      resetVisuals();
    } else if (playbackState === 'paused') {
      animatingRef.current = false;
    }
  }, [playbackState, activeGraphAlgorithm, resetVisuals]);

  useEffect(() => {
    if (!animatingRef.current) return;
    const delay = Math.max(100, 1000 / animationSpeed);

    const interval = setInterval(() => {
      if (!animatingRef.current || idxRef.current >= eventsRef.current.length) {
        clearInterval(interval);
        animatingRef.current = false;
        setElapsedMs(performance.now() - startRef.current);
        setPlaybackState('completed');
        return;
      }
      const event = eventsRef.current[idxRef.current++];

      if (event.type === 'visit') {
        const order = visitCountRef.current++;
        setNodeStates(prev => ({ ...prev, [event.node]: 'visiting' }));
        setVisitOrder(prev => ({ ...prev, [event.node]: order }));
        setTraversalOrder(prev => [...prev, event.node]);
        incrementComparisons();
      } else if (event.type === 'explore') {
        setActiveEdges(prev => new Set([...prev, `${event.from}-${event.to}`]));
        setNodeStates(prev => {
          const n = { ...prev };
          if (n[event.to] !== 'visiting' && n[event.to] !== 'done') n[event.to] = 'queued';
          return n;
        });
      } else if (event.type === 'markDone') {
        setNodeStates(prev => ({ ...prev, [event.node]: 'done' }));
      } else if (event.type === 'callPush') {
        callStackRef.current = [...callStackRef.current, event.node];
        setCallStack([...callStackRef.current]);
      } else if (event.type === 'callPop') {
        callStackRef.current = callStackRef.current.slice(0, -1);
        setCallStack([...callStackRef.current]);
      } else if (event.type === 'queueUpdate') {
        setQueueState([...event.queue]);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [playbackState, animationSpeed, setPlaybackState, setElapsedMs, incrementComparisons, setCallStack, setQueueState]);

  if (!mounted) return <div className="w-full h-full bg-[#020617]" />;

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 18], fov: 55 }}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 10]} intensity={1.5} castShadow />
        <pointLight position={[-8, -6, 5]} color="#7c3aed" intensity={0.6} />
        <pointLight position={[6, -6, 4]} color="#0ea5e9" intensity={0.4} />

        {GRAPH_DATA.edges.map((e, i) => (
          <GraphEdgeLine
            key={i}
            from={GRAPH_DATA.nodes[e.from]}
            to={GRAPH_DATA.nodes[e.to]}
            active={activeEdges.has(`${e.from}-${e.to}`) || activeEdges.has(`${e.to}-${e.from}`)}
            isHubEdge={e.from < 4 && e.to < 4}
          />
        ))}

        {GRAPH_DATA.nodes.map(node => (
          <GraphNodeMesh
            key={node.id}
            node={node}
            state={nodeStates[node.id] ?? 'idle'}
            order={visitOrder[node.id] ?? null}
          />
        ))}

        <OrbitControls enablePan maxDistance={30} minDistance={8} />
      </Canvas>

      {/* Traversal order ribbon */}
      {traversalOrder.length > 0 && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 flex-wrap justify-center bg-black/70 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-sm max-w-[80%]">
          <span className="text-[10px] text-slate-500 mr-1 uppercase tracking-wider">{activeGraphAlgorithm.toUpperCase()} →</span>
          {traversalOrder.map((n, i) => (
            <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold"
              style={{ background: i === traversalOrder.length - 1 ? '#f59e0b' : NODE_COLORS.done, color: 'white', opacity: 0.3 + (i / traversalOrder.length) * 0.7 }}>
              {n}
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 text-xs flex-wrap justify-center">
        {([['idle', 'Unvisited'], ['queued', 'In Queue'], ['visiting', 'Processing'], ['done', 'Done']] as [NodeState, string][]).map(([s, l]) => (
          <div key={s} className="flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-full border border-white/5">
            <div className="w-2 h-2 rounded-full" style={{ background: NODE_COLORS[s] }} />
            <span className="text-slate-300">{l}</span>
          </div>
        ))}
      </div>

      {/* Info badge */}
      <div className="absolute top-3 left-3 text-xs bg-black/60 px-3 py-2 rounded-lg border border-white/10">
        <span className="text-slate-500">Start: </span><span className="text-amber-400 font-mono font-bold">Node 0</span>
        <span className="text-slate-500 ml-2">·</span>
        <span className="text-slate-500 ml-2">Nodes: </span><span className="text-white font-mono">16</span>
        <span className="text-slate-500 ml-2">·</span>
        <span className="text-slate-500 ml-2">Hubs: </span><span className="text-purple-400 font-mono">4</span>
      </div>
    </div>
  );
}
