import { useEffect, useRef } from 'react';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { AnimationEngine } from '@/engine/AnimationEngine';
import { AlgorithmRunner } from '@/engine/AlgorithmRunner';

export function useAlgorithmSimulation() {
  const { 
    playbackState, setPlaybackState,
    activeSortingAlgorithm,
    animationSpeed,
    setArrayState, setElementState, resetElementStates, clearComparingStates,
    incrementComparisons, incrementSwaps, resetStats, setElapsedMs
  } = useAlgorithmStore();

  const engineRef = useRef<AnimationEngine | null>(null);
  const runnerRef = useRef<AlgorithmRunner | null>(null);

  // Initialize engine once
  useEffect(() => {
    engineRef.current = new AnimationEngine({
      onCompare: (i, j) => {
        clearComparingStates();
        setElementState(i, 'comparing');
        setElementState(j, 'comparing');
      },
      onSwap: (i, j) => {
        const { arrayState, setArrayState } = useAlgorithmStore.getState();
        const arr = [...arrayState];
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        setArrayState(arr);
      },
      onMarkSorted: (indices) => {
        indices.forEach(idx => setElementState(idx, 'sorted'));
      },
      onSetPivot: (index) => {
        clearComparingStates();
        setElementState(index, 'pivot');
      },
      onFinish: () => {
        setPlaybackState('completed');
        // Mark ALL remaining elements as sorted visually
        const { arrayState } = useAlgorithmStore.getState();
        arrayState.forEach((_, idx) => setElementState(idx, 'sorted'));
      },
      onIncrementCompare: incrementComparisons,
      onIncrementSwap: incrementSwaps,
      onElapsed: setElapsedMs,
    });

    runnerRef.current = new AlgorithmRunner();

    return () => {
      engineRef.current?.pause();
      runnerRef.current?.terminate();
    };
  }, [setArrayState, setElementState, resetElementStates, clearComparingStates,
      setPlaybackState, incrementComparisons, incrementSwaps, resetStats, setElapsedMs]);

  // Handle Play/Pause/Reset
  useEffect(() => {
    if (!engineRef.current) return;

    const run = async () => {
      if (playbackState === 'playing') {
        // If engine has no events queued, generate them from the current array
        if ((engineRef.current as any).events.length === 0) {
          if (runnerRef.current) {
            resetStats();
            const currentArray = useAlgorithmStore.getState().arrayState;
            const events = await runnerRef.current.runSortingAlgorithm(
              activeSortingAlgorithm, currentArray
            );
            engineRef.current!.setEvents(events);
          }
        }
        engineRef.current!.play();
      } else if (playbackState === 'paused') {
        engineRef.current!.pause();
      } else if (playbackState === 'idle') {
        engineRef.current!.reset();
        resetElementStates();
        resetStats();
      }
    };

    run();
  }, [playbackState, activeSortingAlgorithm, resetElementStates, resetStats]);

  // Handle Speed updates
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setSpeed(animationSpeed);
    }
  }, [animationSpeed]);

  return null;
}
