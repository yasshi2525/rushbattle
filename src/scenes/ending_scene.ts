import { Scene, ServiceAdapter } from "../adapters/adapter";

export type CreateEndingSceneOption<T, C> = {
  isMulti: boolean;
  isAdmin: boolean;
  adapter: ServiceAdapter<T, C>;
  regame: () => void;
};

export const createEndingScene = <T, C>(
  opts: CreateEndingSceneOption<T, C>
): Scene<T, C> => {
  const scene = opts.adapter.createScene();
  scene.loaded.add(() => {
    scene.append(
      opts.adapter.createText({
        scene,
        text: "ゲーム終了、勝敗は XXX でした",
        fontSize: 45,
        x: 100,
        y: 100,
      })
    );
    if (opts.isMulti) {
      scene.append(
        opts.adapter.createText({
          scene,
          text: "生放送モードなので、これで終わりです。",
          fontSize: 30,
          x: 200,
          y: 400,
        })
      );
    } else {
      scene.append(
        opts.adapter.createText({
          scene,
          text: "もう一度遊ぶ(アツマールモードのみ有効)",
          fontSize: 30,
          x: 200,
          y: 400,
        })
      );
      const button = opts.adapter.createRectangle({
        scene,
        local: true,
        color: "#ff0000",
        x: 600,
        y: 400,
        width: 100,
        height: 100,
        touchable: true,
      });
      button.pointUp.add(() => opts.regame());
      scene.append(button);
    }
  });
  return scene;
};
