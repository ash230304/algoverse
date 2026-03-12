export type SortEvent = 
  | { type: 'compare'; indices: [number, number] }
  | { type: 'swap'; indices: [number, number] }
  | { type: 'markSorted'; indices: number[] }
  | { type: 'setPivot'; indices: [number] };

// The worker just maps a string 'bubble' to a function that returns SortEvent[]
import { getBubbleSortEvents } from '../algorithms/sorting/bubbleSort';
import { getSelectionSortEvents } from '../algorithms/sorting/selectionSort';
import { getInsertionSortEvents } from '../algorithms/sorting/insertionSort';
import { getMergeSortEvents } from '../algorithms/sorting/mergeSort';
import { getQuickSortEvents } from '../algorithms/sorting/quickSort';
import { getHeapSortEvents } from '../algorithms/sorting/heapSort';

self.onmessage = (e: MessageEvent<{ algorithm: string; array: number[] }>) => {
  const { algorithm, array } = e.data;
  
  let events: SortEvent[] = [];
  
  switch (algorithm) {
    case 'bubble':
      events = getBubbleSortEvents([...array]);
      break;
    case 'selection':
      events = getSelectionSortEvents([...array]);
      break;
    case 'insertion':
      events = getInsertionSortEvents([...array]);
      break;
    case 'merge':
      events = getMergeSortEvents([...array]);
      break;
    case 'quick':
      events = getQuickSortEvents([...array]);
      break;
    case 'heap':
      events = getHeapSortEvents([...array]);
      break;
    default:
      events = getBubbleSortEvents([...array]);
  }
  
  self.postMessage({ events });
};
