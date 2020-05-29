import AkashicAdapter from "./adapters/akashic";
import Game from "./models/game";
import { JoinMessage } from "./events/join";
import { RPGAtsumaruWindow } from "./parameterObject";
import createStartScene from "./scenes/start";

declare const window: RPGAtsumaruWindow;

export function main(/* param: GameMainParameterObject */): void {
  const scene = new g.Scene({ game: g.game });
  g.game.vars.gameState = { score: 0 };

  const game = new Game({
    adapter: new AkashicAdapter({
      game: g.game,
      main: "start",
      sceneMapper: {
        start: createStartScene(g.game),
      },
    }),
  });
  const admin = game.createTeam("admin");
  const user = game.createTeam("user");

  scene.loaded.add(() => {
    let cnt = 0;

    scene.message.add((ev) => {
      scene.append(
        new g.SystemLabel({
          scene,
          x: 50,
          y: 30 + cnt * 50,
          fontSize: 20,
          text: JSON.stringify(ev.data),
        })
      );
      cnt++;
    });
    const btn = new g.FilledRect({
      local: true,
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      scene,
      cssColor: "#000000",
      touchable: true,
      hidden: true,
    });
    btn.pointDown.add(() => {
      btn.cssColor = "#ff0000";
      btn.modified();
    });
    btn.pointUp.add(() => {
      btn.cssColor = "#000000";
      btn.modified();
      game.send(new JoinMessage({ team: user.id, user: g.game.selfId }));
    });
    scene.append(btn);

    g.game.join.addOnce((ev) => {
      admin.join(ev.player.id);
      if (ev.player.id != `${g.game.selfId}`) {
        btn.show();
      }
    });
  });
  g.game.pushScene(scene);
}
