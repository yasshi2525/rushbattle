import { EventType, modelListener } from "@yasshi2525/rushmini";

import ActionProxy from "./action";
import { Reflectable } from "./resolver";

export type CreateRailwayOption = { isAdmin: boolean };

/**
 * 鉄道会社
 */
class Railway implements Reflectable {
  public static COUNT = 1;
  protected readonly action: ActionProxy;
  protected readonly _id: number;
  public readonly isAdmin: boolean;

  public static ADMIN_START = { x: 50, y: 50 };
  public static USER_START = { x: 50, y: 350 };
  public static CHUNK_SIZE = 150;
  public static RAIL_LENGTH = 4;
  public static ADMIN_STATION_INTERVAL = 2;
  public static USER_STATION_INTERVAL = 1;
  public static TRAIN_INTERVAL = 2;
  public static CONNECT_CHUNK = 2;
  public static CONNECT_LENGTH = 100;

  constructor(opts: CreateRailwayOption) {
    this.action = new ActionProxy();
    this._id = Railway.COUNT++;
    this.isAdmin = opts.isAdmin;
    modelListener.add(EventType.CREATED, this);
  }

  public get id(): number {
    return this._id;
  }

  public prepare(): void {
    // start
    const start = this.isAdmin ? Railway.ADMIN_START : Railway.USER_START;
    this.action.startRail(start.x, start.y);
    this.action.buildStation();
    this.action.startLine();
    this.action.deployTrain(this.action.line().top);

    for (let chunk = 1; chunk <= Railway.RAIL_LENGTH; chunk++) {
      const dx = Railway.CHUNK_SIZE * chunk;
      let dy = chunk === Railway.CONNECT_CHUNK ? Railway.CONNECT_LENGTH : 0;
      dy = dy * (this.isAdmin ? 1 : -1);
      this.action.extendRail(start.x + dx, start.y + dy);
      if (
        chunk %
          (this.isAdmin
            ? Railway.ADMIN_STATION_INTERVAL
            : Railway.USER_STATION_INTERVAL) ===
        0
      ) {
        this.action.buildStation();
      }
      this.action.insertEdge();
      if (chunk % Railway.TRAIN_INTERVAL === 0) {
        this.action
          .line()
          .filter(
            (lt) =>
              (chunk !== Railway.RAIL_LENGTH || lt.isDeptTask()) &&
              lt.departure() === this.action.tail()
          )
          .forEach((lt) => this.action.deployTrain(lt));
      }
    }

    modelListener.fire(EventType.CREATED);
    modelListener.fire(EventType.MODIFIED);
  }
}

export default Railway;
