import { GameMainParameterObject, RPGAtsumaruWindow } from "./parameterObject";

import { main } from "./main";

declare const window: RPGAtsumaruWindow;

export = (originalParam: g.GameMainParameterObject) => {
  const param: { [index: string]: unknown } = {};
  Object.keys(originalParam).forEach((key) => {
    param[key] = (originalParam as { [index: string]: unknown })[key];
  });
  // セッションパラメーター
  param.sessionParameter = {};
  // コンテンツが動作している環境がRPGアツマール上かどうか
  param.isAtsumaru =
    typeof window !== "undefined" && typeof window.RPGAtsumaru !== "undefined";
  // 乱数生成器
  param.random = g.game.random;

  const limitTickToWait = 3; // セッションパラメーターが来るまでに待つtick数

  const scene = new g.Scene({
    game: g.game,
  });
  // joinイベントを受け取る
  g.game.join.addOnce((ev) => {
    param.firstJoinedPlayerId = `${ev.player.id}`;
  });
  // セッションパラメーターを受け取ってゲームを開始します
  scene.message.add((msg) => {
    if (msg.data && msg.data.type === "start" && msg.data.parameters) {
      param.sessionParameter = msg.data.parameters; // sessionParameterフィールドを追加
      if (msg.data.parameters.randomSeed != null) {
        param.random = new g.XorshiftRandomGenerator(
          msg.data.parameters.randomSeed
        );
      }
      g.game.popScene();
      main(param as GameMainParameterObject);
    }
  });
  scene.loaded.add(() => {
    let currentTickCount = 0;
    scene.update.add(function () {
      currentTickCount++;
      // 待ち時間を超えた場合はゲームを開始します
      if (currentTickCount > limitTickToWait) {
        g.game.popScene();
        main(param as GameMainParameterObject);
      }
    });
  });
  g.game.pushScene(scene);
};
