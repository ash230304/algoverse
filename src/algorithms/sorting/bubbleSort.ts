import { SortEvent } from '../../engine/SortingWorker';

export function getBubbleSortEvents(array: number[]): SortEvent[] {
  const events: SortEvent[] = [];
  const n = array.length;
  // We don't want to mutate the original array strictly if it's passed by reference, 
  // but the worker gets a clone anyway via postMessage. We'll mutate it locally to generate events.

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Comparison event
      events.push({ type: 'compare', indices: [j, j + 1] });
      
      if (array[j] > array[j + 1]) {
        // Swap event
        events.push({ type: 'swap', indices: [j, j + 1] });
        // Perform swap
        const temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
    }
    // After each pass, the last element is sorted
    events.push({ type: 'markSorted', indices: [n - i - 1] });
  }

  // Double check the very first element gets marked sorted
  events.push({ type: 'markSorted', indices: [0] });

  return events;
}
