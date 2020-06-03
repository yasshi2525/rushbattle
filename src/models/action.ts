import {
  ActionProxy as ActionProxyOrg,
  DeployTrainAction as DeployTrainActionOrg,
  LineTask,
  RailNode as RailNodeOrg,
  StartRailAction as StartRailActionOrg,
  Train as TrainOrg,
  Transactional,
} from "@yasshi2525/rushmini";

import RailLine from "./rail_line";
import RailNode from "./rail_node";
import Train from "./train";

class StartLineAction implements Transactional {
  protected readonly prevLine: RailLine;
  protected readonly rollbackFn: (l: RailLine) => void;
  protected l: RailLine;

  constructor(prevLine: RailLine, rollbackFn: (l: RailLine) => void) {
    this.prevLine = prevLine;
    this.rollbackFn = rollbackFn;
  }

  public act() {
    this.l = new RailLine();
    return this.l;
  }

  public rollback() {
    this.rollbackFn(this.prevLine);
    this.l._remove();
  }
}

class StartRailAction extends StartRailActionOrg {
  public act(x: number, y: number): RailNodeOrg {
    this.rn = new RailNode(x, y);
    return this.rn;
  }
}

class DeployTrainAction extends DeployTrainActionOrg {
  public act(lt: LineTask): TrainOrg {
    const t = new Train(lt);
    this.t = t;
    return t;
  }
}

class ActionProxy extends ActionProxyOrg {
  protected _line: RailLine;
  constructor() {
    super();
    this._line = undefined;
  }

  public createLine(): void {
    const action = new StartLineAction(
      this._line,
      (prevLine) => (this._line = prevLine)
    );
    this._line = action.act();
    this.actions.push(action);
  }

  public startRail(x: number, y: number): void {
    const action = new StartRailAction(
      this._tailNode,
      (prevTail) => (this._tailNode = prevTail)
    );
    this._tailNode = action.act(x, y);
    this.actions.push(action);
  }
  public deployTrain(lt: LineTask): void {
    const action = new DeployTrainAction();
    action.act(lt);
    this.actions.push(action);
  }
}

export default ActionProxy;
