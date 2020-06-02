import { Container, Scene, ServiceAdapter } from "../adapters/adapter";

import { TriggerContainer } from "@yasshi2525/rushmini";

export enum SceneType {
  TITLE,
  GAME,
  ENDING,
}

export enum SceneEvent {
  GAME_STARTED,
  GAME_ENDED,
  REPLAY,
}

export type CreateSceneHandlerOption<T, C> = { adapter: ServiceAdapter<T, C> };

class SceneHandler<T, C> {
  protected readonly adapter: ServiceAdapter<T, C>;
  public readonly scenes: { [key in SceneType]?: Scene<T, C> } = {};
  protected readonly listener: TriggerContainer<
    SceneEvent,
    { data: Container<T, C> }
  >;

  constructor(opts: CreateSceneHandlerOption<T, C>) {
    this.adapter = opts.adapter;
    this.listener = new TriggerContainer();
  }

  public put(key: SceneType, value: Scene<T, C>): void {
    this.scenes[key] = value;
  }

  public register(
    key: SceneEvent,
    listener: (c: Container<T, C>) => void
  ): void {
    this.listener.find(key).register((ev) => listener(ev.data));
  }

  public fire(key: SceneEvent, c?: Container<T, C>): void {
    this.listener.add(key, { data: c });
    this.listener.fire(key);
  }
}

export default SceneHandler;
