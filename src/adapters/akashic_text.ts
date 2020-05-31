import { CreateTextOption, Text } from "./adapter";

import AkashicObject2D from "./akashic_object2D";

export type AkashicTextType = Text<
  g.Scene,
  g.E,
  g.PointDownEvent,
  g.PointMoveEvent,
  g.PointUpEvent
>;

export type CreateAkashicTextOption = CreateTextOption<
  g.Scene,
  g.E,
  g.PointDownEvent,
  g.PointMoveEvent,
  g.PointUpEvent,
  g.MessageEvent
>;

class AkashicText extends AkashicObject2D<g.SystemLabel>
  implements AkashicTextType {
  protected _color: string;
  constructor(opts: CreateAkashicTextOption) {
    super(
      new g.SystemLabel({
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
        fontSize: opts.fontSize,
        text: opts.text,
      })
    );
  }

  public get fontSize(): number {
    return this._original.fontSize;
  }

  public set fontSize(v: number) {
    this._original.fontSize = v;
  }

  public get text(): string {
    return this._original.text;
  }

  public set text(v: string) {
    this._original.text = v;
  }
}

export default AkashicText;
