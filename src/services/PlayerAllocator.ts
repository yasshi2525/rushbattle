import Player from "../models/player";

/**
 * 常に4人以上のプレイ順を決定する
 */
class PlayerAllocator {
  public readonly queue: Player[] = [];
  private list: Player[] = [];
  private readonly displayNumber = 4;

  public join(player: Player): void {
    this.queue.push(player);
  }

  public shuffle(): void {
    const max = this.queue.length;
    while (!this.isEnough()) {
      const arr = this.queue.slice();
      while (arr.length > 0) {
        const target = arr.splice(Math.floor(Math.random() * max), 1);
        this.list.push(target.shift());
      }
    }
  }

  public top(): Player {
    if (this.list.length === 0) return undefined;

    this.list.shift();
    if (!this.isEnough()) this.shuffle();
  }

  public next(n: number): Player[] {
    const arr = this.list.slice();
    const next = [];
    for (let i = 0; i < n; i++) {
      next.push(arr.shift());
    }
    return next;
  }

  private isEnough(): boolean {
    return this.list.length > this.displayNumber;
  }
}

export default PlayerAllocator;