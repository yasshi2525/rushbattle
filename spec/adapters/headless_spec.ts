import { Container, Rectangle, Sprite, Text } from "adapters/adapter";
import { Game, createGame } from "../_helpers/game";

import { JoinMessage } from "events/join";
import { SimpleContainer } from "../_helpers/headless_container";
import { SimpleScene } from "../_helpers/headless_scene";
import Team from "models/team";

describe("headless", () => {
  let game: Game;
  beforeEach(() => {
    game = createGame();
  });
  afterEach(() => {
    game.destroy();
  });

  it("create", () => {
    expect(game).not.toBeUndefined();
    expect(game.adapter).not.toBeUndefined();
    expect(game.adapter.scene).not.toBeUndefined();
  });

  it("shift scene", () => {
    const adapter = game.adapter;
    const scene = adapter.createScene();
    expect(scene).not.toBeUndefined();
    adapter.pushScene(scene);

    game.tick();

    expect(adapter.scene).toBe(scene.original);
  });

  it("entity", () => {
    const adapter = game.adapter;
    const scene = adapter.createScene();
    const container = adapter.createContainer({ scene });
    expect(container).not.toBeUndefined();
    const sprite = adapter.createSprite({ scene, src: "test" });
    expect(sprite).not.toBeUndefined();
    const rect = adapter.createRectangle({ scene, color: "#ffffff" });
    expect(rect).not.toBeUndefined();
    const text = adapter.createText({ scene, fontSize: 30, text: "test" });
    expect(text).not.toBeUndefined();
  });

  it("create container", () => {
    const scene = game.adapter.createScene();
    let container: Container<SimpleScene, SimpleContainer>;
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
    game.tick();
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
    let sprite: Sprite<SimpleScene, SimpleContainer>;
    scene.loaded.add(() => {
      sprite = game.adapter.createSprite({
        scene,
        src: "test",
      });
    });
    game.adapter.pushScene(scene);
    game.tick();
    expect(game.adapter.scene).toBe(scene.original);
    expect(sprite).not.toBeUndefined();
  });

  it("create Text", () => {
    const scene = game.adapter.createScene();
    let text: Text<SimpleScene, SimpleContainer>;
    scene.loaded.add(() => {
      text = game.adapter.createText({
        scene,
        fontSize: 10,
        text: "test",
      });
    });
    game.adapter.pushScene(scene);
    game.tick();
    expect(game.adapter.scene).toBe(scene.original);
    expect(text).not.toBeUndefined();
    expect(text.fontSize).toEqual(10);
    expect(text.text).toEqual("test");
  });

  it("create Rectangle", () => {
    const scene = game.adapter.createScene();
    let rect: Rectangle<SimpleScene, SimpleContainer>;
    scene.loaded.add(() => {
      rect = game.adapter.createRectangle({
        scene,
        color: "ffffff",
      });
    });
    game.adapter.pushScene(scene);
    game.tick();
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

    game.tick();

    expect(Team.handleJoinEvent).toHaveBeenCalled();
  });
});
