"use client";

import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { SortCube } from './SortCube';
import { useEffect, useMemo, useRef } from 'react';
import { useAlgorithmSimulation } from '@/hooks/useAlgorithmSimulation';
import { useMounted } from '@/hooks/useMounted';
import * as THREE from 'three';

// Dynamically repositions camera based on dataset size
function CameraController({ totalElements }: { totalElements: number }) {
  const { camera } = useThree();
  const spacing = 1.2;
  const totalWidth = totalElements * spacing;
  // Push camera back proportionally so all bars fit in frame
  const zDist = Math.max(20, totalWidth * 0.7);
  const yDist = Math.max(8, totalWidth * 0.15);

  useEffect(() => {
    camera.position.set(0, yDist, zDist);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, zDist, yDist]);

  return null;
}

export function SortingCanvas() {
  const mounted = useMounted();
  const { arrayState, datasetSize, setArrayState, resetElementStates } = useAlgorithmStore();
  
  useAlgorithmSimulation();
  
  useEffect(() => {
    const newArr = Array.from({ length: datasetSize }, () => Math.floor(Math.random() * 100) + 1);
    setArrayState(newArr);
    resetElementStates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasetSize, setArrayState]);

  const maxValue = useMemo(() => Math.max(...arrayState, 1), [arrayState]);

  if (!mounted) {
    return <div className="w-full h-full relative bg-[#020617]" />;
  }

  return (
    <div className="w-full h-full relative">
      <Canvas shadows camera={{ position: [0, 8, 20], fov: 50 }}>
        <color attach="background" args={['#020617']} />
        
        <CameraController totalElements={arrayState.length} />

        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        
        <Environment preset="city" />

        <group position={[0, -4, 0]}>
          {/* Cubes — no Float wrapper (conflicts with per-frame lerp in SortCube) */}
          {arrayState.map((val, i) => (
            <SortCube 
              key={i} 
              index={i} 
              value={val} 
              maxValue={maxValue} 
              totalElements={arrayState.length} 
            />
          ))}

          <ContactShadows 
            position={[0, 0, 0]} 
            opacity={0.6} 
            scale={100} 
            blur={2} 
            far={10} 
            resolution={512} 
            color="#000000" 
          />
          
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
            <planeGeometry args={[300, 300]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
          </mesh>
        </group>

        <OrbitControls 
          enablePan={true}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={5}
          maxDistance={200}
        />
      </Canvas>
    </div>
  );
}
