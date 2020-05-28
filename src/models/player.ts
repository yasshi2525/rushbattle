import { EventType, modelListener } from "@yasshi2525/rushmini";
import { Reflectable, UID } from "./resolver";

import { ReflectableType } from "./model_mapper";
import Team from "./team";

export type PlayerOption = { name: string; team: Team };

class Player implements Reflectable {
  public readonly team: Team;
  public readonly name: string;
  protected readonly _uid: UID;
  constructor(opts: PlayerOption) {
    this.team = opts.team;
    this.name = opts.name;
    this._uid = { key: ReflectableType.Player, id: this.name };
    modelListener.add(EventType.CREATED, this);
  }
  get uid(): UID {
    return this._uid;
  }
}

export default Player;
