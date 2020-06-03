import {
  AkashicSpriteType,
  CreateAkashicSpriteOption,
} from "adapters/akashic_sprite";
import { PlayManager, RunnerManager, RunnerV2 } from "@akashic/headless-driver";

import AkashicAdapter from "adapters/akashic";
import AkashicObject2D from "adapters/akashic_object2D";
import Game from "models/game";
import { XorshiftRandomGenerator } from "@akashic/akashic-engine";
import { resolve } from "path";

declare const rootDir: string;

export const startAkashicGame = async (): Promise<{
  runner: RunnerV2;
  game: g.Game;
}> => {
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
  const game = ((await mng.startRunner(runnerId)) as unknown) as g.Game;
  return { runner: runner, game: game };
};

class MockSprite extends AkashicObject2D<g.E> implements AkashicSpriteType {
  constructor(opts: CreateAkashicSpriteOption) {
    super(
      new g.E({
        scene: opts.scene.original,
        local: opts.local,
        x: opts.x,
        y: opts.y,
        width: opts.width,
        height: opts.height,
        anchorX: opts.anchorX,
        anchorY: opts.anchorY,
        angle: opts.angle,
        scaleX: opts.scaleX,
        scaleY: opts.scaleY,
        hidden: opts.hidden,
        opacity: opts.opacity,
        touchable: opts.hidden,
      })
    );
  }
}

class NonAssetAkashicAdapter extends AkashicAdapter {
  public createSprite(opts: CreateAkashicSpriteOption): AkashicSpriteType {
    return new MockSprite(opts);
  }
}

export type CreateGameOption = { game: g.Game; fps?: number };
const FPS = 30;
const random = new XorshiftRandomGenerator(0);

export const createGame = (opts: CreateGameOption): Game<g.Scene, g.E> =>
  new Game({
    adapter: new NonAssetAkashicAdapter({ game: opts.game }),
    fps: opts.fps ?? FPS,
    width: 816,
    height: 624,
    rand: (): number => random.generate(),
  });
