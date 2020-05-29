import { Company as CompanyOrg } from "@yasshi2525/rushmini";
import { Reflectable } from "./resolver";

class Company extends CompanyOrg implements Reflectable {
  public static COUNT = 1;
  protected readonly _id: number;

  constructor(attractiveness: number, x: number, y: number) {
    super(attractiveness, x, y);
    this._id = Company.COUNT++;
  }

  public get id(): number {
    return this._id;
  }
}

export default Company;
