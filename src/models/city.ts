import {
  EventType,
  Point,
  Steppable,
  distancePoint,
  find,
  modelListener,
  ticker,
} from "@yasshi2525/rushmini";

import Company from "./company";
import Residence from "./residence";

type FindSparseLocOption = {
  size: number;
  cx: number;
  cy: number;
  marginTop: number;
  sparse: number;
  rand: () => number;
  others: Point[];
  maxTry: number;
};

const findSparseLoc = (opts: FindSparseLocOption) => {
  let pos: Point;
  let count = 0;
  do {
    pos = new Point(
      (opts.cx + opts.rand()) * opts.size,
      opts.marginTop + (opts.cy + opts.rand()) * opts.size
    );
    count++;
  } while (
    find(opts.others, (p) => distancePoint(p, pos) < opts.sparse) &&
    count < opts.maxTry
  );
  // eslint-disable-next-line no-console
  if (count === opts.maxTry) console.warn("could not find sparse point");
  return pos;
};

type CreateSparseLocOption = {
  cx: number;
  marginTop: number;
  size: number;
  sparse: number;
  rand: () => number;
  others: { admin: Point; user: Point }[];
  maxTry: number;
};

const toSparseLoc = (opts: CreateSparseLocOption) => {
  const others = opts.others.reduce((prev: Point[], current) => {
    prev.push(current.admin);
    prev.push(current.user);
    return prev;
  }, []);
  return {
    user: findSparseLoc({
      cx: opts.cx,
      cy: 1,
      marginTop: opts.marginTop,
      sparse: opts.sparse,
      rand: opts.rand,
      maxTry: opts.maxTry,
      others,
      size: opts.size,
    }),
    admin: findSparseLoc({
      cx: opts.cx,
      cy: 0,
      marginTop: opts.marginTop,
      sparse: opts.sparse,
      rand: opts.rand,
      maxTry: opts.maxTry,
      others,
      size: opts.size,
    }),
  };
};

export type CreateCityOption = {
  width: number;
  height: number;
  rand: () => number;
};

class City implements Steppable {
  public static CHUNK_SIZE = 150;
  public static LENGTH = 4;
  public static MARGIN_TOP = 50;
  /**
   * 建物は最低この距離間をおいて建設する
   */
  public static SPARSE = 50;
  public static INIT_PER_TEAM = 2;
  public static MAX_PER_TEAM = 6;
  public static SPAWN_INTERVAL = 15;
  public static MAX_TRY = 30;

  protected readonly preserves: { admin: Point; user: Point }[] = [];
  /**
   * 残り remain frame 経過すると人を生成する
   */
  protected remainFrame: number;
  protected readonly c: Company;
  protected readonly rangeRand: (min: number, max: number) => number;

  constructor(opts: CreateCityOption) {
    for (let i = 0; i < City.MAX_PER_TEAM; i++) {
      const cx = i === 0 ? 0 : 1 + Math.floor(opts.rand() * (City.LENGTH - 1));
      this.preserves.push(
        toSparseLoc({
          cx,
          marginTop: City.MARGIN_TOP,
          others: this.preserves,
          maxTry: City.MAX_TRY,
          rand: opts.rand,
          size: City.CHUNK_SIZE,
          sparse: City.SPARSE,
        })
      );
    }
    this.c = new Company(1, opts.width, opts.height / 2);
    this.rangeRand = (min: number, max: number) => min + opts.rand() * max;
    for (let i = 0; i < City.INIT_PER_TEAM; i++) {
      const posSet = this.preserves.shift();
      [posSet.user, posSet.admin].forEach(
        (pos) => new Residence([this.c], pos.x, pos.y, this.rangeRand)
      );
    }
    this.remainFrame = Math.floor(City.SPAWN_INTERVAL * ticker.fps());

    modelListener.fire(EventType.CREATED);
  }

  _step(): void {
    this.remainFrame--;
    if (this.remainFrame <= 0 && this.preserves.length > 0) {
      const posSet = this.preserves.shift();
      [posSet.user, posSet.admin].forEach(
        (pos) => new Residence([this.c], pos.x, pos.y, this.rangeRand)
      );
      this.remainFrame += Math.floor(City.SPAWN_INTERVAL * ticker.fps());
    }
    modelListener.fire(EventType.CREATED);
  }
}

export default City;
