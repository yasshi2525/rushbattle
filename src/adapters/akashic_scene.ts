import { MessageEvent, Scene, Trigger } from "./adapter";

import { AkashicContainerType } from "./akashic_container";
import AkashicTrigger from "./akashic_trigger";

export type AkashicSceneType = Scene<g.Scene, g.E>;
export type CreateAkashicSceneOption = { game: g.Game };

class AkashicScene implements AkashicSceneType {
  protected readonly _original: g.Scene;
  protected readonly _loaded: Trigger<g.Scene>;
  protected readonly _update: Trigger<void>;
  protected readonly _message: Trigger<g.MessageEvent>;

  constructor(opts: CreateAkashicSceneOption) {
    this._original = new g.Scene(opts);
    this._loaded = new AkashicTrigger(this._original.loaded);
    this._update = new AkashicTrigger(this._original.update);
    this._message = new AkashicTrigger(this._original.message);
  }

  public append(child: AkashicContainerType): void {
    this._original.append(child.original);
  }

  public remove(child: AkashicContainerType): void {
    this._original.remove(child.original);
  }

  isCurrentScene(): boolean {
    return this._original.isCurrentScene();
  }

  public get original(): g.Scene {
    return this._original;
  }

  public get loaded(): Trigger<g.Scene> {
    return this._loaded;
  }

  public get update(): Trigger<void> {
    return this._update;
  }

  public get message(): Trigger<MessageEvent> {
    return this._message;
  }
}

export default AkashicScene;
