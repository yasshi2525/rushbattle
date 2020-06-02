import { EventType, modelListener } from "@yasshi2525/rushmini";

import { JoinMessage } from "../events/join";
import { Message } from "../events/message";
import Resolver from "./resolver";
import { ServiceAdapter } from "../adapters/adapter";
import Team from "./team";
import { resourceTypes } from "./model_mapper";

export type GameOption<T, C> = {
  adapter: ServiceAdapter<T, C>;
};

/**
 * ゲーム全体を管理
 */
class Game<T, C> {
  public readonly adapter: ServiceAdapter<T, C>;
  public readonly resolver: Resolver;
  public readonly teams: Team[] = [];

  constructor(opts: GameOption<T, C>) {
    this.adapter = opts.adapter;
    this.resolver = new Resolver();

    modelListener
      .find(EventType.CREATED, JoinMessage)
      .register((ev) => Team.handleJoinEvent(ev, this.resolver));
  }

  public createTeam(name: string, isAdmin = false): Team {
    const team = new Team({ name, isAdmin });
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
    resourceTypes.forEach(
      (t) => (((t as unknown) as { COUNT: number }).COUNT = 1)
    );
  }
}

export default Game;
