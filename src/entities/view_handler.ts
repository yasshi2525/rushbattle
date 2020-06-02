import { Scene, ServiceAdapter } from "../adapters/adapter";

import { TriggerContainer } from "@yasshi2525/rushmini";

class ViewHandler<T, C, V extends number, E extends number> {
  protected readonly adapter: ServiceAdapter<T, C>;
  public readonly viewers: { [key in V]?: Scene<T, C> } = {};
  protected readonly listener: TriggerContainer<E, ViewHandler<T, C, V, E>>;

  constructor(adapter: ServiceAdapter<T, C>) {
    this.adapter = adapter;
    this.listener = new TriggerContainer();
  }

  public put(key: V, value: Scene<T, C>): void {
    this.viewers[key] = value;
  }

  public register(
    key: E,
    listener: (c: ViewHandler<T, C, V, E>) => void
  ): void {
    this.listener.find(key).register(listener);
  }

  public fire(key: E): void {
    this.listener.add(key, this);
    this.listener.fire(key);
  }
}

export default ViewHandler;
