import { SortEvent } from '../../engine/SortingWorker';

export function getHeapSortEvents(array: number[]): SortEvent[] {
  const events: SortEvent[] = [];
  const n = array.length;

  function heapify(N: number, i: number) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < N) {
      events.push({ type: 'compare', indices: [l, largest] });
      if (array[l] > array[largest]) {
        largest = l;
      }
    }

    if (r < N) {
      events.push({ type: 'compare', indices: [r, largest] });
      if (array[r] > array[largest]) {
        largest = r;
      }
    }

    if (largest !== i) {
      events.push({ type: 'swap', indices: [i, largest] });
      const swap = array[i];
      array[i] = array[largest];
      array[largest] = swap;

      heapify(N, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    events.push({ type: 'swap', indices: [0, i] });
    const temp = array[0];
    array[0] = array[i];
    array[i] = temp;
    
    events.push({ type: 'markSorted', indices: [i] });

    heapify(i, 0);
  }
  
  events.push({ type: 'markSorted', indices: [0] });

  // Ensure all are marked at the end
  const allIndices = Array.from({ length: n }, (_, k) => k);
  events.push({ type: 'markSorted', indices: allIndices });

  return events;
}
