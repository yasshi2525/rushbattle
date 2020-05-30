import {
  createAkashicRunner,
  createGameWithAkashic,
} from "../_helpers/akashic";

import AkashicAdapter from "adapters/akashic";
import Game from "models/game";
import ParticipationButton from "entities/participation_button";
import { RunnerV2 } from "@akashic/headless-driver";

describe("participation_button", () => {
  let runner: RunnerV2;
  let akashic: g.Game;
  let adapter: AkashicAdapter;
  let game: Game;
  let scene: g.Scene;
  let button: ParticipationButton;
  let pointDownCounter: number;
  let pointUpCounter: number;
  beforeEach(async () => {
    pointDownCounter = 0;
    pointUpCounter = 0;
    runner = await createAkashicRunner();
    game = await createGameWithAkashic({
      runner,
      main: "main",
      sceneMapGenerator: (game) => {
        scene = new g.Scene({ game });
        scene.loaded.add(() => {
          button = new ParticipationButton(scene);
          button.entity.pointDown.add(() => {
            pointDownCounter++;
          });
          button.entity.pointUp.add(() => {
            pointUpCounter++;
          });
          scene.append(button.entity);
        });
        return { main: scene };
      },
    });
    adapter = game.adapter as AkashicAdapter;
    akashic = adapter.game;
    adapter.scene = "main";
    akashic.tick(false);
    expect(akashic.scene()).toBe(scene);
  });

  afterEach(() => {
    runner.stop();
    game.destroy();
  });

  it("初期状態 = ACTIVE_COLOR", () => {
    expect(button.entity).not.toBeUndefined();
    expect(button.entity).toBeInstanceOf(g.E);
    expect(button.entity.cssColor).toEqual(ParticipationButton.ACTIVE_COLOR);
    expect(button.entity.visible()).toBeTruthy();
    expect(pointDownCounter).toEqual(0);
    expect(pointUpCounter).toEqual(0);
    expect(akashic.scene().children.length).toBeGreaterThan(0);
    expect(akashic.scene().children[0]).toBe(button.entity);
  });

  it("ボタンを押している間色がPRESSED_COLORに変化", () => {
    button.entity.pointDown.fire({
      local: true,
      player: { id: "test" },
      point: { x: 0, y: 0 },
      pointerId: 1,
      priority: 2,
      target: button.entity,
      type: g.EventType.PointDown,
    });
    expect(button.entity.cssColor).toEqual(ParticipationButton.PRESSED_COLOR);
    expect(button.entity.visible()).toBeTruthy();
    expect(pointDownCounter).toEqual(1);
    expect(pointUpCounter).toEqual(0);
  });

  it("ボタンを離すと色がINACTIVE_COLORに変化", () => {
    button.entity.pointDown.fire({
      local: true,
      player: { id: "test" },
      point: { x: 0, y: 0 },
      pointerId: 1,
      priority: 2,
      target: button.entity,
      type: g.EventType.PointDown,
    });
    button.entity.pointUp.fire({
      local: true,
      player: { id: "test" },
      point: { x: 0, y: 0 },
      startDelta: { x: 0, y: 0 },
      prevDelta: { x: 0, y: 0 },
      pointerId: 1,
      priority: 2,
      target: button.entity,
      type: g.EventType.PointUp,
    });
    expect(button.entity.cssColor).toEqual(ParticipationButton.INACTIVE_COLOR);
    expect(button.entity.visible()).toBeTruthy();
    expect(pointDownCounter).toEqual(1);
    expect(pointUpCounter).toEqual(1);
  });

  it("一度ボタンを押したら操作不能", () => {
    button.entity.pointDown.fire({
      local: true,
      player: { id: "test" },
      point: { x: 0, y: 0 },
      pointerId: 1,
      priority: 2,
      target: button.entity,
      type: g.EventType.PointDown,
    });
    expect(button.entity.touchable).toBeTruthy();
    button.entity.pointUp.fire({
      local: true,
      player: { id: "test" },
      point: { x: 0, y: 0 },
      startDelta: { x: 0, y: 0 },
      prevDelta: { x: 0, y: 0 },
      pointerId: 1,
      priority: 2,
      target: button.entity,
      type: g.EventType.PointUp,
    });
    expect(button.entity.touchable).toBeFalsy();
  });

  it("マルチタッチ禁止", () => {
    button.entity.pointDown.fire({
      local: true,
      player: { id: "test" },
      point: { x: 0, y: 0 },
      pointerId: 1,
      priority: 2,
      target: button.entity,
      type: g.EventType.PointDown,
    });
    button.entity.pointUp.fire({
      local: true,
      player: { id: "test" },
      point: { x: 0, y: 0 },
      startDelta: { x: 0, y: 0 },
      prevDelta: { x: 0, y: 0 },
      pointerId: 2,
      priority: 2,
      target: button.entity,
      type: g.EventType.PointUp,
    });
    expect(button.entity.cssColor).toEqual(ParticipationButton.PRESSED_COLOR);
  });
});
