import { EventType, modelListener, ticker } from "@yasshi2525/rushmini";

import City from "./city";
import { JoinMessage } from "../events/join";
import { Message } from "../events/message";
import Resolver from "./resolver";
import { ServiceAdapter } from "../adapters/adapter";
import Team from "./team";
import { resourceTypes } from "./model_mapper";

export type GameOption<T, C> = {
  adapter: ServiceAdapter<T, C>;
  fps: number;
  width: number;
  height: number;
  rand?: () => number;
};

/**
 * ゲーム全体を管理
 */
class Game<T, C> {
  public readonly adapter: ServiceAdapter<T, C>;
  public readonly resolver: Resolver;
  public readonly width: number;
  public readonly height: number;
  public readonly fps: number;
  public readonly rand: () => number;
  public readonly teams: Team[] = [];
  public city: City;

  public static TIME = 240;

  constructor(opts: GameOption<T, C>) {
    this.adapter = opts.adapter;
    this.resolver = new Resolver();

    this.width = opts.width;
    this.height = opts.height;
    this.rand = opts.rand ?? Math.random;
    this.fps = opts.fps;
    ticker.init(opts.fps, Game.TIME);

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

  public initCity(): void {
    this.city = new City({
      width: this.width,
      height: this.height,
      rand: this.rand,
    });
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
    ticker.reset();
  }
}

export default Game;
