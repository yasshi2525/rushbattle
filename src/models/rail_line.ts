import { Platform, RailLine as RailLineOrg } from "@yasshi2525/rushmini";

import DeptTask from "./dept_task";
import { Reflectable } from "./resolver";

class RailLine extends RailLineOrg implements Reflectable {
  public static COUNT = 1;
  protected readonly _id: number;

  constructor() {
    super();
    this._id = RailLine.COUNT++;
  }

  get id(): number {
    return this._id;
  }

  public _start(platform: Platform): void {
    this.top = new DeptTask(this, platform);
  }
}

export default RailLine;
