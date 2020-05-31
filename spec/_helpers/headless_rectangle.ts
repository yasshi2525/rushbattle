import { CreateRectangleOption, Rectangle } from "adapters/adapter";
import {
  CreateSimpleObject2DOption,
  HeadlessObject2D,
  SimpleObject2D,
} from "./headless_object2d";

import { SimpleContainer } from "./headless_container";
import { SimpleScene } from "./headless_scene";

export type CreateSimpleRectangle = CreateSimpleObject2DOption & {
  color: string;
};

export class SimpleRectangle extends SimpleObject2D {
  public color: string;
  constructor(opts: CreateSimpleRectangle) {
    super(opts);
    this.color = opts.color;
  }
}

export type HeadlessRectangleType = Rectangle<
  SimpleScene,
  SimpleContainer,
  g.PointDownEvent,
  g.PointMoveEvent,
  g.PointUpEvent
>;

export type CreateHeadlessRectangleOption = CreateRectangleOption<
  SimpleScene,
  SimpleContainer,
  g.PointDownEvent,
  g.PointMoveEvent,
  g.PointUpEvent,
  g.MessageEvent
>;

class HeadlessRectangle extends HeadlessObject2D<SimpleRectangle>
  implements HeadlessRectangleType {
  constructor(opts: CreateHeadlessRectangleOption) {
    super(
      new SimpleRectangle({
        scene: opts.scene.original,
        local: opts.local,
        x: opts.x,
        y: opts.y,
        width: opts.width,
        height: opts.height,
        anchorX: opts.anchorX,
        anchorY: opts.anchorY,
        angle: opts.angle,
        scaleX: opts.scaleX,
        scaleY: opts.scaleY,
        hidden: opts.hidden,
        color: opts.color,
        opacity: opts.opacity,
        touchable: opts.hidden,
      })
    );
  }

  public get color(): string {
    return this._original.color;
  }

  public set color(v: string) {
    this._original.color = v;
  }
}

export default HeadlessRectangle;
