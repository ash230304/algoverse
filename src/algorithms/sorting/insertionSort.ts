import { SortEvent } from '../../engine/SortingWorker';

export function getInsertionSortEvents(array: number[]): SortEvent[] {
  const events: SortEvent[] = [];
  const n = array.length;

  // The first element is trivially sorted
  events.push({ type: 'markSorted', indices: [0] });

  for (let i = 1; i < n; i++) {
    let j = i;
    
    while (j > 0 && array[j - 1] > array[j]) {
      events.push({ type: 'compare', indices: [j - 1, j] });
      events.push({ type: 'swap', indices: [j - 1, j] });
      
      const temp = array[j - 1];
      array[j - 1] = array[j];
      array[j] = temp;
      
      // Update sorted trail visually
      events.push({ type: 'markSorted', indices: [j - 1, j] });
      j--;
    }
    if (j > 0) {
      // final comparison that failed
      events.push({ type: 'compare', indices: [j - 1, j] });
    }
    events.push({ type: 'markSorted', indices: [i] });
  }

  // Ensure all are marked at the end
  const allIndices = Array.from({ length: n }, (_, k) => k);
  events.push({ type: 'markSorted', indices: allIndices });

  return events;
}
