import { remove, removeIf } from "@yasshi2525/rushmini";

import { Trigger } from "adapters/adapter";

class SimpleTrigger<T> implements Trigger<T> {
  protected list: ((ev?: T) => void)[] = [];
  protected once: ((ev?: T) => void)[] = [];

  public add(fn: (ev?: T) => void): void {
    this.list.push(fn);
  }

  public addOnce(fn: (ev?: T) => void): void {
    this.list.push(fn);
    this.once.push(fn);
  }

  public remove(fn: (ev?: T) => void): void {
    remove(this.list, fn);
    removeIf(this.once, fn);
  }

  public fire(ev?: T): void {
    this.list.forEach((fn) => fn(ev));
    this.once.forEach((fn) => {
      remove(this.list, fn);
    });
    this.once.length = 0;
  }
}

export default SimpleTrigger;
