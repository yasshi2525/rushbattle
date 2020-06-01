import { HeadlessContainerType, SimpleContainer } from "./headless_container";
import { Scene, Trigger } from "adapters/adapter";

import SimpleTrigger from "./simple_trigger";
import { remove } from "@yasshi2525/rushmini";

export class SimpleScene {
  public readonly children: SimpleContainer[] = [];
  public readonly loaded: Trigger<SimpleScene>;
  public readonly update: Trigger<void>;
  public readonly message: Trigger<g.MessageEvent>;

  constructor() {
    this.loaded = new SimpleTrigger();
    this.update = new SimpleTrigger();
    this.message = new SimpleTrigger();
  }

  public append(child: SimpleContainer): void {
    child.parent = this;
    this.children.push(child);
  }

  public remove(child: SimpleContainer): void {
    remove(this.children, child);
  }
}

export type HeadlessSceneType = Scene<SimpleScene, SimpleContainer>;

class HeadlessScene implements HeadlessSceneType {
  protected readonly _original: SimpleScene;

  constructor() {
    this._original = new SimpleScene();
  }

  public append(child: HeadlessContainerType): void {
    this._original.append(child.original);
  }

  public remove(child: HeadlessContainerType): void {
    this._original.remove(child.original);
  }

  isCurrentScene(): boolean {
    throw new Error("isCurrentScene not mocked");
  }

  public get original(): SimpleScene {
    return this._original;
  }

  public get loaded(): Trigger<SimpleScene> {
    return this._original.loaded;
  }

  public get update(): Trigger<void> {
    return this._original.update;
  }

  public get message(): Trigger<g.MessageEvent> {
    return this._original.message;
  }
}

export default HeadlessScene;
