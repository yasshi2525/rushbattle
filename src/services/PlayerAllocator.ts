import Player from "../models/player";

/**
 * プレイヤーの順番を決定する
 */
class PlayerAllocator {
  public readonly queue: Player[] = [];
  private list: Player[] = [];
  private readonly displayNumber = 4;

  public join(player: Player): void {
    this.queue.push(player);
  }

  public shuffle(): void {
    while (this.shouldShuffle()) {
      const arr = this.queue.slice();
      while (arr.length > 0) {
        const target = arr.splice(Math.floor(Math.random() * arr.length), 1);
        this.list.push(target.shift());
      }
    }
  }

  public top(): Player {
    if (this.list.length === 0) return undefined;

    return this.list[0];
  }

  public next(n: number): Player[] {
    return this.list.slice(0, n);
  }

  public shift(): void {
    this.list.shift();
  }

  public shouldShuffle(): boolean {
    return this.list.length < this.displayNumber;
  }
}

export default PlayerAllocator;
