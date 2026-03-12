import { SortEvent } from './SortingWorker';

export class AlgorithmRunner {
  private worker: Worker | null = null;

  public async runSortingAlgorithm(algorithm: string, array: number[]): Promise<SortEvent[]> {
    return new Promise((resolve, reject) => {
      // Create worker
      if (!this.worker) {
        this.worker = new Worker(new URL('./SortingWorker.ts', import.meta.url));
      }

      this.worker.onmessage = (e: MessageEvent<{ events: SortEvent[] }>) => {
        resolve(e.data.events);
      };

      this.worker.onerror = (error) => {
        reject(error);
      };

      this.worker.postMessage({ algorithm, array });
    });
  }

  public terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}
