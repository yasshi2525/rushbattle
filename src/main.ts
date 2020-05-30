import AkashicAdapter from "./adapters/akashic";
import Game from "./models/game";
import { RPGAtsumaruWindow } from "./parameterObject";
import createStartScene from "./scenes/start";

declare const window: RPGAtsumaruWindow;

export function main(/* param: GameMainParameterObject */): void {
  g.game.vars.gameState = { score: 0 };
  const adapter = new AkashicAdapter({
    game: g.game,
    main: "start",
    sceneMapper: {
      start: createStartScene(g.game),
    },
  });
  const game = new Game({ adapter });
  game.createTeam("admin");
  game.createTeam("user");
  adapter.scene = "start";
}
