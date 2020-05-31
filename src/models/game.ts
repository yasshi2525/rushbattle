import { EventType, modelListener } from "@yasshi2525/rushmini";

import { ExtendRailMessage } from "../events/rail_extend";
import { JoinMessage } from "../events/join";
import { Message } from "../events/message";
import Resolver from "./resolver";
import { ServiceAdapter } from "../adapters/adapter";
import Team from "./team";

export type GameOption<T, C, D, M, U, MSG> = {
  adapter: ServiceAdapter<T, C, D, M, U, MSG>;
};

/**
 * ゲーム全体を管理
 */
class Game<T, C, D, M, U, MSG> {
  protected readonly service: ServiceAdapter<T, C, D, M, U, MSG>;
  protected readonly resolver: Resolver;
  public readonly teams: Team[] = [];

  constructor(opts: GameOption<T, C, D, M, U, MSG>) {
    this.service = opts.adapter;
    this.resolver = new Resolver();

    modelListener
      .find(EventType.CREATED, JoinMessage)
      .register((ev) => Team.handleJoinEvent(ev, this.resolver));
    modelListener
      .find(EventType.CREATED, ExtendRailMessage)
      .register((ev) => Team.handleExtendRailEvent(ev, this.resolver));
  }

  public createTeam(name: string): Team {
    const team = new Team({ name });
    modelListener.fire(EventType.CREATED);
    this.teams.push(team);
    return team;
  }

  public send(msg: Message): void {
    this.adapter.send(msg.envelop());
  }

  public destroy(): void {
    modelListener.unregisterAll();
    modelListener.flush();
  }
}

export default Game;
