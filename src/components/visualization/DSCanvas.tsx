// @ts-nocheck
"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { useMounted } from '@/hooks/useMounted';
import * as THREE from 'three';

// ─── Stack Visualization ───────────────────────────────────────────
function StackScene({ items }: { items: number[] }) {
  return (
    <group>
      {items.map((val, i) => (
        <group key={i} position={[0, i * 1.3 - 3, 0]}>
          <mesh castShadow>
            <boxGeometry args={[3, 1.1, 1]} />
            <meshStandardMaterial color={i === items.length - 1 ? '#f59e0b' : '#3b82f6'} metalness={0.7} roughness={0.2} emissive={i === items.length - 1 ? '#78350f' : '#000'} emissiveIntensity={0.3} />
          </mesh>
          <Text position={[0, 0, 0.6]} fontSize={0.45} color="white" anchorX="center" anchorY="middle">
            {String(val)}
          </Text>
        </group>
      ))}
      {items.length > 0 && (
        <Text position={[2, (items.length - 1) * 1.3 - 3, 0]} fontSize={0.35} color="#f59e0b" anchorX="left">
          ← TOP
        </Text>
      )}
    </group>
  );
}

// ─── Queue Visualization ──────────────────────────────────────────
function QueueScene({ items }: { items: number[] }) {
  return (
    <group>
      {items.map((val, i) => (
        <group key={i} position={[(i - items.length / 2) * 1.4, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 1.1, 1]} />
            <meshStandardMaterial color={i === 0 ? '#10b981' : i === items.length - 1 ? '#f59e0b' : '#3b82f6'} metalness={0.7} roughness={0.2} />
          </mesh>
          <Text position={[0, 0, 0.6]} fontSize={0.4} color="white" anchorX="center" anchorY="middle">
            {String(val)}
          </Text>
        </group>
      ))}
      {items.length > 0 && (
        <>
          <Text position={[(0 - items.length / 2) * 1.4, -1.1, 0]} fontSize={0.32} color="#10b981">FRONT</Text>
          <Text position={[(items.length - 1 - items.length / 2) * 1.4, -1.1, 0]} fontSize={0.32} color="#f59e0b">REAR</Text>
        </>
      )}
    </group>
  );
}

// ─── BST Visualization ────────────────────────────────────────────
type BSTNode = { val: number; left: BSTNode | null; right: BSTNode | null };

function insertBST(root: BSTNode | null, val: number): BSTNode {
  if (!root) return { val, left: null, right: null };
  if (val < root.val) return { ...root, left: insertBST(root.left, val) };
  return { ...root, right: insertBST(root.right, val) };
}

function BSTNodeMesh({ node, x, y, depth, highlighted }: { node: BSTNode; x: number; y: number; depth: number; highlighted: number | null }) {
  const spread = 4 / (depth + 1);
  const isHighlighted = node.val === highlighted;
  return (
    <group>
      {node.left && (
        <>
          <line>
            <bufferGeometry setFromPoints={[new THREE.Vector3(x, y, 0), new THREE.Vector3(x - spread, y - 1.6, 0)]} />
            <lineBasicMaterial color="#334155" />
          </line>
          <BSTNodeMesh node={node.left} x={x - spread} y={y - 1.6} depth={depth + 1} highlighted={highlighted} />
        </>
      )}
      {node.right && (
        <>
          <line>
            <bufferGeometry setFromPoints={[new THREE.Vector3(x, y, 0), new THREE.Vector3(x + spread, y - 1.6, 0)]} />
            <lineBasicMaterial color="#334155" />
          </line>
          <BSTNodeMesh node={node.right} x={x + spread} y={y - 1.6} depth={depth + 1} highlighted={highlighted} />
        </>
      )}
      <mesh position={[x, y, 0]}>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshStandardMaterial color={isHighlighted ? '#f59e0b' : '#3b82f6'} emissive={isHighlighted ? '#78350f' : '#000'} emissiveIntensity={isHighlighted ? 0.5 : 0} metalness={0.7} roughness={0.2} />
      </mesh>
      <Text position={[x, y, 0.5]} fontSize={0.38} color="white" anchorX="center" anchorY="middle">
        {String(node.val)}
      </Text>
    </group>
  );
}

