import HeadlessAdapter from "./adapter";
import OrgGame from "models/game";
import { SimpleContainer } from "./headless_container";
import { SimpleScene } from "./headless_scene";

export class Game extends OrgGame<SimpleScene, SimpleContainer> {
  public readonly adapter: HeadlessAdapter;
  public static FPS = 30;

  public tick(): void {
    this.adapter.shiftSceneIf();
    this.adapter.fetch();
  }
}

export const createGame = (): Game => {
  const adapter = new HeadlessAdapter();
  const game = new Game({ adapter, fps: Game.FPS, width: 816, height: 624 });
  adapter.pushScene(adapter.createScene());
  return game;
};
