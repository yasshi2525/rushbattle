import { EventType, find, modelListener, remove } from "@yasshi2525/rushmini";

import { resourceTypes } from "./model_mapper";

export type UID = { key: string; id: number | string };
export type Storage = { [index: string]: Reflectable[] };

export interface Reflectable {
  uid: UID;
}

class Resolver {
  protected storage: Storage = {};
  constructor() {
    resourceTypes.forEach((res) => {
      modelListener
        .find(EventType.CREATED, res)
        .register((obj) => this.add(obj));
      modelListener
        .find(EventType.DELETED, res)
        .register((obj) => this.remove(obj));
    });
  }

  public find<T>(key: new (...args: unknown[]) => T, id: number | string): T {
    return (find(
      this.storage[key.name],
      (e) => e.uid.id === id
    ) as unknown) as T;
  }

  protected add(obj: Reflectable): void {
    if (!(obj.constructor.name in this.storage)) {
      this.storage[obj.constructor.name] = [];
    }
    this.storage[obj.constructor.name].push(obj);
  }

  protected remove(obj: Reflectable): void {
    remove(this.storage[obj.constructor.name], obj);
  }
}

export default Resolver;
