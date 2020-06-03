import { EventType, modelListener } from "@yasshi2525/rushmini";
import { Game, createGame } from "../_helpers/game";

import Railway from "models/railway";
import TransportFinder from "models/transport_finder";

describe("transport_finder", () => {
  let game: Game;
  let railway: Railway;
  beforeEach(() => {
    game = createGame();
    railway = game.createTeam("test").railway;
  });

  afterEach(() => {
    game.destroy();
  });

  it("capture model", () => {
    const inst = new TransportFinder();
    expect(inst.isWaiting).toBeTruthy();
    railway.action.createLine();
    modelListener.fire(EventType.CREATED);
    expect(inst.ls.length).toEqual(1);

    railway.action.startRail(0, 0);
    railway.action.buildStation();
    railway.action.startLine();
    railway.action.deployTrain(railway.action.line().top);
    modelListener.fire(EventType.CREATED);
    expect(inst.finders.length).toEqual(1);
    expect(inst.ps.length).toEqual(1);
    expect(inst.lts.length).toEqual(1);
    expect(inst.ts.length).toEqual(1);

    railway.action.extendRail(100, 100);
    railway.action.insertEdge();
    railway.action.extendRail(200, 200);
    railway.action.buildStation();
    railway.action.insertEdge();
    modelListener.fire(EventType.CREATED);
    expect(inst.finders.length).toEqual(2);
    expect(inst.ps.length).toEqual(2);
    expect(inst.lts.length).toEqual(2);
    expect(inst.ts.length).toEqual(1);

    railway.action.rollback();
    modelListener.fire(EventType.DELETED);
    expect(inst.finders.length).toEqual(0);
    expect(inst.ps.length).toEqual(0);
    expect(inst.lts.length).toEqual(0);
    expect(inst.ts.length).toEqual(0);
  });

  it("step", () => {
    const inst = new TransportFinder();
    railway.action.createLine();
    railway.action.startRail(0, 0);
    railway.action.buildStation();
    railway.action.startLine();
    railway.action.deployTrain(railway.action.line().top);
    railway.action.extendRail(100, 100);
    railway.action.insertEdge();
    railway.action.extendRail(200, 200);
    railway.action.buildStation();
    railway.action.insertEdge();
    modelListener.fire(EventType.CREATED);

    inst._step(); // unedge
    expect(inst.currentFinderIdx).toEqual(0);
    expect(inst.currentTrainIdx).toEqual(0);
    expect(inst.currentRailLineIdx).toEqual(0);
    expect(inst.currentDeptTaskIdx).toEqual(0);
    expect(inst.isFixed()).toBeFalsy();
    expect(inst.isWaiting).toBeFalsy();

    inst._step();
    expect(inst.currentFinderIdx).toEqual(0);
    expect(inst.currentTrainIdx).toEqual(1);
    expect(inst.currentRailLineIdx).toEqual(0);
    expect(inst.currentDeptTaskIdx).toEqual(0);
    expect(inst.isFixed()).toBeFalsy();
    expect(inst.isWaiting).toBeFalsy();

    inst._step();
    expect(inst.currentFinderIdx).toEqual(0);
    expect(inst.currentTrainIdx).toEqual(1);
    expect(inst.currentRailLineIdx).toEqual(0);
    expect(inst.currentDeptTaskIdx).toEqual(1);
    expect(inst.isFixed()).toBeFalsy();
    expect(inst.isWaiting).toBeFalsy();

    inst._step();
    expect(inst.currentFinderIdx).toEqual(0);
    expect(inst.currentTrainIdx).toEqual(1);
    expect(inst.currentRailLineIdx).toEqual(1);
    expect(inst.currentDeptTaskIdx).toEqual(0);
    expect(inst.isFixed()).toBeFalsy();
    expect(inst.isWaiting).toBeFalsy();

    inst._step();
    expect(inst.currentFinderIdx).toEqual(1);
    expect(inst.currentTrainIdx).toEqual(0);
    expect(inst.currentRailLineIdx).toEqual(0);
    expect(inst.currentDeptTaskIdx).toEqual(0);
    expect(inst.isFixed()).toBeFalsy();
    expect(inst.isWaiting).toBeFalsy();

    inst._step();
    expect(inst.currentFinderIdx).toEqual(1);
    expect(inst.currentTrainIdx).toEqual(1);
    expect(inst.currentRailLineIdx).toEqual(0);
    expect(inst.currentDeptTaskIdx).toEqual(0);
    expect(inst.isFixed()).toBeFalsy();
    expect(inst.isWaiting).toBeFalsy();

    inst._step();
    expect(inst.currentFinderIdx).toEqual(1);
    expect(inst.currentTrainIdx).toEqual(1);
    expect(inst.currentRailLineIdx).toEqual(0);
    expect(inst.currentDeptTaskIdx).toEqual(1);
    expect(inst.isFixed()).toBeFalsy();
    expect(inst.isWaiting).toBeFalsy();

    inst._step();
    expect(inst.currentFinderIdx).toEqual(1);
    expect(inst.currentTrainIdx).toEqual(1);
    expect(inst.currentRailLineIdx).toEqual(1);
    expect(inst.currentDeptTaskIdx).toEqual(0);
    expect(inst.isFixed()).toBeFalsy();
    expect(inst.isWaiting).toBeFalsy();

    inst._step();
    expect(inst.currentFinderIdx).toEqual(2);
    expect(inst.currentTrainIdx).toEqual(0);
    expect(inst.currentRailLineIdx).toEqual(0);
    expect(inst.currentDeptTaskIdx).toEqual(0);
    expect(inst.isFixed()).toBeTruthy();
    expect(inst.isWaiting).toBeFalsy();

    modelListener.fire(EventType.CREATED);
    modelListener.fire(EventType.DELETED);
    expect(inst.isWaiting).toBeFalsy();

    railway.action.rollback();
    modelListener.fire(EventType.DELETED);
    expect(inst.isWaiting).toBeTruthy();
  });
});
