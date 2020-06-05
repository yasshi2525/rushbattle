import {
  EventType,
  Human as HumanOrg,
  LineTask,
  find,
  modelListener,
} from "@yasshi2525/rushmini";
import { Game, createGame } from "../_helpers/game";

import Company from "models/company";
import DeptTask from "models/dept_task";
import Gate from "models/gate";
import Human from "models/human";
import { HumanState } from "@yasshi2525/rushmini/lib/models/human";
import Platform from "models/platform";
import RailNode from "models/rail_node";
import Railway from "models/railway";
import Residence from "models/residence";
import RouteFinder from "models/route_finder";
import Train from "models/train";
import TransportFinder from "models/transport_finder";

const FPS = 15;

beforeAll(() => {
  Game.FPS = 15;
  HumanOrg.RAND = 0;
});

describe("route_finder", () => {
  let game: Game;
  let railway: Railway;
  let rangeRand: (min: number, max: number) => number;

  describe("no transfer", () => {
    beforeEach(() => {
      game = createGame();
      railway = game.createTeam("test").railway;
      rangeRand = (min, max) => min + game.rand() * (max - min);
    });

    afterEach(() => {
      game.destroy();
    });

    it("city, then user", () => {
      const trans = new TransportFinder();
      const route = new RouteFinder();

      const c = new Company(1, 9, 12);
      const r = new Residence([c], 0, 0, rangeRand);

      railway.action.createLine();
      railway.action.startRail(3, 4);
      railway.action.buildStation();
      railway.action.startLine();
      railway.action.extendRail(6, 8);
      railway.action.buildStation();
      railway.action.insertEdge();

      modelListener.fire(EventType.CREATED);
      while (!trans.isFixed()) trans._step();

      expect(route.isFixed()).toBeFalsy();
      expect(route.isWaiting).toBeTruthy();
      expect(route.currentFinderIdx).toEqual(0);
      expect(route.currentPlatformIdx).toEqual(0);
      expect(route.currentDeptTaskIdx).toEqual(0);

      route._step(); // unregister
      expect(route.isFixed()).toBeFalsy();
      expect(route.isWaiting).toBeFalsy();
      expect(route.currentFinderIdx).toEqual(0);
      expect(route.currentPlatformIdx).toEqual(0);
      expect(route.currentDeptTaskIdx).toEqual(0);

      route._step();
      expect(route.isFixed()).toBeFalsy();
      expect(route.isWaiting).toBeFalsy();
      expect(route.currentFinderIdx).toEqual(0);
      expect(route.currentPlatformIdx).toEqual(0);
      expect(route.currentDeptTaskIdx).toEqual(1);

      route._step();
      expect(route.isFixed()).toBeFalsy();
      expect(route.isWaiting).toBeFalsy();
      expect(route.currentFinderIdx).toEqual(0);
      expect(route.currentPlatformIdx).toEqual(1);
      expect(route.currentDeptTaskIdx).toEqual(0);

      route._step();
      expect(route.isFixed()).toBeFalsy();
      expect(route.isWaiting).toBeFalsy();
      expect(route.currentFinderIdx).toEqual(0);
      expect(route.currentPlatformIdx).toEqual(1);
      expect(route.currentDeptTaskIdx).toEqual(1);

      route._step();
      expect(route.isFixed()).toBeFalsy();
      expect(route.isWaiting).toBeFalsy();
      expect(route.currentFinderIdx).toEqual(0);
      expect(route.currentPlatformIdx).toEqual(2);
      expect(route.currentDeptTaskIdx).toEqual(0);

      route._step();
      expect(route.isFixed()).toBeTruthy();
      expect(route.isWaiting).toBeFalsy();
      expect(route.currentFinderIdx).toEqual(1);
      expect(route.currentPlatformIdx).toEqual(0);
      expect(route.currentDeptTaskIdx).toEqual(0);

      const dept1 = railway.action.line().top;
      const p1 = dept1.departure().platform;
      const g1 = p1.station.gate;
      const dept2 = dept1.next.next;
      const p2 = dept2.departure().platform;
      const g2 = p2.station.gate;

      expect(r.nextFor(c)).toEqual(g1);
      expect(g1.nextFor(c)).toEqual(p1);
      expect(p1.nextFor(c)).toEqual(dept1);
      expect(dept1.nextFor(c)).toEqual(p2);
      expect(p2.nextFor(c)).toEqual(g2);
      expect(g2.nextFor(c)).toEqual(c);

      const cost = (5 / Math.sqrt(10)) * 4;

      expect(r.paymentFor(c)).toBeCloseTo(cost);
      expect(g1.paymentFor(c)).toBeCloseTo(cost);
      expect(p1.paymentFor(c)).toBeCloseTo(cost);
      expect(dept1.paymentFor(c)).toBeCloseTo(cost);
      expect(p2.paymentFor(c)).toEqual(0);
      expect(g2.paymentFor(c)).toEqual(0);
    });

    it("user, then city", () => {
      const trans = new TransportFinder();
      const route = new RouteFinder();

      railway.action.createLine();
      railway.action.startRail(3, 4);
      railway.action.buildStation();
      railway.action.startLine();
      railway.action.extendRail(6, 8);
      railway.action.buildStation();
      railway.action.insertEdge();

      const c = new Company(1, 9, 12);
      const r = new Residence([c], 0, 0, rangeRand);

      modelListener.fire(EventType.CREATED);
      while (!trans.isFixed()) trans._step();
      while (!route.isFixed()) route._step();

      const dept1 = railway.action.line().top;
      const p1 = dept1.departure().platform;
      const g1 = p1.station.gate;
      const dept2 = dept1.next.next;
      const p2 = dept2.departure().platform;
      const g2 = p2.station.gate;

      expect(r.nextFor(c)).toEqual(g1);
      expect(g1.nextFor(c)).toEqual(p1);
      expect(p1.nextFor(c)).toEqual(dept1);
      expect(dept1.nextFor(c)).toEqual(p2);
      expect(p2.nextFor(c)).toEqual(g2);
      expect(g2.nextFor(c)).toEqual(c);
    });

    it("residence add", () => {
      const trans = new TransportFinder();
      const route = new RouteFinder();

      const c = new Company(1, 9, 12);
      new Residence([c], 0, 0, rangeRand);
      modelListener.fire(EventType.CREATED);
      while (!trans.isFixed()) trans._step();
      while (!route.isFixed()) route._step();

      railway.action.createLine();
      railway.action.startRail(3, 4);
      railway.action.buildStation();
      railway.action.startLine();
      railway.action.extendRail(6, 8);
      railway.action.buildStation();
      railway.action.insertEdge();

      const r2 = new Residence([c], 0, 0, rangeRand);
      modelListener.fire(EventType.CREATED);

      expect(route.isWaiting).toBeTruthy();
      expect(route.isFixed()).toBeFalsy();

      while (!trans.isFixed()) trans._step();
      while (!route.isFixed()) route._step();

      const dept1 = railway.action.line().top;
      const p1 = dept1.departure().platform;
      const g1 = p1.station.gate;
      const dept2 = dept1.next.next;
      const p2 = dept2.departure().platform;
      const g2 = p2.station.gate;

      expect(r2.nextFor(c)).toEqual(g1);
      expect(g1.nextFor(c)).toEqual(p1);
      expect(p1.nextFor(c)).toEqual(dept1);
      expect(dept1.nextFor(c)).toEqual(p2);
      expect(p2.nextFor(c)).toEqual(g2);
      expect(g2.nextFor(c)).toEqual(c);
    });

    it("human who move to company seeks to gate", () => {
      const trans = new TransportFinder();
      const route = new RouteFinder();

      const c = new Company(1, 12, 15);
      const r = new Residence([c], 0, 0, rangeRand);
      modelListener.fire(EventType.CREATED);
      const h = new Human(r, c, rangeRand);
      modelListener.fire(EventType.CREATED);
      expect(h.nextFor(c)).toBeUndefined();

      railway.action.createLine();
      railway.action.startRail(3, 4);
      railway.action.buildStation();
      railway.action.startLine();
      railway.action.extendRail(6, 8);
      railway.action.buildStation();
      railway.action.insertEdge();
      modelListener.fire(EventType.CREATED);

      const dept1 = railway.action.line().top;
      const p1 = dept1.departure().platform;
      const g1 = p1.station.gate;

      while (!trans.isFixed()) trans._step();
      while (!route.isFixed()) route._step();

      expect(h.nextFor(c)).toEqual(g1);
      expect(h._getNext()).toEqual(g1);
      const prev = h.loc();
      h._step();
      expect(h._getNext()).toEqual(g1);
      expect(h.loc()).not.toEqual(prev);
    });

    it("reroute after delete", () => {
      const trans = new TransportFinder();
      const route = new RouteFinder();

      const c = new Company(1, 12, 15);
      const r = new Residence([c], 0, 0, rangeRand);
      const h = new Human(r, c, rangeRand);
      modelListener.fire(EventType.CREATED);

      railway.action.createLine();
      railway.action.startRail(3, 4);
      railway.action.buildStation();
      const g1 = railway.action.tail().platform.station.gate;
      railway.action.startLine();
      railway.action.extendRail(6, 8);
      railway.action.buildStation();
      railway.action.insertEdge();
      railway.action.commit();
      railway.action.extendRail(9, 12);
      railway.action.buildStation();
      railway.action.insertEdge();
      modelListener.fire(EventType.CREATED);

      while (!trans.isFixed()) trans._step();
      while (!route.isFixed()) route._step();

      railway.action.rollback();
      modelListener.fire(EventType.DELETED);

      while (!trans.isFixed()) trans._step();
      while (!route.isFixed()) route._step();

      // 今回、直接会社への移動を禁止したため、鉄道がないと到達不能になる
      // 到達不能な場合、経路が更新されない仕様。
      // 今回鉄道がなくなることはないので問題なし
      expect(r.nextFor(c)).toBe(g1);
      expect(h.nextFor(c)).toBe(g1);
    });

    it("human reroute", () => {
      const trans = new TransportFinder();
      const route = new RouteFinder();

      const c = new Company(1, 30, 40);
      const r = new Residence([c], 0, 0, rangeRand);

      railway.action.createLine();
      railway.action.startRail(0, 0);
      railway.action.buildStation();
      railway.action.startLine();
      railway.action.deployTrain(railway.action.line().top);
      railway.action.extendRail(30, 40);
      railway.action.buildStation();
      railway.action.insertEdge();
      modelListener.fire(EventType.CREATED);

      while (!trans.isFixed()) trans._step();
      while (!route.isFixed()) route._step();

      const dept1 = railway.action.line().top;
      const p1 = dept1.departure().platform;
      const g1 = p1.station.gate;
      const dept2 = dept1.next.next;
      const p2 = dept2.departure().platform;

      const onGround = new Human(r, c, rangeRand);
      expect(onGround.state()).toEqual(HumanState.SPAWNED);
      expect(onGround._getGate()).toBeUndefined();

      const onGate = new Human(r, c, rangeRand);
      onGate._step();
      for (let i = 0; i < FPS / Gate.MOBILITY_SEC; i++) g1._step();

      expect(onGate.state()).toEqual(HumanState.WAIT_ENTER_PLATFORM);
      expect(onGate._getGate()).toEqual(g1);

      const onPlatform = new Human(r, c, rangeRand);
      onPlatform._step();
      for (let i = 0; i < FPS / Gate.MOBILITY_SEC; i++) g1._step();
      onPlatform._step();

      expect(onPlatform.state()).toEqual(HumanState.WAIT_ENTER_DEPTQUEUE);
      expect(onPlatform._getPlatform()).toEqual(p1);

      const onDept = new Human(r, c, rangeRand);
      onDept._step();
      for (let i = 0; i < FPS / Gate.MOBILITY_SEC; i++) g1._step();
      onDept._step();
      onDept._step();

      expect(onDept.state()).toEqual(HumanState.WAIT_TRAIN_ARRIVAL);
      expect(onDept._getDeptTask()).toEqual(dept1);

      modelListener.fire(EventType.CREATED);
      modelListener.fire(EventType.MODIFIED);

      route.reset();
      while (!route.isFixed()) route._step();

      expect(onGround.nextFor(c)).toEqual(g1);
      expect(onGate.nextFor(c)).toEqual(p1);
      expect(onPlatform.nextFor(c)).toEqual(p1);
      expect(onDept.nextFor(c)).toEqual(dept1);
      const t = find(
        game.resolver.list(Train),
        (t) => t.current()._base() == dept1
      );

      for (let i = 0; i < FPS * Train.STAY_SEC - 1; i++) {
        t._step();
        expect(t.current()._base()).toEqual(dept1);
        expect(t.loc()).toEqual(p1.loc());
      }
      t._step();
      expect(t.current()._base()).toEqual(dept1.next);
      expect(t.loc()).toEqual(p1.loc());
      t._step();
      expect(t.current()._base()).toEqual(dept1.next);
      expect(t.loc()).not.toEqual(p1.loc());
      expect(t.loc()).not.toEqual(p2.loc());
      modelListener.fire(EventType.MODIFIED);
      expect(onDept.state()).toEqual(HumanState.ON_TRAIN);
      expect(onDept._getTrain()).toEqual(t);

      route.reset();
      while (!route.isFixed()) route._step();

      expect(onDept.nextFor(c)).toEqual(p2);
    });
  });

  /**
   * rn1 -> rn2 -> rnX -> rn2 -> rn3 とあるとき
   * rn1 -> rn2 -> rn3 となる経路を導き出せるか
   */
  describe("transfer", () => {
    let r: Residence;
    let c: Company;
    let rn1: RailNode;
    let rn2: RailNode;
    let rn3: RailNode;
    let rnX: RailNode;
    let g1: Gate;
    let g3: Gate;
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
      rangeRand = (min, max) => min + game.rand() * (max - min);
      const trans = new TransportFinder();
      const route = new RouteFinder();
      c = new Company(1, 100, 0);
      r = new Residence([c], 0, 0, rangeRand);

      railway.action.createLine();
      railway.action.startRail(0, 0);
      railway.action.buildStation();
      railway.action.startLine();
      railway.action.deployTrain(railway.action.line().top);
      modelListener.fire(EventType.CREATED);

      rn1 = game.resolver.list(RailNode)[0];
      p1 = rn1.platform as Platform;
      g1 = p1.station.gate as Gate;

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
      g3 = p3.station.gate as Gate;

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
        (t) => t.current()._base() === dept12
      );
      while (!trans.isFixed()) trans._step();
      while (!route.isFixed()) route._step();
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
      expect(pX.on).toEqual(rnX);

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

      expect(t).not.toBeUndefined();
    });

    it("transfer route", () => {
      expect(r.nextFor(c)).toEqual(g1);
      expect(g1.nextFor(c)).toEqual(p1);
      expect(p1.nextFor(c)).toEqual(dept12);
      expect(dept12.nextFor(c)).toEqual(p2);
      expect(p2.nextFor(c)).toEqual(dept23);
      expect(dept23.nextFor(p3)).toEqual(p3);
      expect(p3.nextFor(c)).toEqual(g3);
      expect(g3.nextFor(c)).toEqual(c);
    });

    it("human transfer train", () => {
      const h = new Human(r, c, (min, max) => {
        return rangeRand(min, max);
      });
      expect(h.loc()).toEqual(r.loc());
      h._step();
      expect(h.state()).toEqual(HumanState.WAIT_ENTER_GATE);
      expect(h._getNext()).toEqual(g1);
      g1._step();
      expect(h.state()).toEqual(HumanState.WAIT_ENTER_PLATFORM);
      expect(h._getNext()).toEqual(p1);
      h._step();
      expect(h.state()).toEqual(HumanState.WAIT_ENTER_DEPTQUEUE);
      expect(h._getNext()).toEqual(dept12);
      h._step();
      expect(h.state()).toEqual(HumanState.WAIT_TRAIN_ARRIVAL);
      expect(h._getNext()).toEqual(dept12);
      for (let i = 0; i < FPS * Train.STAY_SEC - 1; i++) {
        t._step();
        expect(h.state()).toEqual(HumanState.ON_TRAIN);
        expect(h._getNext()).toEqual(p2);
        expect(t.current()._base()).toEqual(dept12);
      }
      for (let i = 0; i < (FPS * 50) / Train.SPEED; i++) {
        t._step();
        expect(h.state()).toEqual(HumanState.ON_TRAIN);
        expect(h._getNext()).toEqual(p2);
        expect(t.current()._base()).toEqual(move12);
      }
      for (let i = 0; i < FPS * Train.STAY_SEC; i++) {
        t._step();
        expect(h._getPlatform()).toEqual(p2);
        expect(h._getNext()).toEqual(p2);
        expect(h.state()).toEqual(HumanState.WAIT_EXIT_PLATFORM);
        expect(t.current()._base()).toEqual(dept2X);
      }
      h._step();
      expect(h.state()).toEqual(HumanState.WAIT_ENTER_PLATFORM);
      expect(h._getNext()).toEqual(p2);
      h._step();
      expect(h.state()).toEqual(HumanState.WAIT_ENTER_DEPTQUEUE);
      expect(h._getNext()).toEqual(dept23);
      h._step();
      expect(h.state()).toEqual(HumanState.WAIT_TRAIN_ARRIVAL);
      expect(h._getNext()).toEqual(dept23);
    });
  });
});
