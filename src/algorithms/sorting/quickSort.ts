import { SortEvent } from '../../engine/SortingWorker';

export function getQuickSortEvents(array: number[]): SortEvent[] {
  const events: SortEvent[] = [];
  const n = array.length;

  function partition(low: number, high: number): number {
    const pivotIdx = high;
    // Highlight the pivot element
    events.push({ type: 'setPivot', indices: [pivotIdx] });

    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      events.push({ type: 'compare', indices: [j, high] });
      if (array[j] < pivot) {
        i++;
        events.push({ type: 'swap', indices: [i, j] });
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }

    // Place pivot in correct position
    events.push({ type: 'swap', indices: [i + 1, high] });
    const temp = array[i + 1];
    array[i + 1] = array[high];
    array[high] = temp;

    events.push({ type: 'markSorted', indices: [i + 1] });

    return i + 1;
  }

  function quickSort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    } else if (low === high) {
      events.push({ type: 'markSorted', indices: [low] });
    }
  }

  quickSort(0, n - 1);

  return events;
}
