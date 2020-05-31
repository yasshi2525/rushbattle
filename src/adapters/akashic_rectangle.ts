import { CreateRectangleOption, Rectangle } from "./adapter";

import AkashicObject2D from "./akashic_object2D";

export type AkashicRectangleType = Rectangle<
  g.Scene,
  g.FilledRect,
  g.PointDownEvent,
  g.PointMoveEvent,
  g.PointUpEvent
>;

export type CreateAkashicRectangleOption = CreateRectangleOption<
  g.Scene,
  g.E,
  g.PointDownEvent,
  g.PointMoveEvent,
  g.PointUpEvent,
  g.MessageEvent
>;

class AkashicRectangle extends AkashicObject2D<g.FilledRect>
  implements AkashicRectangle {
  protected _color: string;
  constructor(opts: CreateAkashicRectangleOption) {
    super(
      new g.FilledRect({
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
        opacity: opts.opacity,
        touchable: opts.hidden,
        cssColor: opts.color,
      })
    );
  }

  public get color(): string {
    return this._original.cssColor;
  }

  public set color(v: string) {
    this._original.cssColor = v;
  }
}

export default AkashicRectangle;
