import { Container, Rectangle, Sprite, Text } from "adapters/adapter";
import { createGame, startAkashicGame } from "../_helpers/akashic";

import AkashicAdapter from "adapters/akashic";
import Game from "models/game";
import { JoinMessage } from "events/join";
import { RunnerV2 } from "@akashic/headless-driver";
import Team from "models/team";

describe("akashic", () => {
  let runner: RunnerV2;
  let game: Game<g.Scene, g.E>;
  beforeEach(async () => {
    const r = await startAkashicGame();
    runner = r.runner;
    game = createGame({ game: r.game });
  });

  afterEach(() => {
    runner.stop();
    game.destroy();
  });

  it("init", () => {
    expect(game.adapter).toBeInstanceOf(AkashicAdapter);
  });

  it("shift scene by clock", async () => {
    const scene = game.adapter.createScene();
    game.adapter.pushScene(scene);

    // eslint-disable-next-line es/no-promise
    await new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });

    expect(game.adapter.scene).toBe(scene.original);
  });

  it("shift scene by force", async () => {
    const scene = game.adapter.createScene();
    game.adapter.pushScene(scene);

    const akashic = (game.adapter as AkashicAdapter).game;
    akashic.tick(false);
    expect(game.adapter.scene).toBe(scene.original);
  });

  it("create container", () => {
    const scene = game.adapter.createScene();
    let container: Container<g.Scene, g.E>;
    scene.loaded.add(() => {
      container = game.adapter.createContainer({
        scene,
        anchorX: 0.1,
        anchorY: 0.2,
        angle: 0.3,
        height: 0.4,
        hidden: true,
        local: true,
        opacity: 0.5,
        scaleX: 0.6,
        scaleY: 0.7,
        touchable: true,
        width: 0.8,
        x: 0.9,
        y: 1.0,
      });
    });
    game.adapter.pushScene(scene);
    const akashic = (game.adapter as AkashicAdapter).game;
    akashic.tick(false);
    expect(game.adapter.scene).toBe(scene.original);
    expect(container).not.toBeUndefined();
    expect(container.scene).toBe(scene.original);
    expect(container.anchorX).toEqual(0.1);
    expect(container.anchorY).toEqual(0.2);
    expect(container.angle).toEqual(0.3);
    expect(container.height).toEqual(0.4);
    expect(container.visible()).toEqual(false);
    expect(container.local).toEqual(true);
    expect(container.opacity).toEqual(0.5);
    expect(container.scaleX).toEqual(0.6);
    expect(container.scaleY).toEqual(0.7);
    expect(container.touchable).toEqual(true);
    expect(container.width).toEqual(0.8);
    expect(container.x).toEqual(0.9);
    expect(container.y).toEqual(1.0);
  });

  it("create Sprite", () => {
    const scene = game.adapter.createScene();
    let sprite: Sprite<g.Scene, g.E>;
    scene.loaded.add(() => {
      sprite = game.adapter.createSprite({
        scene,
        src: "test",
      });
    });
    game.adapter.pushScene(scene);
    const akashic = (game.adapter as AkashicAdapter).game;
    akashic.tick(false);
    expect(game.adapter.scene).toBe(scene.original);
    expect(sprite).not.toBeUndefined();
  });

  it("create Text", () => {
    const scene = game.adapter.createScene();
    let text: Text<g.Scene, g.E>;
    scene.loaded.add(() => {
      text = game.adapter.createText({
        scene,
        fontSize: 10,
        text: "test",
      });
    });
    game.adapter.pushScene(scene);
    const akashic = (game.adapter as AkashicAdapter).game;
    akashic.tick(false);
    expect(game.adapter.scene).toBe(scene.original);
    expect(text).not.toBeUndefined();
    expect(text.fontSize).toEqual(10);
    expect(text.text).toEqual("test");
  });

  it("create Rectangle", () => {
    const scene = game.adapter.createScene();
    let rect: Rectangle<g.Scene, g.E>;
    scene.loaded.add(() => {
      rect = game.adapter.createRectangle({
        scene,
        color: "ffffff",
      });
    });
    game.adapter.pushScene(scene);
    const akashic = (game.adapter as AkashicAdapter).game;
    akashic.tick(false);
    expect(game.adapter.scene).toBe(scene.original);
    expect(rect).not.toBeUndefined();
    expect(rect.color).toEqual("ffffff");
  });

  it("receive message", async () => {
    const activeScene = game.adapter.createScene();
    Team.handleJoinEvent = jest.fn();
    activeScene.loaded.add(() => {
      game.send(new JoinMessage({ team: 9999, user: "testXXX" }));
    });
    game.adapter.pushScene(activeScene);

    // eslint-disable-next-line es/no-promise
    await new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });

    expect(Team.handleJoinEvent).toHaveBeenCalled();
  });
});
