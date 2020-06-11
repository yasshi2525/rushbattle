import Player from "../models/player";

class PlayerAllocator {
  private readonly queue: Player[] = [];

  public join(player: Player): void {
    this.queue.push(player);
  }
}

export default PlayerAllocator;
