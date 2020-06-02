import { Company, Residence as ResidenceOrg } from "@yasshi2525/rushmini";

import Human from "./human";
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

  protected _spawn(): Human {
    if (this.destinations.length === 0) {
      // eslint-disable-next-line no-console
      console.warn("no destination candinate");
      return undefined;
    }
    const dest = this.destinations.shift();
    this.destinations.push(dest);
    return new Human(this, dest, this.rand);
  }
}

export default Residence;
