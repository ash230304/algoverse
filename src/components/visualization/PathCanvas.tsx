// @ts-nocheck
"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { useMounted } from '@/hooks/useMounted';
import { buildGrid, getDijkstraEvents, getAStarEvents, GridNode, PathEvent } from '@/algorithms/pathfinding/pathAlgorithms';

const GRID_ROWS = 15;
const GRID_COLS = 20;
const TILE_SIZE = 0.85;

type TileState = 'idle' | 'wall' | 'start' | 'end' | 'explored' | 'path';

const TILE_COLORS: Record<TileState, string> = {
  idle: '#1e293b',
  wall: '#0f172a',
  start: '#10b981',
  end: '#ef4444',
  explored: '#1d4ed8',
  path: '#f59e0b',
};

function GridTile({ row, col, state }: { row: number; col: number; state: TileState }) {
  const x = (col - GRID_COLS / 2) * TILE_SIZE;
  const y = (GRID_ROWS / 2 - row) * TILE_SIZE;
  const isWall = state === 'wall';
  const color = TILE_COLORS[state];

  return (
    <mesh position={[x, y, isWall ? 0.3 : 0]}>
      <boxGeometry args={[TILE_SIZE * 0.92, TILE_SIZE * 0.92, isWall ? 0.6 : 0.1]} />
      <meshStandardMaterial
        color={color}
        emissive={state === 'path' ? '#78350f' : state === 'explored' ? '#1e3a8a' : '#000'}
        emissiveIntensity={state === 'path' ? 0.6 : state === 'explored' ? 0.3 : 0}
        roughness={0.3}
        metalness={0.5}
      />
    </mesh>
  );
}

export function PathCanvas() {
  const mounted = useMounted();
  const { playbackState, setPlaybackState, activePathAlgorithm, animationSpeed } = useAlgorithmStore();

  const [tileStates, setTileStates] = useState<TileState[]>([]);
  const gridRef = useRef<GridNode[]>([]);

  const regenerate = useCallback(() => {
    const { grid } = buildGrid(GRID_ROWS, GRID_COLS);
    gridRef.current = grid;
    const states: TileState[] = grid.map(n =>
      n.isStart ? 'start' : n.isEnd ? 'end' : n.isWall ? 'wall' : 'idle'
    );
    setTileStates(states);
  }, []);

  useEffect(() => { regenerate(); }, [regenerate]);

  useEffect(() => {
    if (playbackState === 'idle') {
      regenerate();
      return;
    }
    if (playbackState !== 'playing') return;

    const grid = gridRef.current;
    const start = grid.findIndex(n => n.isStart);
    const end = grid.findIndex(n => n.isEnd);
    const fn = activePathAlgorithm === 'astar' ? getAStarEvents : getDijkstraEvents;
    const events = fn(grid, start, end, GRID_ROWS, GRID_COLS);

    let idx = 0;
    const delay = Math.max(20, 300 / animationSpeed);
    let pathNodes: number[] = [];

    const interval = setInterval(() => {
      if (idx >= events.length) {
        clearInterval(interval);
        setPlaybackState('completed');
        return;
      }
      const event = events[idx++];
      if (event.type === 'explore') {
        setTileStates(prev => {
          const next = [...prev];
          if (next[event.node] === 'idle') next[event.node] = 'explored';
          return next;
        });
      } else if (event.type === 'path') {
        pathNodes = event.nodes;
        let pi = 0;
        const pathInterval = setInterval(() => {
          if (pi >= pathNodes.length) { clearInterval(pathInterval); return; }
          const nodeId = pathNodes[pi++];
          setTileStates(prev => {
            const next = [...prev];
            if (next[nodeId] !== 'start' && next[nodeId] !== 'end') next[nodeId] = 'path';
            return next;
          });
        }, 30);
      } else if (event.type === 'noPath') {
        clearInterval(interval);
        setPlaybackState('completed');
      }
    }, delay);

    return () => clearInterval(interval);
  }, [playbackState, activePathAlgorithm, animationSpeed, setPlaybackState, regenerate]);

  if (!mounted) return <div className="w-full h-full bg-[#020617]" />;

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 14], fov: 65 }}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} />
        <pointLight position={[-5, -5, 5]} color="#3b82f6" intensity={0.5} />

        {tileStates.map((state, i) => {
          const node = gridRef.current[i];
          if (!node) return null;
          return <GridTile key={i} row={node.row} col={node.col} state={state} />;
        })}

        <OrbitControls enablePan minDistance={8} maxDistance={30} />
      </Canvas>

      {/* Legend */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 flex-wrap justify-center text-xs">
        {Object.entries(TILE_COLORS)
          .filter(([k]) => k !== 'idle')
          .map(([key, color]) => (
          <div key={key} className="flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded-full">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
            <span className="text-slate-300 capitalize">{key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
