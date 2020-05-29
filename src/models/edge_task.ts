import {
  EdgeTask as EdgeTaskOrg,
  LineTask,
  Platform,
  RailEdge,
  RailLine,
} from "@yasshi2525/rushmini";

import DeptTask from "./dept_task";
import { Reflectable } from "./resolver";

class EdgeTask extends EdgeTaskOrg implements Reflectable {
  public static COUNT = 1;
  protected readonly _id: number;

  constructor(parent: RailLine, edge: RailEdge, prev: LineTask) {
    super(parent, edge, prev);
    this._id = EdgeTask.COUNT++;
  }

  public get id(): number {
    return this._id;
  }

  public _insertPlatform(platform: Platform): void {
    const next = this.next;
    const dept = new DeptTask(this.parent, platform, this);
    dept.next = next;
  }
}

export default EdgeTask;
