import {
  EventType,
  PathFinder,
  Routable,
  distance,
  find,
  modelListener,
  remove,
} from "@yasshi2525/rushmini";

import Company from "./company";
import DeptTask from "./dept_task";
import Gate from "./gate";
import Human from "./human";
import Platform from "./platform";
import Residence from "./residence";

class RouteFinder {
  public readonly finders: PathFinder[] = [];
  public readonly rs: Residence[] = [];
  public readonly cs: Company[] = [];
  public readonly ps: Platform[] = [];
  public readonly gs: Gate[] = [];
  public readonly lts: DeptTask[] = [];
  public readonly hs: Human[] = [];

  public currentFinderIdx = 0;
  public currentPlatformIdx = 0;
  public currentDeptTaskIdx = 0;
  public isWaiting = true;

  public constructor() {
    modelListener
      .find(EventType.CREATED, Residence)
      .register((r) => this.onCreatedResidence(r));
    modelListener
      .find(EventType.CREATED, Company)
      .register((c) => this.onCreatedCompany(c));
    modelListener
      .find(EventType.CREATED, Gate)
      .register((g) => this.onCreatedGate(g));
    modelListener
      .find(EventType.CREATED, Platform)
      .register((p) => this.onCreatedPlatform(p));
    modelListener
      .find(EventType.CREATED, DeptTask)
      .register((lt) => this.onCreatedDeptTask(lt));
    modelListener
      .find(EventType.CREATED, Human)
      .register((h) => this.onCreatedHuman(h));
    modelListener
      .find(EventType.DELETED, Residence)
      .register((r) => this.onDeletedResidence(r));
    modelListener
      .find(EventType.DELETED, Company)
      .register((c) => this.onDeletedCompany(c));
    modelListener
      .find(EventType.DELETED, Gate)
      .register((g) => this.onDeletedGate(g));
    modelListener
      .find(EventType.DELETED, Platform)
      .register((p) => this.onDeletedPlatform(p));
    modelListener
      .find(EventType.DELETED, DeptTask)
      .register((lt) => this.onDeletedDeptTask(lt));
    modelListener
      .find(EventType.DELETED, Human)
      .register((t) => this.onDeletedHuman(t));
  }

  public isFixed(): boolean {
    return !this.isWaiting && this.currentFinderIdx === this.finders.length;
  }

  public _step(): void {
    if (this.isFixed()) return;

    if (this.isWaiting) {
      // 以前の経路探索結果 Dept <=> P を削除
      this.finders.forEach((f) => {
        this.lts.forEach((dept) => {
          f.unnode(dept, true);
          f.node(dept);
          f.edge(dept.stay, dept, 0);
        });
      });
      this.isWaiting = false;
      return;
    }

    if (this.currentPlatformIdx < this.ps.length) {
      this.transport();
      return;
    }

    this.humanRouting();
    this.finders[this.currentFinderIdx].execute();
    this.hs.forEach((h) => h._reroute());
    this.currentFinderIdx++;
    this.currentPlatformIdx = 0;
  }

  public reset(): void {
    this.currentFinderIdx = 0;
    this.currentPlatformIdx = 0;
    this.currentDeptTaskIdx = 0;
    this.isWaiting = true;
  }

  protected onCreatedResidence(r: Residence): void {
    this.finders.forEach((f) => {
      f.node(r);
      // R => all G for each goal
      this.gs.forEach((g) => f.edge(r, g, distance(g, r)));
      f.execute();
    });
    this.rs.push(r);
    this.reset();
  }

  protected onCreatedCompany(c: Company): void {
    const f = new PathFinder(c);

    this.rs.forEach((r) => {
      // all R => all G for the goal
      this.gs.forEach((g) => f.edge(r, g, distance(g, r)));
    });

    this.gs.forEach((g) => {
      // all G => one C for the goal
      f.edge(g, c, distance(c, g));
      // all G <=> G
      this.gs
        .filter((_g) => _g !== g)
        .forEach((_g) => {
          f.edge(_g, g, distance(g, _g));
        });
      // all [G <=> P] for the goal
      g.station.platforms.forEach((p) => {
        f.edge(p, g, distance(g, p));
        f.edge(g, p, distance(p, g));
      });
    });

    this.lts.forEach((lt) => {
      // all P => one lt for the goal
      f.edge(lt.stay, lt, 0);
    });

    // lt => P
    this.ps.forEach((dest) => {
      this.lts.forEach((dept) => {
        let prev: Routable = dept;
        do {
          const next = prev.nextFor(dest);
          if (next) {
            const cost = isNaN(prev.distanceFor(next))
              ? 0
              : prev.distanceFor(next);
            f.edge(prev, next, cost, prev.paymentFor(next));
          }
          prev = next;
        } while (prev && prev !== dest);
      });
    });

    this.finders.push(f);
    this.cs.push(c);
    this.reset();
  }

  protected onCreatedGate(g: Gate): void {
    this.finders.forEach((f) => {
      f.node(g);

      // all R => G for each goal
      this.rs.forEach((r) => f.edge(r, g, distance(g, r)));

      // G => one C for each goal
      const c = find(this.cs, (_c) => _c === f.goal.origin);
      f.edge(g, c, distance(g, c));

      // all G <=> G
      this.gs.forEach((_g) => {
        f.edge(_g, g, distance(g, _g));
        f.edge(g, _g, distance(_g, g));
      });

      // G <=> P for each goal
      g.station.platforms.forEach((p) => {
        f.edge(p, g, distance(g, p));
        f.edge(g, p, distance(p, g));
      });
    });

    this.gs.push(g);
    this.reset();
  }

