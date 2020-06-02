import { Scene, ServiceAdapter } from "../adapters/adapter";

import Team from "../models/team";
import { find } from "@yasshi2525/rushmini";

export type CreateGameSceneOption<T, C> = {
  isMulti: boolean;
  isAdmin: boolean;
  selfId: string;
  team: Team;
  adapter: ServiceAdapter<T, C>;
  reset: () => void;
  end: () => void;
};

export const createGameScene = <T, C>(
  opts: CreateGameSceneOption<T, C>
): Scene<T, C> => {
  const scene = opts.adapter.createScene();
  scene.loaded.add(() => {
    scene.append(
      opts.adapter.createText({
        scene,
        text: find(opts.team.members, (p) => p.name == opts.selfId)
          ? "ゲーム中"
          : "観戦中",
        fontSize: 50,
        x: 100,
        y: 100,
      })
    );
    if (opts.isMulti) {
      if (opts.isAdmin) {
        scene.append(
          opts.adapter.createText({
            scene,
            text: "ゲーム打ち切り(放送者限定)※デバッグ用",
            fontSize: 30,
            x: 200,
            y: 400,
          })
        );
        const button = opts.adapter.createRectangle({
          scene,
          local: true,
          color: "#ff0000",
          x: 300,
          y: 450,
          width: 200,
          height: 100,
          touchable: true,
        });
        button.pointUp.add(() => opts.end());
        scene.append(button);
      }
    } else {
      scene.append(
        opts.adapter.createText({
          scene,
          text: "タイトルに戻る(アツマール限定)",
          fontSize: 30,
          x: 200,
          y: 400,
        })
      );
      const button = opts.adapter.createRectangle({
        scene,
        local: true,
        color: "#00ff00",
        x: 300,
        y: 450,
        width: 200,
        height: 100,
        touchable: true,
      });
      button.pointUp.add(() => opts.reset());
      scene.append(button);
    }
  });
  return scene;
};
