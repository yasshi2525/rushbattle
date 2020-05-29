import {
  ActionProxy as ActionProxyOrg,
  DeployTrainAction as DeployTrainActionOrg,
  LineTask,
  RailNode as RailNodeOrg,
  StartRailAction as StartRailActionOrg,
  Train as TrainOrg,
} from "@yasshi2525/rushmini";

import RailLine from "./rail_line";
import RailNode from "./rail_node";
import Train from "./train";

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
  protected readonly _line: RailLine;
  constructor() {
    super();
    this._line = new RailLine();
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
