import { EventType, LineTask, find, modelListener } from "@yasshi2525/rushmini";
import { Game, createGame } from "../_helpers/game";

import DeptTask from "models/dept_task";
import Platform from "models/platform";
import RailNode from "models/rail_node";
import Railway from "models/railway";
import Train from "models/train";
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

  describe("no transfer", () => {
    let game: Game;
    let railway: Railway;
    beforeEach(() => {
      game = createGame();
      railway = game.createTeam("test").railway;
    });
    afterEach(() => {
      game.destroy();
    });

    it("init", () => {
      const inst = new TransportFinder();

      railway.action.createLine();
      railway.action.startRail(0, 0);
      railway.action.buildStation();
      railway.action.startLine();
      railway.action.extendRail(3, 4);
      railway.action.buildStation();
      railway.action.insertEdge();
      modelListener.fire(EventType.CREATED);

      const dept1 = railway.action.line().top;
      const p1 = dept1.departure().platform;
      const dept2 = dept1.next.next as DeptTask;
      const p2 = dept2.departure().platform;

      const cost = (5 / Math.sqrt(10)) * 4;

      expect(inst.isFixed()).toBeFalsy();
      expect(inst.isWaiting).toBeTruthy();
      while (!inst.isFixed()) inst._step();
      expect(inst.isFixed()).toBeTruthy();
      expect(inst.isWaiting).toBeFalsy();

      expect(p1.nextFor(p2)).toEqual(dept1);
      expect(p1.distanceFor(p2)).toEqual(1.5);
      expect(p1.paymentFor(p2)).toBeCloseTo(cost);
      expect(p1.nextFor(p1)).toEqual(dept1);
      expect(p1.distanceFor(p1)).toEqual(0);
      expect(p1.paymentFor(p1)).toEqual(0);

      expect(dept1.nextFor(p1)).toEqual(p1);
      expect(dept1.distanceFor(p1)).toEqual(0);
      expect(dept1.paymentFor(p1)).toEqual(0);
      expect(dept1.nextFor(p2)).toEqual(p2);
      expect(dept1.distanceFor(p2)).toEqual(1.5); // 乗車 +1
      expect(dept1.paymentFor(p2)).toBeCloseTo(cost);

      expect(p2.nextFor(p1)).toEqual(dept2);
      expect(p2.distanceFor(p1)).toEqual(1.5); // 乗車 +1
      expect(p2.paymentFor(p1)).toBeCloseTo(cost);
      expect(p2.nextFor(p2)).toEqual(dept2);
      expect(p2.distanceFor(p2)).toEqual(0);
      expect(p2.paymentFor(p2)).toEqual(0);

      expect(dept2.nextFor(p1)).toEqual(p1);
      expect(dept2.distanceFor(p1)).toEqual(1.5); // 乗車 +1
      expect(dept2.paymentFor(p1)).toBeCloseTo(cost);
      expect(dept2.nextFor(p2)).toEqual(p2);
      expect(dept2.distanceFor(p2)).toEqual(0);
      expect(dept2.paymentFor(p2)).toEqual(0);
    });

    it("train", () => {
      const inst = new TransportFinder();

      railway.action.createLine();
      railway.action.startRail(0, 0);
      railway.action.buildStation();
      railway.action.startLine();
      railway.action.deployTrain(railway.action.line().top);
      railway.action.extendRail(3, 4);
      railway.action.buildStation();
      railway.action.insertEdge();
      railway.action.commit();
      modelListener.fire(EventType.CREATED);

      expect(inst.isFixed()).toBeFalsy();
      expect(inst.isWaiting).toBeTruthy();
      while (!inst.isFixed()) inst._step();
      expect(inst.isFixed()).toBeTruthy();
      expect(inst.isWaiting).toBeFalsy();

      const dept1 = railway.action.line().top;
      const p1 = dept1.departure().platform;
      const dept2 = dept1.next.next as DeptTask;
      const p2 = dept2.departure().platform;

      const t = find(
        game.resolver.list(Train),
        (t) => t.current()._base() === railway.action.line().top
      );

      const cost = (5 / Math.sqrt(10)) * 4;

      expect(t.nextFor(p1)).toEqual(p1);
      expect(t.nextFor(p2)).toEqual(p2);
      expect(t.distanceFor(p1)).toEqual(0);
      expect(t.distanceFor(p2)).toEqual(0.5);
      expect(t.paymentFor(p1)).toEqual(0);
      expect(t.paymentFor(p2)).toBeCloseTo(cost);

      for (let i = 0; i < game.fps * Train.STAY_SEC; i++) t._step();
      expect(t.current()._base()).toEqual(dept1.next);

      inst.reset();

      expect(inst.isFixed()).toBeFalsy();
      expect(inst.isWaiting).toBeTruthy();
      while (!inst.isFixed()) inst._step();
      expect(inst.isFixed()).toBeTruthy();
      expect(inst.isWaiting).toBeFalsy();

      expect(t.nextFor(p1)).toEqual(p1);
      expect(t.nextFor(p2)).toEqual(p2);
      expect(t.distanceFor(p1)).toEqual(1);
      expect(t.distanceFor(p2)).toEqual(0.5);
      expect(t.paymentFor(p1)).toBeCloseTo(cost * 2);
      expect(t.paymentFor(p2)).toBeCloseTo(cost);
    });
  });

  /**
   * rn1 -> rn2 -> rnX -> rn2 -> rn3 とあるとき
   * rn1 -> rn2 -> rn3 となる経路を導き出せるか
   */
  describe("transfer", () => {
    let game: Game;
    let railway: Railway;
    let inst: TransportFinder;

    let rn1: RailNode;
    let rn2: RailNode;
    let rn3: RailNode;
    let rnX: RailNode;
    let p1: Platform;
    let p2: Platform;
    let p3: Platform;
    let pX: Platform;
    let dept12: DeptTask;
    let move12: LineTask;
    let dept2X: DeptTask;
    let move2X: LineTask;
    let deptX2: DeptTask;
    let moveX2: LineTask;
    let dept23: DeptTask;
    let move23: LineTask;
    let dept32: DeptTask;
    let move32: LineTask;
    let dept21: DeptTask;
    let move21: LineTask;
    let t: Train;

    beforeEach(() => {
      game = createGame();
      railway = game.createTeam("test").railway;
      inst = new TransportFinder();

      railway.action.createLine();
      railway.action.startRail(0, 0);
      railway.action.buildStation();
      railway.action.startLine();
      railway.action.deployTrain(railway.action.line().top);
      modelListener.fire(EventType.CREATED);

      rn1 = game.resolver.list(RailNode)[0];
      p1 = rn1.platform as Platform;

      railway.action.extendRail(50, 0);
      railway.action.insertEdge();
      modelListener.fire(EventType.CREATED);

      rn2 = game.resolver.list(RailNode)[1];

      railway.action.extendRail(100, 0);
      railway.action.buildStation();
      railway.action.insertEdge();
      modelListener.fire(EventType.CREATED);

      rn3 = game.resolver.list(RailNode)[2];
      p3 = rn3.platform as Platform;

      railway.action.buildStation(rn2);
      railway.action.insertPlatform(rn2.platform);
      modelListener.fire(EventType.CREATED);

      p2 = rn2.platform as Platform;

      railway.action.startBranch(p2);
      railway.action.extendRail(50, -50);
      railway.action.buildStation();
      railway.action.insertEdge();
      modelListener.fire(EventType.CREATED);

      rnX = game.resolver.list(RailNode)[3];
      pX = rnX.platform as Platform;
      dept12 = railway.action.line().top as DeptTask;
      move12 = dept12.next;
      dept2X = move12.next as DeptTask;
      move2X = dept2X.next;
      deptX2 = move2X.next as DeptTask;
      moveX2 = deptX2.next;
      dept23 = moveX2.next as DeptTask;
      move23 = dept23.next;
      dept32 = move23.next as DeptTask;
      move32 = dept32.next;
      dept21 = move32.next as DeptTask;
      move21 = dept21.next;

      t = find(
        game.resolver.list(Train),
        (t) => t.current()._base() === railway.action.line().top
      );

      while (!inst.isFixed()) inst._step();
    });

    afterEach(() => {
      game.destroy();
    });

    it("model check", () => {
      expect(rn1.loc().x).toEqual(0);
      expect(rn1.loc().y).toEqual(0);
      expect(rn2.loc().x).toEqual(50);
      expect(rn2.loc().y).toEqual(0);
      expect(rn3.loc().x).toEqual(100);
      expect(rn3.loc().y).toEqual(0);
      expect(rnX.loc().x).toEqual(50);
      expect(rnX.loc().y).toEqual(-50);
      expect(p1.on).toEqual(rn1);
      expect(p2.on).toEqual(rn2);
      expect(p3.on).toEqual(rn3);

      expect(dept12.stay).toEqual(p1);
      expect(move12.departure()).toEqual(rn1);
      expect(move12.destination()).toEqual(rn2);
      expect(dept2X.stay).toEqual(p2);
      expect(move2X.departure()).toEqual(rn2);
      expect(move2X.destination()).toEqual(rnX);
      expect(deptX2.stay).toEqual(pX);
      expect(moveX2.departure()).toEqual(rnX);
      expect(moveX2.destination()).toEqual(rn2);
      expect(dept23.stay).toEqual(p2);
      expect(move23.departure()).toEqual(rn2);
      expect(move23.destination()).toEqual(rn3);
      expect(dept32.stay).toEqual(p3);
      expect(move32.departure()).toEqual(rn3);
      expect(move32.destination()).toEqual(rn2);
      expect(dept21.stay).toEqual(p2);
      expect(move21.departure()).toEqual(rn2);
      expect(move21.destination()).toEqual(rn1);
      expect(move21.next).toEqual(dept12);
    });

    it("transfer by p2", () => {
      expect(dept12.nextFor(p1)).toEqual(p1);
      expect(dept12.nextFor(p2)).toEqual(p2);
      expect(dept12.nextFor(p3)).toEqual(p2);
      expect(dept12.nextFor(pX)).toEqual(pX);
      expect(dept12.distanceFor(p1)).toEqual(0);
      expect(dept12.distanceFor(p2)).toEqual(6); // 乗車
      expect(dept12.distanceFor(p3)).toEqual(12); // 乗車+乗り換え
      expect(dept12.distanceFor(pX)).toEqual(11); // 乗車

      expect(dept2X.nextFor(p1)).toEqual(p2);
      expect(dept2X.nextFor(p2)).toEqual(p2);
      expect(dept2X.nextFor(p3)).toEqual(p2);
      expect(dept2X.nextFor(pX)).toEqual(pX);
      expect(dept2X.distanceFor(p1)).toEqual(6); // 乗車
      expect(dept2X.distanceFor(p2)).toEqual(0);
      expect(dept2X.distanceFor(p3)).toEqual(6); // 乗車
      expect(dept2X.distanceFor(pX)).toEqual(6); // 乗車

      expect(deptX2.nextFor(p1)).toEqual(p2);
      expect(deptX2.nextFor(p2)).toEqual(p2);
      expect(deptX2.nextFor(p3)).toEqual(p3);
      expect(deptX2.nextFor(pX)).toEqual(pX);
      expect(deptX2.distanceFor(p1)).toEqual(12); // 乗車+乗り換え
      expect(deptX2.distanceFor(p2)).toEqual(6); // 乗車
      expect(deptX2.distanceFor(p3)).toEqual(11); // 乗車
      expect(deptX2.distanceFor(pX)).toEqual(0);

      expect(dept23.nextFor(p1)).toEqual(p2);
      expect(dept23.nextFor(p2)).toEqual(p2);
      expect(dept23.nextFor(p3)).toEqual(p3);
      expect(dept23.nextFor(pX)).toEqual(p2);
      expect(dept23.distanceFor(p1)).toEqual(6); // 乗車
      expect(dept23.distanceFor(p2)).toEqual(0);
      expect(dept23.distanceFor(p3)).toEqual(6); // 乗車
      expect(dept23.distanceFor(pX)).toEqual(6); // 乗車

      expect(dept32.nextFor(p1)).toEqual(p1);
      expect(dept32.nextFor(p2)).toEqual(p2);
      expect(dept32.nextFor(p3)).toEqual(p3);
      expect(dept32.nextFor(pX)).toEqual(p2);
      expect(dept32.distanceFor(p1)).toEqual(11); // 乗車
      expect(dept32.distanceFor(p2)).toEqual(6); // 乗車
      expect(dept32.distanceFor(p3)).toEqual(0);
      expect(dept32.distanceFor(pX)).toEqual(12); // 乗車+乗り換え

      expect(dept21.nextFor(p1)).toEqual(p1);
      expect(dept21.nextFor(p2)).toEqual(p2);
      expect(dept21.nextFor(p3)).toEqual(p2);
      expect(dept21.nextFor(pX)).toEqual(p2);
      expect(dept21.distanceFor(p1)).toEqual(6); // 乗車
      expect(dept21.distanceFor(p2)).toEqual(0);
      expect(dept21.distanceFor(p3)).toEqual(6); // 乗車
      expect(dept21.distanceFor(pX)).toEqual(6); // 乗車
    });
    it("train", () => {
      expect(t.nextFor(p1)).toEqual(p1);
      expect(t.nextFor(p2)).toEqual(p2);
      expect(t.nextFor(p3)).toEqual(p2);
      expect(t.nextFor(pX)).toEqual(pX);
      expect(t.distanceFor(p1)).toEqual(0);
      expect(t.distanceFor(p2)).toEqual(5);
      expect(t.distanceFor(p3)).toEqual(11); // 乗り換え必要のため +1
      expect(t.distanceFor(pX)).toEqual(10);
    });
  });
});
