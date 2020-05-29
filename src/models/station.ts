import Gate from "./gate";
import { Reflectable } from "./resolver";
import { Station as StationOrg } from "@yasshi2525/rushmini";

class Station extends StationOrg implements Reflectable {
  public static COUNT = 1;
  protected readonly _id: number;
  public readonly gate: Gate;
  constructor() {
    super();
    this.gate = new Gate(this);
    this._id = Station.COUNT++;
  }

  public get id(): number {
    return this._id;
  }
}

export default Station;
