import { Scene, ServiceAdapter } from "../adapters/adapter";

export type CreateTitleSceneOption<T, C> = {
  isMulti: boolean;
  isAdmin: boolean;
  adapter: ServiceAdapter<T, C>;
  onStart: () => void;
  onJoin: () => void;
  onLocalStartAsAdmin: () => void;
  onLocalStartAsUser: () => void;
};

export const createTitleScene = <T, C>(
  opts: CreateTitleSceneOption<T, C>
): Scene<T, C> => {
  const scene = opts.adapter.createScene();
  scene.loaded.add(() => {
    scene.append(
      opts.adapter.createText({
        scene,
        text: "出勤のお時間です！バトルモード★",
        fontSize: 45,
        x: 50,
        y: 100,
      })
    );
    if (opts.isMulti) {
      if (opts.isAdmin) {
        scene.append(
          opts.adapter.createText({
            scene,
            text: "参加受付をやめ、ゲームを開始する(放送者限定)",
            fontSize: 30,
            x: 50,
            y: 300,
          })
        );
        const startButton = opts.adapter.createRectangle({
          scene,
          local: true,
          x: 100,
          y: 400,
          width: 200,
          height: 100,
          color: "#ff0000",
          touchable: true,
        });
        startButton.pointUp.add(() => {
          startButton.color = "#000000";
          startButton.touchable = false;
          startButton.modified();
          opts.onStart();
        });
        scene.append(startButton);
      } else {
        const instruction = opts.adapter.createText({
          scene,
          text: "参加する(リスナー限定)",
          fontSize: 30,
          x: 50,
          y: 300,
        });
        scene.append(instruction);
        const joinButton = opts.adapter.createRectangle({
          scene,
          local: true,
          x: 500,
          y: 400,
          width: 200,
          height: 100,
          color: "#0000ff",
          touchable: true,
        });
        joinButton.pointUp.add(() => {
          joinButton.color = "#000000";
          joinButton.touchable = false;
          joinButton.modified();
          instruction.text = "放送者が開始するまでお待ち下さい";
          instruction.modified();
          opts.onJoin();
        });
        scene.append(joinButton);
      }
    } else {
      scene.append(
        opts.adapter.createText({
          scene,
          text: "←管理者として開始　ユーザとして開始→(アツマール限定)",
          fontSize: 25,
          x: 50,
          y: 300,
        })
      );
      const joinAsAdminButton = opts.adapter.createRectangle({
        scene,
        local: true,
        x: 100,
        y: 400,
        width: 200,
        height: 100,
        color: "#ff0000",
        touchable: true,
      });
      joinAsAdminButton.pointUp.add(() => {
        joinAsAdminButton.color = "#000000";
        joinAsAdminButton.touchable = false;
        joinAsAdminButton.modified();
        opts.onLocalStartAsAdmin();
      });
      scene.append(joinAsAdminButton);
      const joinAsUserButton = opts.adapter.createRectangle({
        scene,
        local: true,
        x: 500,
        y: 400,
        width: 200,
        height: 100,
        color: "#0000ff",
        touchable: true,
      });
      joinAsUserButton.pointUp.add(() => {
        joinAsUserButton.color = "#000000";
        joinAsUserButton.touchable = false;
        joinAsUserButton.modified();
        opts.onLocalStartAsUser();
      });
      scene.append(joinAsUserButton);
    }
  });

  return scene;
};
