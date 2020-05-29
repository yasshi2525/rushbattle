import { LineTask, Train as TrainOrg } from "@yasshi2525/rushmini";

import { Reflectable } from "./resolver";

class Train extends TrainOrg implements Reflectable {
  public static COUNT = 1;
  protected readonly _id: number;

  constructor(current: LineTask) {
    super(current);
    this._id = Train.COUNT++;
  }

  public get id(): number {
    return this._id;
  }
}

export default Train;
