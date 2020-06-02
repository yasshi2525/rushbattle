import { EventType, find, modelListener } from "@yasshi2525/rushmini";
import { GameMainParameterObject, RPGAtsumaruWindow } from "./parameterObject";
import SceneHandler, { SceneEvent, SceneType } from "./scenes/scene_handler";

import AkashicAdapter from "./adapters/akashic";
import Game from "./models/game";
import { GameEndMessage } from "./events/game_end";
import { GameStartMessage } from "./events/game_start";
import { JoinMessage } from "./events/join";
import Player from "./models/player";
import Team from "./models/team";
import { createEndingScene } from "./scenes/ending_scene";
import { createGameScene } from "./scenes/game_scene";
import { createTitleScene } from "./scenes/title_scene";

declare const window: RPGAtsumaruWindow;

export const createAkashicGame = (): Game<g.Scene, g.E> => {
  const adapter = new AkashicAdapter({ game: g.game });
  g.game.vars.gameState = { score: 0 };
  return new Game({ adapter });
};

export const prepareGame = <T, C>(
  game: Game<T, C>
): {
  admin: Team;
  user: Team;
} => {
  const admin = game.createTeam("admin");
  const user = game.createTeam("user");
  return { admin, user };
};

export type CreateSceneHandlerOption<T, C> = {
  my?: Player;
  selfId: string;
  game: Game<T, C>;
  isMulti: boolean;
  isAdmin: boolean;
  setAdmin: (v: boolean) => void;
  admin: Team;
  user: Team;
};

export const createSceneHandler = <T, C>(
  opts: CreateSceneHandlerOption<T, C>
): SceneHandler<T, C> => {
  const sceneHandler = new SceneHandler({ adapter: opts.game.adapter });
  sceneHandler.put(
    SceneType.TITLE,
    createTitleScene({
      adapter: opts.game.adapter,
      isMulti: opts.isMulti,
      isAdmin: opts.isAdmin,
      onStart: () =>
        opts.game.send(new GameStartMessage({ sender: opts.my?.id })),
      onJoin: () => {
        opts.game.send(
          new JoinMessage({ team: opts.user.id, user: opts.selfId })
        );
      },
      onLocalStartAsAdmin: () => {
        opts.isAdmin = true;
        opts.setAdmin(true);
        sceneHandler.fire(SceneEvent.GAME_STARTED);
      },
      onLocalStartAsUser: () => {
        sceneHandler.fire(SceneEvent.GAME_STARTED);
      },
    })
  );
  sceneHandler.put(
    SceneType.GAME,
    createGameScene({
      adapter: opts.game.adapter,
      team: opts.isAdmin ? opts.admin : opts.user,
      selfId: opts.selfId,
      isMulti: opts.isMulti,
      isAdmin: opts.isAdmin,
      reset: () => sceneHandler.fire(SceneEvent.REPLAY),
      end: () => opts.game.send(new GameEndMessage({ sender: opts.my?.id })),
    })
  );
  sceneHandler.put(
    SceneType.ENDING,
    createEndingScene({
      adapter: opts.game.adapter,
      isMulti: opts.isMulti,
      isAdmin: opts.isAdmin,
      regame: () => sceneHandler.fire(SceneEvent.REPLAY),
    })
  );
  sceneHandler.register(SceneEvent.GAME_STARTED, () =>
    opts.game.adapter.pushScene(sceneHandler.scenes[SceneType.GAME])
  );
  sceneHandler.register(SceneEvent.GAME_ENDED, () =>
    opts.game.adapter.pushScene(sceneHandler.scenes[SceneType.ENDING])
  );
  sceneHandler.register(SceneEvent.REPLAY, () => {
    opts.game.destroy();
    const game = createAkashicGame();
    const { admin, user } = prepareGame(game);
    let isAdmin = false;
    const handler = createSceneHandler({
      game,
      admin,
      user,
      isMulti: false,
      isAdmin,
      setAdmin: (v) => (isAdmin = v),
      selfId: opts.selfId,
      my: opts.my,
    });
    game.adapter.pushScene(handler.scenes[SceneType.TITLE]);
  });
  modelListener.find(EventType.CREATED, GameStartMessage).register((ev) => {
    if (find(opts.admin.members, (p) => p.id === ev.sender)) {
      sceneHandler.fire(SceneEvent.GAME_STARTED);
    } else {
      // eslint-disable-next-line no-console
      console.warn("user try to start game");
    }
  });
  modelListener.find(EventType.CREATED, GameEndMessage).register((ev) => {
    if (find(opts.admin.members, (p) => p.id === ev.sender)) {
      sceneHandler.fire(SceneEvent.GAME_ENDED);
    } else {
      // eslint-disable-next-line no-console
      console.warn("user try to end game");
    }
  });
  return sceneHandler;
};

export function main(param: GameMainParameterObject): void {
  const game = createAkashicGame();
  const { admin, user } = prepareGame(game);
  const selfId = `${g.game.selfId}`;

  // マルチモードか判定した後ゲームを始めるため、待機用シーンを設定
  const initScene = game.adapter.createScene();
  initScene.loaded.add(() => {
    let waitFrame = 0;
    initScene.update.add(() => {
      if (param.firstJoinedPlayerId || waitFrame > 3) {
        const isMulti = param.firstJoinedPlayerId !== undefined;
        let isAdmin = selfId == param.firstJoinedPlayerId;
        const a = admin.join(param.firstJoinedPlayerId);
        const my = isAdmin ? a : undefined;
        const handler = createSceneHandler({
          game,
          isMulti,
          isAdmin,
          setAdmin: (v) => (isAdmin = v),
          my,
          selfId,
          user,
          admin,
        });
        game.adapter.pushScene(handler.scenes[SceneType.TITLE]);
      }
      waitFrame++;
    });
  });
  game.adapter.pushScene(initScene);
}
