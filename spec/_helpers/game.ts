import HeadlessAdapter from "./adapter";
import OrgGame from "models/game";
import { SimpleContainer } from "./headless_container";
import { SimpleScene } from "./headless_scene";

export class Game extends OrgGame<
  SimpleScene,
  SimpleContainer,
  g.PointDownEvent,
  g.PointMoveEvent,
  g.PointUpEvent,
  g.MessageEvent
> {
  public readonly adapter: HeadlessAdapter;

  public tick(): void {
    this.adapter.fetch();
    this.adapter.shiftSceneIf();
  }
}

export const createGame = (): Game => {
  const adapter = new HeadlessAdapter();
  const game = new Game({ adapter });
  adapter.pushScene(adapter.createScene());
  return game;
};
