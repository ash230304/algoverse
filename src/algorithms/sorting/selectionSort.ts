import { SortEvent } from '../../engine/SortingWorker';

export function getSelectionSortEvents(array: number[]): SortEvent[] {
  const events: SortEvent[] = [];
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      events.push({ type: 'compare', indices: [minIdx, j] });
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }
    
    if (minIdx !== i) {
      events.push({ type: 'swap', indices: [i, minIdx] });
      const temp = array[i];
      array[i] = array[minIdx];
      array[minIdx] = temp;
    }
    events.push({ type: 'markSorted', indices: [i] });
  }
  
  // Last element is sorted
  events.push({ type: 'markSorted', indices: [n - 1] });

  return events;
}
