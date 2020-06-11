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

  /**
   *
   */
  public shuffle(): void {
    const max = this.queue.length;
    while (this.list.length < this.displayNumber) {
      const arr = this.queue.slice();
      while (arr.length > 0) {
        const target = arr.splice(Math.floor(Math.random() * max), 1);
        this.list.push(target.shift());
      }
    }
  }
}

export default PlayerAllocator;
