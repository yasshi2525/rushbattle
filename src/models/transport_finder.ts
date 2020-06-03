import {
  DeptTask as DeptTaskOrg,
  EventType,
  LineTask as LineTaskOrg,
  PathFinder,
  RailLine as RailLineOrg,
  Steppable,
  modelListener,
  remove,
} from "@yasshi2525/rushmini";

import DeptTask from "./dept_task";
import Platform from "./platform";
import RailLine from "./rail_line";
import Train from "./train";

class TransportFinder implements Steppable {
  /**
   * 徒歩に比べて鉄道の移動がどれほど優位か
   */
  public static DIST_RATIO = 0.1;
  /**
   * 乗車コスト
   */
  public static RIDE_COST = 1;
  /**
   * 総延長に対する移動距離の割合に対して乗ずる料金
   */
  public static PAY_RATIO = 4;

  public readonly finders: PathFinder[] = [];
  public readonly ls: RailLine[] = [];
  public readonly lts: DeptTask[] = [];
  public readonly ps: Platform[] = [];
  public readonly ts: Train[] = [];

  public currentFinderIdx = 0;
  public currentRailLineIdx = 0;
  public currentDeptTaskIdx = 0;
  public currentTrainIdx = 0;
  public isWaiting = true;

  constructor() {
    modelListener
      .find(EventType.CREATED, Platform)
      .register((p) => this.onCreatedPlatform(p));
    modelListener
      .find(EventType.CREATED, RailLine)
      .register((l) => this.onCreatedRailLine(l));
    modelListener
      .find(EventType.CREATED, DeptTask)
      .register((lt) => this.onCreatedDeptTask(lt));
    modelListener
      .find(EventType.CREATED, Train)
      .register((t) => this.onCreatedTrain(t));
    modelListener
      .find(EventType.DELETED, Platform)
      .register((p) => this.onDeletedPlatform(p));
    modelListener
      .find(EventType.DELETED, RailLine)
      .register((l) => this.onDeletedRailLine(l));
    modelListener
      .find(EventType.DELETED, DeptTask)
      .register((lt) => this.onDeletedDeptTask(lt));
    modelListener
      .find(EventType.DELETED, Train)
      .register((t) => this.onDeletedTrain(t));
  }

  public _step(): void {
    if (this.isFixed()) return;

    if (this.isWaiting) {
      this.finders.forEach((f) => f.unedgeAll());
      this.isWaiting = false;
      return;
    }

    if (this.currentTrainIdx < this.ts.length) {
      this.trainRouting();
      return;
    }

    if (this.currentRailLineIdx < this.ls.length) {
      this.scanRailLine();
      return;
    }

    this.finders[this.currentFinderIdx].execute();
    this.currentFinderIdx++;
    this.currentTrainIdx = 0;
    this.currentRailLineIdx = 0;
  }

  public isFixed(): boolean {
    return !this.isWaiting && this.currentFinderIdx === this.finders.length;
  }

  protected reset(): void {
    this.currentFinderIdx = 0;
    this.currentRailLineIdx = 0;
    this.currentDeptTaskIdx = 0;
    this.currentTrainIdx = 0;
    this.isWaiting = true;
  }

  protected onCreatedPlatform(p: Platform): void {
    this.finders.forEach((f) => f.node(p));
    this.finders.push(new PathFinder(p));
    this.ps.push(p);
    this.reset();
  }

  protected onCreatedRailLine(l: RailLine): void {
    this.ls.push(l);
  }

  protected onCreatedDeptTask(lt: DeptTask): void {
    this.finders.forEach((f) => f.node(lt));
    this.lts.push(lt);
    this.reset();
  }

  protected onCreatedTrain(t: Train): void {
    this.finders.forEach((f) => f.node(t));
    this.ts.push(t);
  }

  protected onDeletedPlatform(p: Platform): void {
    this.finders.forEach((f) => f.unnode(p));
    remove(this.finders, (f) => f.goal.origin === p);
    remove(this.ps, p);
    this.reset();
  }

  protected onDeletedRailLine(l: RailLine): void {
    remove(this.ls, l);
  }

  protected onDeletedDeptTask(lt: DeptTask): void {
    this.finders.forEach((f) => f.unnode(lt));
    remove(this.lts, lt);
    this.reset();
  }

  protected onDeletedTrain(t: Train): void {
    this.finders.forEach((f) => f.unnode(t));
    remove(this.ts, t);
  }

  protected calcPay(length: number, l: RailLineOrg): number {
    return (length / Math.sqrt(l.length())) * TransportFinder.PAY_RATIO;
  }

  /**
   * 電車の現在地点から各駅へのedgeを貼る。
   * これにより、電車が到達可能な駅に対して距離を設定できる
   */
  protected trainRouting(): void {
    const f = this.finders[this.currentFinderIdx];
    const t = this.ts[this.currentTrainIdx];
    let current = t.current()._base();
    let length = current.length();
    do {
      if (current.isDeptTask())
        f.edge(
          t,
          current.stay,
          length * TransportFinder.DIST_RATIO,
          this.calcPay(length, current.parent)
        );
      current = current.next;
      length += current.length();
    } while (t.current()._base() !== current);
    this.currentTrainIdx++;
  }

  /**
   * 前の駅から次の駅までの距離をタスク距離合計とする
   * 乗車プラットフォーム => 発車タスク => 到着プラットフォームとする
   */
  protected scanRailLine(): void {
    const f = this.finders[this.currentFinderIdx];
    const l = this.ls[this.currentRailLineIdx];

    // 各発車タスクを始発とし、電車で到達可能なプラットフォームを登録する
    const dept = l.filter((lt) => lt.isDeptTask())[
      this.currentDeptTaskIdx
    ] as DeptTaskOrg;

    // 乗車タスクとホームは相互移動可能
    f.edge(dept, dept.stay, 0, 0);
    f.edge(dept.stay, dept, 0, 0);

    let current: LineTaskOrg = dept;
    let length = current.length();

    do {
      current = current.next;
      length += current.length();
      if (current.isDeptTask()) {
        // Dept -> P のみ登録する
        // P -> P 接続にしてしまうと乗り換えが必要かどうか分からなくなるため
        f.edge(
          dept,
          current.stay,
          length * TransportFinder.DIST_RATIO + TransportFinder.RIDE_COST,
          this.calcPay(length, l)
        );
      }
    } while (dept !== current);

    this.currentDeptTaskIdx++;
    if (this.currentDeptTaskIdx === l.filter((lt) => lt.isDeptTask()).length) {
      this.currentDeptTaskIdx = 0;
      this.currentRailLineIdx++;
    }
  }
}

export default TransportFinder;
