import { PlayManager, RunnerManager, RunnerV2 } from "@akashic/headless-driver";

import AkashicAdapter from "adapters/akashic";
import Game from "models/game";
import { resolve } from "path";

declare const rootDir: string;

export const createAkashicRunner = async (): Promise<RunnerV2> => {
  const pMng = new PlayManager();
  const playId = await pMng.createPlay({
    gameJsonPath: resolve(rootDir, "game.json"),
  });
  const amflow = pMng.createAMFlow(playId);
  const playToken = pMng.createPlayToken(playId, {
    maxEventPriority: 2,
    readTick: true,
    writeTick: true,
    sendEvent: true,
    subscribeEvent: true,
    subscribeTick: true,
  });

  const mng = new RunnerManager(pMng);
  const runnerId = await mng.createRunner({
    allowedUrls: null,
    amflow,
    playId,
    playToken,
    executionMode: "active",
  });
  const runner = mng.getRunner(runnerId) as RunnerV2;
  return runner;
};

export type CreateGameWithAkashicOption = {
  runner: RunnerV2;
  main: string;
  sceneMapGenerator: (game: g.Game) => { [index: string]: g.Scene };
};

export const createGameWithAkashic = async (
  opts: CreateGameWithAkashicOption
): Promise<Game> => {
  const game = ((await opts.runner.start()) as unknown) as g.Game;
  return new Game({
    adapter: new AkashicAdapter({
      game,
      main: opts.main,
      sceneMapper: opts.sceneMapGenerator(game),
    }),
  });
};
