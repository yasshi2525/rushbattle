import AkashicAdapter from "./adapters/akashic";
import Game from "./models/game";
import { JoinMessage } from "./events/join";
import { RPGAtsumaruWindow } from "./parameterObject";

declare const window: RPGAtsumaruWindow;

export function main(/* param: GameMainParameterObject */): void {
  const adapter = new AkashicAdapter({ game: g.game });
  const game = new Game({ adapter });
  g.game.vars.gameState = { score: 0 };

  const admin = game.createTeam("admin");
  const user = game.createTeam("user");
  let cnt = 0;
  const scene = adapter.createScene();

  scene.loaded.add(() => {
    scene.message.add((ev) => {
      scene.append(
        adapter.createText({
          scene: scene,
          x: 50,
          y: 30 + cnt * 30,
          width: 100,
          height: 50,
          fontSize: 20,
          text: JSON.stringify(ev.data),
        })
      );
      cnt++;
    });
    const btn = adapter.createRectangle({
      scene: scene,
      local: true,
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      color: "#ff0000",
      touchable: true,
    });
    btn.pointDown.add(() => {
      btn.color = "#880000";
      btn.modified();
    });
    btn.pointUp.add(() => {
      btn.color = "#000000";
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
  adapter.pushScene(scene);
}
