import OrgGame from "models/game";
import TestAdapter from "./adapter";

export class Game extends OrgGame {
  public tick(): void {
    (this.adapter as TestAdapter).fetch();
  }
}

/**
 * Akashic Engineを使わないテストで使用する
 */
export const createGame = (): Game => new Game({ adapter: new TestAdapter() });
