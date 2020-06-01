import { HeadlessContainerType, SimpleContainer } from "./headless_container";
import {
  PointDownEvent,
  PointMoveEvent,
  PointUpEvent,
  Trigger,
} from "adapters/adapter";

import { SimpleScene } from "./headless_scene";
import SimpleTrigger from "./simple_trigger";
import { remove } from "@yasshi2525/rushmini";

export type CreateSimpleObject2DOption = {
  scene: SimpleScene;
  local?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  anchorX?: number;
  anchorY?: number;
  angle?: number;
  scaleX?: number;
  scaleY?: number;
  hidden?: boolean;
  opacity?: number;
  touchable?: boolean;
};

export abstract class SimpleObject2D {
  public readonly scene: SimpleScene;
  public parent: SimpleScene | SimpleContainer;
  public children: SimpleContainer[] = [];
  public local: boolean;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public anchorX: number;
  public anchorY: number;
  public angle: number;
  public scaleX: number;
  public scaleY: number;
  public hidden: boolean;
  public opacity: number;
  public touchable: boolean;
  public readonly pointDown: Trigger<PointDownEvent<SimpleContainer>>;
  public readonly pointMove: Trigger<PointMoveEvent<SimpleContainer>>;
  public readonly pointUp: Trigger<PointUpEvent<SimpleContainer>>;
  public readonly update: Trigger<void>;

  constructor(opts: CreateSimpleObject2DOption) {
    this.scene = opts.scene;
    this.local = opts.local ?? false;
    this.x = opts.x ?? 0;
    this.y = opts.y ?? 0;
    this.width = opts.width ?? 0;
    this.height = opts.height ?? 0;
    this.anchorX = opts.anchorX ?? 0;
    this.anchorY = opts.anchorY ?? 0;
    this.angle = opts.angle ?? 0;
    this.scaleX = opts.scaleX ?? 0;
    this.scaleY = opts.scaleY ?? 0;
    this.hidden = opts.hidden ?? false;
    this.opacity = opts.opacity ?? 1;
    this.touchable = opts.touchable ?? false;
    this.pointDown = new SimpleTrigger();
    this.pointMove = new SimpleTrigger();
    this.pointUp = new SimpleTrigger();
    this.update = new SimpleTrigger();
  }

  public append(child: SimpleContainer): void {
    child.parent = this;
    this.children.push(child);
  }

  public remove(child: SimpleContainer): void {
    remove(this.children, child);
  }

  public destroy(): void {
    this.parent.remove(this);
  }
}

export class HeadlessObject2D<T extends SimpleObject2D> {
  protected readonly _original: T;

  constructor(original: T) {
    this._original = original;
  }

  public append(child: HeadlessContainerType): void {
    this._original.append(child.original);
  }

  public remove(child: HeadlessContainerType): void {
    this._original.remove(child.original);
  }

  public destroy(): void {
    this._original.destroy();
  }

  public show(): void {
    this._original.hidden = false;
  }

  public hide(): void {
    this._original.hidden = true;
  }

  public visible(): boolean {
    return !this._original.hidden;
  }

  public modified(): void {
    // do-nothing
  }

  public get scene(): SimpleScene {
    return this._original.scene;
  }

  public get original(): T {
    return this._original;
  }

  public get pointDown(): Trigger<PointDownEvent<SimpleContainer>> {
    return this.original.pointDown;
  }

  public get pointMove(): Trigger<PointMoveEvent<SimpleContainer>> {
    return this._original.pointMove;
  }
  public get pointUp(): Trigger<PointUpEvent<SimpleContainer>> {
    return this._original.pointUp;
  }

  public get update(): Trigger<void> {
    return this._original.update;
  }

  public get children(): SimpleContainer[] {
    return this._original.children;
  }

  public get x(): number {
    return this._original.x;
  }

  public set x(v: number) {
    this._original.x = v;
  }

  public get y(): number {
    return this._original.y;
  }

  public set y(v: number) {
    this._original.y = v;
  }

  public get width(): number {
    return this._original.width;
  }

  public set width(v: number) {
    this._original.width = v;
  }

  public get height(): number {
    return this._original.height;
  }

  public set height(v: number) {
    this._original.height = v;
  }

  public get angle(): number {
    return this._original.angle;
  }

  public set angle(v: number) {
    this._original.angle = v;
  }

  public get anchorX(): number {
    return this._original.anchorX;
  }

  public set anchorX(v: number) {
    this._original.anchorX = v;
  }

  public get anchorY(): number {
    return this._original.anchorY;
  }

  public set anchorY(v: number) {
    this._original.anchorY = v;
  }

  public get scaleX(): number {
    return this._original.scaleX;
  }

  public set scaleX(v: number) {
    this._original.scaleX = v;
  }

  public get scaleY(): number {
    return this._original.scaleY;
  }

  public set scaleY(v: number) {
    this._original.scaleY = v;
  }

  public get touchable(): boolean {
    return this._original.touchable;
  }

  public set touchable(v: boolean) {
    this._original.touchable = v;
  }

  public get opacity(): number {
    return this._original.opacity;
  }

  public set opacity(v: number) {
    this._original.opacity = v;
  }

  public get local(): boolean {
    return this._original.local;
  }
}
