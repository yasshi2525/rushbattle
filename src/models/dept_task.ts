import {
  DeptTask as DeptTaskOrg,
  LineTask,
  Platform,
  RailEdge,
  RailLine,
} from "@yasshi2525/rushmini";

import { Reflectable } from "./resolver";
import { _createTask } from "./line_task_utils";

class DeptTask extends DeptTaskOrg implements Reflectable {
  public static COUNT = 1;
  protected readonly _id: number;

  constructor(parent: RailLine, stay: Platform, prev?: LineTask) {
    super(parent, stay, prev);
    this._id = DeptTask.COUNT++;
  }

  public get id(): number {
    return this._id;
  }

  public _insertEdge(edge: RailEdge): void {
    const next = this.next;
    const inbound = _createTask(this, edge);
    if (inbound) {
      if (this !== next) {
        const dept = new DeptTask(this.parent, this.stay, inbound);
        dept.next = next;
        next.prev = dept;
      } else {
        inbound.next = next;
        next.prev = inbound;
      }
    }
  }
}

export default DeptTask;
