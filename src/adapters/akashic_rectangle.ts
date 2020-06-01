import { CreateRectangleOption, Rectangle } from "./adapter";

import AkashicObject2D from "./akashic_object2D";

export type AkashicRectangleType = Rectangle<g.Scene, g.E>;

export type CreateAkashicRectangleOption = CreateRectangleOption<g.Scene, g.E>;

class AkashicRectangle extends AkashicObject2D<g.FilledRect>
  implements AkashicRectangle {
  protected _color: string;
  constructor(opts: CreateAkashicRectangleOption) {
    super(
      new g.FilledRect({
        scene: opts.scene.original,
        local: opts.local ?? false,
        x: opts.x ?? 0,
        y: opts.y ?? 0,
        width: opts.width ?? 0,
        height: opts.height ?? 0,
        anchorX: opts.anchorX ?? undefined,
        anchorY: opts.anchorY ?? undefined,
        angle: opts.angle ?? 0,
        scaleX: opts.scaleX ?? 1,
        scaleY: opts.scaleY ?? 1,
        hidden: opts.hidden ?? false,
        opacity: opts.opacity ?? 1,
        touchable: opts.touchable ?? false,
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
