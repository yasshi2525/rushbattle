import { RailEdge as RailEdgeOrg, RailNode } from "@yasshi2525/rushmini";

import { Reflectable } from "./resolver";

class RailEdge extends RailEdgeOrg implements Reflectable {
  public static COUNT = 1;
  protected readonly _id: number;

  constructor(from: RailNode, to: RailNode, isOutbounds: boolean) {
    super(from, to, isOutbounds);
    this._id = RailEdge.COUNT++;
  }

  public get id(): number {
    return this._id;
  }
}

export default RailEdge;