  protected onCreatedPlatform(p: Platform): void {
    this.finders.forEach((f) => {
      f.node(p);

      // G <=> P for each goal
      const g = p.station.gate;
      f.edge(p, g, distance(g, p));
      f.edge(g, p, distance(p, g));
    });

    this.ps.push(p);
    this.reset();
  }

  protected onCreatedDeptTask(lt: DeptTask): void {
    this.finders.forEach((f) => f.node(lt));
    this.lts.push(lt);
    this.reset();
  }

  protected onCreatedHuman(h: Human): void {
    this.hs.push(h);
  }

  protected onDeletedResidence(r: Residence): void {
    this.finders.forEach((f) => {
      this.gs.forEach((g) => f.unedge(r, g));
      f.unnode(r, true);
    });
    remove(this.rs, r);
    this.reset();
  }

  protected onDeletedCompany(c: Company): void {
    remove(this.finders, (f) => f.goal.origin === c);
    remove(this.cs, c);
    this.reset();
  }

  protected onDeletedGate(g: Gate): void {
    this.finders.forEach((f) => {
      this.rs.forEach((r) => f.unedge(r, g));
      f.unedge(
        g,
        find(this.cs, (c) => f.goal.origin === c)
      );
      this.gs.forEach((_g) => {
        f.unedge(g, _g);
        f.unedge(_g, g);
      });
      g.station.platforms.forEach((p) => {
        f.unedge(p, g);
        f.unedge(g, p);
      });
      f.unnode(g, true);
    });
    remove(this.gs, g);
    this.reset();
  }

  protected onDeletedPlatform(p: Platform): void {
    this.finders.forEach((f) => {
      f.unedge(p, p.station.gate);
      f.unedge(p.station.gate, p);
      f.unnode(p, true);
    });
    remove(this.ps, p);
    this.reset();
  }

  protected onDeletedDeptTask(lt: DeptTask): void {
    this.finders.forEach((f) => {
      f.unnode(lt, true);
    });
    remove(this.lts, lt);
    this.reset();
  }

  protected onDeletedHuman(h: Human): void {
    remove(this.hs, h);
  }

  protected transport(): void {
    const f = this.finders[this.currentFinderIdx];
    const dest = this.ps[this.currentPlatformIdx];
    const dept = this.lts[this.currentDeptTaskIdx];

    let prev: Routable = dept;
    do {
      const next = prev.nextFor(dest);
      if (next) {
        const cost = isNaN(prev.distanceFor(next)) ? 0 : prev.distanceFor(next);
        f.edge(prev, next, cost, prev.paymentFor(next));
      }
      prev = next;
    } while (prev && prev !== dest);

    this.currentDeptTaskIdx++;
    if (this.currentDeptTaskIdx === this.lts.length) {
      this.currentDeptTaskIdx = 0;
      this.currentPlatformIdx++;
    }
  }

  /**
   * 改札内にいるため、改札(出場)かホームへのみ移動可能
   * @param f
   * @param h
   */
  protected _tryLinkGate(f: PathFinder, h: Human): boolean {
    if (h._getGate()) {
      const g = h._getGate();
      f.edge(h, g, distance(g, h));
      g.station.platforms.forEach((p) => f.edge(h, p, distance(p, h)));
      return true;
    }
    return false;
  }

  /**
   * ホーム内にいるため、ホームか、改札へのみ移動可能
   * @param f
   * @param h
   */
  protected _tryLinkPlatform(f: PathFinder, h: Human): boolean {
    if (h._getPlatform()) {
      const p = h._getPlatform();
      const g = p.station.gate;
      f.edge(h, p, distance(p, h));
      f.edge(h, g, distance(h, g));
      return true;
    }
    return false;
  }

  /**
   * 乗車列にいる場合、乗車列か改札へのみ移動可能
   * @param f
   * @param h
   */
  protected _tryLinkDeptTask(f: PathFinder, h: Human): boolean {
    if (h._getDeptTask()) {
      const dept = h._getDeptTask();

      f.edge(h, dept, distance(dept.stay, h));
      f.edge(h, dept.stay, distance(dept.stay, h));
      return true;
    }
    return false;
  }

  /**
   * 車内にいる場合は、電車が経路探索結果を持っているため、それに接続する
   * @param f
   * @param h
   */
  protected _tryLinkTrain(f: PathFinder, h: Human): boolean {
    if (h._getTrain()) {
      const t = h._getTrain();
      this.ps.forEach((dest) => {
        // 単一路線のため、電車は全駅に必ず到達可能
        f.edge(h, dest, t.distanceFor(dest), t.paymentFor(dest));
      });
      return true;
    }
    return false;
  }

  /**
   * 地面にいる場合、改札か会社に移動可能
   * @param f
   * @param h
   */
  protected _tryLinkGround(f: PathFinder, h: Human): boolean {
    const c = f.goal.origin;
    this.gs.forEach((_g) => {
      f.edge(h, _g, distance(_g, h));
    });
    f.edge(h, c, distance(h.destination, h));
    return true;
  }

  protected humanRouting(): void {
    const f = this.finders[this.currentFinderIdx];
    this.hs
      .filter((h) => h.destination === f.goal.origin)
      .forEach((h) => {
        f.unnode(h, true);
        f.node(h);

        if (!this._tryLinkGate(f, h))
          if (!this._tryLinkPlatform(f, h))
            if (!this._tryLinkDeptTask(f, h))
              if (!this._tryLinkTrain(f, h)) this._tryLinkGround(f, h);
      });
  }
}

export default RouteFinder;
