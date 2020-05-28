import {
  ActionProxy,
  EventType,
  Point,
  RailLine,
  RailNode,
  modelListener,
} from "@yasshi2525/rushmini";
import Resolver, { Storage, UID } from "./resolver";

import { JoinMessage } from "../events/join";
import Player from "./player";
import { ReflectableType } from "./model_mapper";

export type TeamOption = { name: string };

class Team {
  public readonly name: string;
  public readonly line: RailLine;
  public readonly members: Player[] = [];
  public readonly railCandidates: RailNode[] = [];
  protected readonly _uid: UID;
  protected readonly action: ActionProxy;

  constructor(opts: TeamOption) {
    this.name = opts.name;
    this.action = new ActionProxy();
    this.line = this.action.line();
    this._uid = { key: ReflectableType.Team, id: this.name };
    modelListener.add(EventType.CREATED, this);
  }
  get uid(): UID {
    return this._uid;
  }

  static handleJoinEvent(ev: JoinMessage, r: Resolver): void {
    const team = r.find(Team, ev.team);
    team?.join(ev.user);
  }

  public startRailway(pos: Point) {
    this.action.startRail(pos.x, pos.y);
    this.action.buildStation();
    this.action.startLine();
    this.action.deployTrain(this.action.line().top);
    return this.action.tail();
  }

  public join(name: string) {
    const user = new Player({ name, team: this });
    this.members.push(user);
    return user;
  }

  public tailNode() {
    return this.action.tail();
  }

  public isRailLottery() {
    return this.railCandidates.length > 0;
  }
}

export default Team;