// ─── Main DSCanvas ─────────────────────────────────────────────────
export function DSCanvas() {
  const mounted = useMounted();
  const { activeDsAlgorithm, playbackState, setPlaybackState } = useAlgorithmStore();

  const [stackItems, setStackItems] = useState([10, 25, 7, 42]);
  const [queueItems, setQueueItems] = useState([3, 17, 8, 31, 5]);
  const [bstRoot, setBstRoot] = useState<BSTNode | null>(null);
  const [bstHighlight, setBstHighlight] = useState<number | null>(null);
  const [opMessage, setOpMessage] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Build initial BST
  useEffect(() => {
    let root: BSTNode | null = null;
    [50, 30, 70, 20, 40, 60, 80].forEach(v => { root = insertBST(root, v); });
    setBstRoot(root);
  }, []);

  // Auto-demo: keep cycling operations when playing
  useEffect(() => {
    if (playbackState !== 'playing') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const ops = activeDsAlgorithm === 'stack'
      ? ['push', 'pop', 'push', 'push', 'pop']
      : activeDsAlgorithm === 'queue'
      ? ['enqueue', 'dequeue', 'enqueue', 'enqueue', 'dequeue']
      : ['insert', 'search', 'insert', 'search', 'insert'];

    let step = 0;
    intervalRef.current = setInterval(() => {
      if (step >= ops.length * 3) {
        clearInterval(intervalRef.current!);
        setPlaybackState('completed');
        return;
      }
      const op = ops[step % ops.length];
      step++;

      if (activeDsAlgorithm === 'stack') {
        if (op === 'push') {
          const val = Math.floor(Math.random() * 99) + 1;
          setStackItems(prev => [...prev.slice(-6), val]);
          setOpMessage(`push(${val})`);
        } else {
          setStackItems(prev => { const next = [...prev]; const popped = next.pop(); setOpMessage(`pop() → ${popped ?? 'empty'}`); return next; });
        }
      } else if (activeDsAlgorithm === 'queue') {
        if (op === 'enqueue') {
          const val = Math.floor(Math.random() * 99) + 1;
          setQueueItems(prev => [...prev.slice(-6), val]);
          setOpMessage(`enqueue(${val})`);
        } else {
          setQueueItems(prev => { const next = [...prev]; const dequeued = next.shift(); setOpMessage(`dequeue() → ${dequeued ?? 'empty'}`); return next; });
        }
      } else {
        // BST
        if (op === 'insert') {
          const val = Math.floor(Math.random() * 99) + 1;
          setBstRoot(prev => insertBST(prev, val));
          setBstHighlight(val);
          setOpMessage(`insert(${val})`);
          setTimeout(() => setBstHighlight(null), 600);
        } else {
          const val = Math.floor(Math.random() * 99) + 1;
          setBstHighlight(val);
          setOpMessage(`search(${val})`);
          setTimeout(() => setBstHighlight(null), 600);
        }
      }
    }, 900);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playbackState, activeDsAlgorithm, setPlaybackState]);

  // Reset on idle
  useEffect(() => {
    if (playbackState === 'idle') {
      setStackItems([10, 25, 7, 42]);
      setQueueItems([3, 17, 8, 31, 5]);
      let root: BSTNode | null = null;
      [50, 30, 70, 20, 40, 60, 80].forEach(v => { root = insertBST(root, v); });
      setBstRoot(root);
      setOpMessage('');
    }
  }, [playbackState]);

  if (!mounted) return <div className="w-full h-full bg-[#020617]" />;

  const cameraPos: [number, number, number] =
    activeDsAlgorithm === 'stack' ? [0, 2, 14] :
    activeDsAlgorithm === 'queue' ? [0, 0, 14] :
    [0, 0, 18];

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: cameraPos, fov: 60 }}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />
        <pointLight position={[-5, -5, 5]} color="#3b82f6" intensity={0.7} />

        {activeDsAlgorithm === 'stack' && <StackScene items={stackItems} />}
        {activeDsAlgorithm === 'queue' && <QueueScene items={queueItems} />}
        {activeDsAlgorithm === 'bst' && bstRoot && (
          <BSTNodeMesh node={bstRoot} x={0} y={3.5} depth={0} highlighted={bstHighlight} />
        )}

        <OrbitControls enablePan minDistance={6} maxDistance={30} />
      </Canvas>

      {opMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-amber-400 font-mono text-sm px-4 py-2 rounded-full border border-amber-500/30">
          {opMessage}
        </div>
      )}
    </div>
  );
}
