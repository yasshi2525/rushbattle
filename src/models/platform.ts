import {
  Platform as PlatformOrg,
  RailNode,
  Station,
} from "@yasshi2525/rushmini";

import { Reflectable } from "./resolver";

class Platform extends PlatformOrg implements Reflectable {
  public static COUNT = 1;
  protected readonly _id: number;
  constructor(on: RailNode, st: Station) {
    super(on, st);
    this._id = Platform.COUNT++;
  }

  get id(): number {
    return this._id;
  }
}

export default Platform;
