import { Company, Human as HumanOrg, Residence } from "@yasshi2525/rushmini";

import { Reflectable } from "./resolver";

class Human extends HumanOrg implements Reflectable {
  public static COUNT = 1;
  protected readonly _id: number;

  constructor(
    departure: Residence,
    destination: Company,
    rand: (min: number, max: number) => number
  ) {
    super(departure, destination, rand);
    this._id = Human.COUNT++;
  }

  public get id(): number {
    return this._id;
  }
}

export default Human;
