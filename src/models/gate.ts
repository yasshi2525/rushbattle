import { Gate as GateOrg } from "@yasshi2525/rushmini";
import { Reflectable } from "./resolver";
import Station from "./station";

class Gate extends GateOrg implements Reflectable {
  public static COUNT = 1;
  protected readonly _id: number;

  constructor(st: Station) {
    super(st);
    this._id = Gate.COUNT++;
  }

  public get id(): number {
    return this._id;
  }
}

export default Gate;
