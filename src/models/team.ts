import {
  EventType,
  Point,
  RailLine,
  modelListener,
} from "@yasshi2525/rushmini";

import ActionProxy from "./action";
import { ExtendRailMessage } from "../events/rail_extend";
import { JoinMessage } from "../events/join";
import Player from "./player";
import RailNode from "./rail_node";
import Resolver from "./resolver";

export type TeamOption = { name: string };

class Team {
  public static COUNT = 1;
  public readonly name: string;
  public readonly line: RailLine;
  public readonly members: Player[] = [];
  public readonly railCandidates: {
    from: RailNode;
    x: number;
    y: number;
  }[] = [];
  protected readonly _id: number;
  protected readonly action: ActionProxy;

  constructor(opts: TeamOption) {
    this.name = opts.name;
    this.action = new ActionProxy();
    this.line = this.action.line();
    this._id = Team.COUNT++;
    modelListener.add(EventType.CREATED, this);
  }

  public get id(): number {
    return this._id;
  }

  public static handleJoinEvent(ev: JoinMessage, r: Resolver): void {
    const team = r.find(Team, ev.team);
    team?.join(ev.user);
  }

  public static handleExtendRailEvent(
    ev: ExtendRailMessage,
    r: Resolver
  ): void {
    const team = r.find(Player, ev.sender).team;
    team.railCandidates.push({
      from: r.find(RailNode, ev.from),
      x: ev.x,
      y: ev.y,
    });
  }

  public startRailway(pos: Point): RailNode {
    this.action.startRail(pos.x, pos.y);
    this.action.buildStation();
    this.action.startLine();
    this.action.deployTrain(this.action.line().top);
    return this.action.tail() as RailNode;
  }

  public join(name: string): Player {
    const user = new Player({ name, team: this });
    this.members.push(user);
    return user;
  }

  public tailNode(): RailNode {
    return this.action.tail() as RailNode;
  }

  public isRailLottery(): boolean {
    return this.railCandidates.length > 0;
  }
}

export default Team;
