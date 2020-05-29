import Platform from "./platform";
import RailEdge from "./rail_edge";
import { RailNode as RailNodeOrg } from "@yasshi2525/rushmini";
import { Reflectable } from "./resolver";
import Station from "./station";

class RailNode extends RailNodeOrg implements Reflectable {
  public static COUNT = 1;
  protected readonly _id: number;
  constructor(x: number, y: number) {
    super(x, y);
    this._id = RailNode.COUNT++;
  }

  public get id(): number {
    return this._id;
  }

  public _extend(x: number, y: number): RailEdge {
    const tail = new RailNode(x, y);
    const outE = new RailEdge(this, tail, true);
    const inE = new RailEdge(tail, this, false);
    outE.reverse = inE;
    inE.reverse = outE;
    return outE;
  }

  public _buildStation(): Platform {
    return new Platform(this, new Station());
  }
}

export default RailNode;
