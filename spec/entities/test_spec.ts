import {
  createAkashicRunner,
  createGameWithAkashic,
} from "../_helpers/akashic";

import AkashicAdapter from "adapters/akashic";
import Game from "models/game";
import { RunnerV2 } from "@akashic/headless-driver";

describe("test", () => {
  let runner: RunnerV2;
  let game: Game;
  let akashic: g.Game;

  beforeEach(async () => {
    runner = await createAkashicRunner();
    expect(g.Scene).not.toBeUndefined();
    game = await createGameWithAkashic({
      runner,
      main: "main",
      sceneMapGenerator: (game) => ({ main: new g.Scene({ game }) }),
    });
    akashic = (game.adapter as AkashicAdapter).game;
  }, 10000);

  afterEach(() => {
    game.destroy();
    runner.stop();
  });

  it("test1", () => {
    expect(akashic.scene()).not.toBeUndefined();
  });
  it("test2", () => {
    expect(akashic.scene()).not.toBeUndefined();
  });
});
