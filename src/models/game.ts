import { EventType, modelListener } from "@yasshi2525/rushmini";

import { JoinMessage } from "../events/join";
import { Message } from "../events/message";
import Resolver from "./resolver";
import { ServiceAdapter } from "../adapters/adapter";
import Team from "./team";

/**
 * ゲーム全体を管理
 */
class Game {
  protected readonly service: ServiceAdapter;
  protected readonly storage: Resolver;
  public readonly teams: Team[] = [];

  constructor(adapter: ServiceAdapter) {
    this.service = adapter;
    this.storage = new Resolver();
    modelListener
      .find(EventType.CREATED, JoinMessage)
      .register((ev) => Team.handleJoinEvent(ev, this.storage));
  }

  public createTeam(name: string): Team {
    const team = new Team({ name });
    modelListener.fire(EventType.CREATED);
    this.teams.push(team);
    return team;
  }

  public send(msg: Message): void {
    this.service.send(msg.envelop());
  }

  public destroy(): void {
    modelListener.unregisterAll();
    modelListener.flush();
  }
}

export default Game;
