import { SortEvent } from '../../engine/SortingWorker';

export function getMergeSortEvents(array: number[]): SortEvent[] {
  const events: SortEvent[] = [];
  const n = array.length;

  // Auxiliary array to track which original index each position holds
  // We simulate merge sort by tracking swaps correctly
  function merge(start: number, mid: number, end: number) {
    // Two-pointer merge: compare elements and shift right to insert
    let left = start;
    let right = mid + 1;

    while (left <= mid && right <= end) {
      events.push({ type: 'compare', indices: [left, right] });

      if (array[left] <= array[right]) {
        // Already in order, just advance left pointer
        left++;
      } else {
        // array[right] needs to come before array[left]
        // Rotate: shift everything from left..right-1 one position right, insert right at left
        const valueToInsert = array[right];
        let insertPos = right;

        while (insertPos > left) {
          events.push({ type: 'swap', indices: [insertPos, insertPos - 1] });
          array[insertPos] = array[insertPos - 1];
          insertPos--;
        }
        array[left] = valueToInsert;

        // All pointers shift right by 1 after insertion
        left++;
        mid++;
        right++;
      }
    }
  }

  function mergeSort(l: number, r: number) {
    if (l < r) {
      const m = l + Math.floor((r - l) / 2);
      mergeSort(l, m);
      mergeSort(m + 1, r);
      merge(l, m, r);
    }
  }

  mergeSort(0, n - 1);

  const allIndices = Array.from({ length: n }, (_, k) => k);
  events.push({ type: 'markSorted', indices: allIndices });

  return events;
}
