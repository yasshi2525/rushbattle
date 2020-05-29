import { Company, Residence as ResidenceOrg } from "@yasshi2525/rushmini";

import { Reflectable } from "./resolver";

class Residence extends ResidenceOrg implements Reflectable {
  public static COUNT = 1;
  protected readonly _id: number;

  constructor(
    destinations: Company[],
    x: number,
    y: number,
    rand: (min: number, max: number) => number
  ) {
    super(destinations, x, y, rand);
    this._id = Residence.COUNT++;
  }

  public get id(): number {
    return this._id;
  }
}

export default Residence;
