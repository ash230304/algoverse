import { SortEvent } from './SortingWorker';

export class AnimationEngine {
  private events: SortEvent[] = [];
  private currentIndex: number = 0;
  private isPlaying: boolean = false;
  private animationId: number = 0;
  private speedRef: { current: number } = { current: 5 };
  private startTime: number = 0;
  
  // Callbacks to UI
  private onSwap: (i: number, j: number) => void;
  private onCompare: (i: number, j: number) => void;
  private onMarkSorted: (indices: number[]) => void;
  private onSetPivot: (index: number) => void;
  private onFinish: () => void;
  private onIncrementCompare: () => void;
  private onIncrementSwap: () => void;
  private onElapsed: (ms: number) => void;
  
  private lastFrameTime: number = 0;

  constructor(callbacks: {
    onSwap: (i: number, j: number) => void;
    onCompare: (i: number, j: number) => void;
    onMarkSorted: (indices: number[]) => void;
    onSetPivot: (index: number) => void;
    onFinish: () => void;
    onIncrementCompare: () => void;
    onIncrementSwap: () => void;
    onElapsed: (ms: number) => void;
  }) {
    this.onSwap = callbacks.onSwap;
    this.onCompare = callbacks.onCompare;
    this.onMarkSorted = callbacks.onMarkSorted;
    this.onSetPivot = callbacks.onSetPivot;
    this.onFinish = callbacks.onFinish;
    this.onIncrementCompare = callbacks.onIncrementCompare;
    this.onIncrementSwap = callbacks.onIncrementSwap;
    this.onElapsed = callbacks.onElapsed;
  }

  public setEvents(events: SortEvent[]) {
    this.events = events;
    this.currentIndex = 0;
  }

  public setSpeed(speed: number) {
    this.speedRef.current = speed;
  }

  public play() {
    if (this.isPlaying || this.events.length === 0) return;
    this.isPlaying = true;
    this.startTime = performance.now();
    this.lastFrameTime = this.startTime;
    this.loop(this.lastFrameTime);
  }

  public pause() {
    this.isPlaying = false;
    cancelAnimationFrame(this.animationId);
  }

  public step() {
    if (this.currentIndex < this.events.length) {
      this.executeEvent(this.events[this.currentIndex]);
      this.currentIndex++;
    }
  }

  public reset() {
    this.pause();
    this.events = [];
    this.currentIndex = 0;
  }

  private loop = (time: number) => {
    if (!this.isPlaying) return;

    // Non-linear speed mapping
    // Speed 1: ~1 event/sec, Speed 5: ~125 events/sec, Speed 10: 1000 events/frame
    const eventsPerSecond = Math.pow(this.speedRef.current, 3); 
    const timeDelta = time - this.lastFrameTime;
    
    let eventsToProcess = this.speedRef.current === 10 
      ? 1000 
      : Math.floor((eventsPerSecond * timeDelta) / 1000);

    if (eventsToProcess >= 1) {
      for (let k = 0; k < eventsToProcess; k++) {
        if (this.currentIndex >= this.events.length) {
          this.isPlaying = false;
          const elapsed = performance.now() - this.startTime;
          this.onElapsed(elapsed);
          this.onFinish();
          return;
        }
        this.executeEvent(this.events[this.currentIndex]);
        this.currentIndex++;
      }
      this.lastFrameTime = time;
    }

    this.animationId = requestAnimationFrame(this.loop);
  };

  private executeEvent(event: SortEvent) {
    switch (event.type) {
      case 'compare':
        this.onCompare(event.indices[0], event.indices[1]);
        this.onIncrementCompare();
        break;
      case 'swap':
        this.onSwap(event.indices[0], event.indices[1]);
        this.onIncrementSwap();
        break;
      case 'markSorted':
        this.onMarkSorted(event.indices);
        break;
      case 'setPivot':
        this.onSetPivot(event.indices[0]);
        break;
    }
  }
}
