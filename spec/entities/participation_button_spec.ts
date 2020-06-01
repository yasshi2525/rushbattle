import { createGame, startAkashicGame } from "../_helpers/akashic";

import AkashicAdapter from "adapters/akashic";
import AkashicRectangle from "adapters/akashic_rectangle";
import { AkashicSceneType } from "adapters/akashic_scene";
import Game from "models/game";
import ParticipationButton from "entities/participation_button";
import { RunnerV2 } from "@akashic/headless-driver";

describe("participation_button", () => {
  let runner: RunnerV2;
  let akashic: g.Game;
  let adapter: AkashicAdapter;
  let game: Game<g.Scene, g.E>;
  let scene: AkashicSceneType;
  let button: ParticipationButton<g.Scene, g.E>;
  let pointDownCounter: number;
  let pointUpCounter: number;

  beforeEach(async () => {
    pointDownCounter = 0;
    pointUpCounter = 0;
    const r = await startAkashicGame();
    runner = r.runner;
    game = createGame({ game: r.game });
    adapter = game.adapter as AkashicAdapter;
    akashic = adapter.game;
    scene = adapter.createScene();
    scene.loaded.add(() => {
      button = new ParticipationButton(adapter, scene);
      button.entity.pointDown.add(() => {
        pointDownCounter++;
      });
      button.entity.pointUp.add(() => {
        pointUpCounter++;
      });
      scene.append(button.entity);
    });
    adapter.pushScene(scene);
    akashic.tick(false);
    expect(akashic.scene()).toBe(scene.original);
  });

  afterEach(() => {
    runner.stop();
    game.destroy();
  });

  it("初期状態 = ACTIVE_COLOR", () => {
    expect(button.entity).not.toBeUndefined();
    expect(button.entity).toBeInstanceOf(AkashicRectangle);
    expect(button.entity.color).toEqual(ParticipationButton.ACTIVE_COLOR);
    expect(button.entity.visible()).toBeTruthy();
    expect(pointDownCounter).toEqual(0);
    expect(pointUpCounter).toEqual(0);
  });

  it("ボタンを押している間色がPRESSED_COLORに変化", () => {
    button.entity.pointDown.fire({
      local: true,
      player: { id: "test" },
      point: { x: 0, y: 0 },
      pointerId: 1,
      target: button.entity.original,
    });
    expect(button.entity.color).toEqual(ParticipationButton.PRESSED_COLOR);
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
      target: button.entity.original,
    });
    button.entity.pointUp.fire({
      local: true,
      player: { id: "test" },
      point: { x: 0, y: 0 },
      startDelta: { x: 0, y: 0 },
      prevDelta: { x: 0, y: 0 },
      pointerId: 1,
      target: button.entity.original,
    });
    expect(button.entity.color).toEqual(ParticipationButton.INACTIVE_COLOR);
    expect(button.entity.visible()).toBeTruthy();
    expect(pointDownCounter).toEqual(1);
    expect(pointUpCounter).toEqual(1);
  });

  it("一度ボタンを押したら操作不能", () => {
    expect(button.entity.touchable).toBeTruthy();
    button.entity.pointDown.fire({
      local: true,
      player: { id: "test" },
      point: { x: 0, y: 0 },
      pointerId: 1,
      target: button.entity.original,
    });
    expect(button.entity.touchable).toBeTruthy();
    button.entity.pointUp.fire({
      local: true,
      player: { id: "test" },
      point: { x: 0, y: 0 },
      startDelta: { x: 0, y: 0 },
      prevDelta: { x: 0, y: 0 },
      pointerId: 1,
      target: button.entity.original,
    });
    expect(button.entity.touchable).toBeFalsy();
  });

  it("マルチタッチ禁止", () => {
    button.entity.pointDown.fire({
      local: true,
      player: { id: "test" },
      point: { x: 0, y: 0 },
      pointerId: 1,
      target: button.entity.original,
    });
    button.entity.pointUp.fire({
      local: true,
      player: { id: "test" },
      point: { x: 0, y: 0 },
      startDelta: { x: 0, y: 0 },
      prevDelta: { x: 0, y: 0 },
      pointerId: 2,
      target: button.entity.original,
    });
    expect(button.entity.color).toEqual(ParticipationButton.PRESSED_COLOR);
  });
});
