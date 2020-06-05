import {
  EventType,
  Point,
  Pointable,
  modelListener,
} from "@yasshi2525/rushmini";

import Gate from "./gate";
import Platform from "./platform";
import { Reflectable } from "./resolver";

class Station implements Reflectable, Pointable {
  public readonly platforms: Platform[] = [];
  public readonly gate: Gate;
  public static COUNT = 1;
  protected readonly _id: number;
  constructor() {
    this.gate = new Gate(this); // これがあるため extends Station していない
    this._id = Station.COUNT++;
    modelListener.add(EventType.CREATED, this);
  }

  public get id(): number {
    return this._id;
  }

  public loc(): Point {
    const p = this.platforms.reduce(
      (prev, current, _, src) => {
        prev.x += current.on.loc().x / src.length;
        prev.y += current.on.loc().y / src.length;
        return prev;
      },
      { x: 0, y: 0 }
    );
    return new Point(p.x, p.y);
  }

  public _remove(): void {
    modelListener.add(EventType.DELETED, this);
  }
}

export default Station;
