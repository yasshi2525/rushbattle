import { EventType, modelListener } from "@yasshi2525/rushmini";

import { Reflectable } from "./resolver";
import Team from "./team";

export type PlayerOption = { name: string; team: Team };

class Player implements Reflectable {
  public static COUNT = 1;
  public readonly team: Team;
  public readonly name: string;
  protected readonly _id: number;

  constructor(opts: PlayerOption) {
    this.team = opts.team;
    this.name = opts.name;
    this._id = Player.COUNT++;
    modelListener.add(EventType.CREATED, this);
  }
  get id(): number {
    return this._id;
  }
}

export default Player;
