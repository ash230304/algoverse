// @ts-nocheck
"use client";

import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SortCubeProps {
  index: number;
  value: number;
  maxValue: number;
  totalElements: number;
}

// Target color map per state
const STATE_COLORS: Record<string, string> = {
  normal: '#3b82f6',    // blue-500
  comparing: '#f59e0b', // amber-500
  sorted: '#10b981',    // emerald-500
  pivot: '#ec4899',     // pink-500
};

export function SortCube({ index, value, maxValue, totalElements }: SortCubeProps) {
  const state = useAlgorithmStore(s => s.elementStates[index] || 'normal');

  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Calculate target position and sizing
  const spacing = 1.2;
  const totalWidth = totalElements * spacing;
  const startX = -totalWidth / 2 + spacing / 2;
  const targetX = startX + index * spacing;
  const targetHeight = Math.max(0.5, (value / maxValue) * 10);
  const targetY = targetHeight / 2;
  const targetZ = state === 'comparing' ? 0.5 : 0;

  const targetColor = new THREE.Color(STATE_COLORS[state] ?? STATE_COLORS.normal);
  const targetEmissive = state === 'comparing'
    ? new THREE.Color('#78350f')
    : state === 'sorted'
    ? new THREE.Color('#064e3b')
    : state === 'pivot'
    ? new THREE.Color('#831843')
    : new THREE.Color(0x000000);

  // Smooth lerp on every frame for position, scale (height), and color
  useFrame((_, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    const lerpFactor = Math.min(1, delta * 12);

    // Lerp position
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, lerpFactor);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, lerpFactor);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, lerpFactor);

    // Lerp height via scale.y
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetHeight, lerpFactor);

    // Lerp color
    materialRef.current.color.lerp(targetColor, lerpFactor);
    materialRef.current.emissive.lerp(targetEmissive, lerpFactor);
  });

  return (
    <mesh
      ref={meshRef}
      position={[targetX, targetY, 0]}
      scale={[1, targetHeight, 1]}
      castShadow
      receiveShadow
    >
      {/* Unit cube — scaled by scale.y for height */}
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        ref={materialRef}
        color={STATE_COLORS[state]}
        emissive={targetEmissive}
        emissiveIntensity={0.4}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}
