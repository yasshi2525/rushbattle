import { EventType, modelListener } from "@yasshi2525/rushmini";

import { JoinMessage } from "../events/join";
import Player from "./player";
import Railway from "./railway";
import Resolver from "./resolver";

export type TeamOption = { name: string; isAdmin?: boolean };

class Team {
  public static COUNT = 1;
  public readonly name: string;
  public readonly members: Player[] = [];
  public readonly railway: Railway;
  protected readonly _id: number;

  constructor(opts: TeamOption) {
    this.name = opts.name;
    this._id = Team.COUNT++;
    this.railway = new Railway({ isAdmin: !!opts.isAdmin });
    modelListener.add(EventType.CREATED, this);
  }

  public get id(): number {
    return this._id;
  }

  public static handleJoinEvent(ev: JoinMessage, r: Resolver): void {
    const team = r.find(Team, ev.team);
    team?.join(ev.user);
  }

  public join(name: string): Player {
    const user = new Player({ name, team: this });
    this.members.push(user);
    return user;
  }
}

export default Team;
