import { Trigger } from "./adapter";

class AkashicTrigger<T> implements Trigger<T> {
  protected original: g.Trigger<T>;
  constructor(original: g.Trigger<T>) {
    this.original = original;
  }

  public add(fn: (ev?: T) => void): void {
    this.original.add(fn);
  }

  public addOnce(fn: (ev?: T) => void): void {
    this.original.addOnce(fn);
  }

  public remove(fn: (ev?: T) => void): void {
    this.original.remove(fn);
  }

  public fire(ev?: T): void {
    this.original.fire(ev);
  }
}

export default AkashicTrigger;
