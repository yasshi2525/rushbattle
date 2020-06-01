import { EventType, find, modelListener, remove } from "@yasshi2525/rushmini";

import { resourceTypes } from "./model_mapper";

export type Storage = { [index: string]: Reflectable[] };

export interface Reflectable {
  id: number;
}

class Resolver {
  protected readonly storage: Storage = {};
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

  public list<T extends Reflectable>(key: new (...args: unknown[]) => T): T[] {
    return this.storage[key.name] as T[];
  }

  public find<T extends Reflectable>(
    key: new (...args: unknown[]) => T,
    id: number | string
  ): T {
    return find(this.storage[key.name], (e) => e.id === id) as T;
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
