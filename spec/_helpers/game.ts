import OrgGame from "models/game";
import TestAdapter from "./adapter";

export class Game extends OrgGame {
  public tick(): void {
    (this.service as TestAdapter).fetch();
  }
}

export const createGame = (): Game => new Game({ adapter: new TestAdapter() });
