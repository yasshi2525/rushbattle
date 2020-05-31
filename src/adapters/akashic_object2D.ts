import { AkashicContainerType } from "./akashic_container";
import AkashicTrigger from "./akashic_trigger";
import { Trigger } from "./adapter";

class AkashicObject2D<T extends g.E> {
  protected readonly _original: T;
  protected readonly _pointDown: Trigger<g.PointDownEvent>;
  protected readonly _pointMove: Trigger<g.PointMoveEvent>;
  protected readonly _pointUp: Trigger<g.PointUpEvent>;
  protected readonly _update: Trigger<void>;

  constructor(original: T) {
    this._original = original;
    this._pointDown = new AkashicTrigger(original.pointDown);
    this._pointMove = new AkashicTrigger(original.pointMove);
    this._pointUp = new AkashicTrigger(original.pointUp);
    this._update = new AkashicTrigger(original.update);
  }

  public append(child: AkashicContainerType): void {
    this._original.append(child.original);
  }

  public remove(child: AkashicContainerType): void {
    this._original.remove(child.original);
  }

  public destroy(): void {
    this._original.destroy();
  }

  public show(): void {
    this._original.show();
  }

  public hide(): void {
    this._original.hide();
  }

  public visible(): boolean {
    return this._original.visible();
  }

  public modified(): void {
    this._original.modified();
  }

  public get scene(): g.Scene {
    return this._original.scene;
  }

  public get original(): T {
    return this._original;
  }

  public get pointDown(): Trigger<g.PointDownEvent> {
    return this._pointDown;
  }

  public get pointMove(): Trigger<g.PointMoveEvent> {
    return this._pointMove;
  }
  public get pointUp(): Trigger<g.PointUpEvent> {
    return this._pointUp;
  }

  public get update(): Trigger<void> {
    return this._update;
  }

  public get children(): g.E[] {
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

export default AkashicObject2D;
