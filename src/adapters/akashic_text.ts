import { CreateTextOption, Text } from "./adapter";

import AkashicObject2D from "./akashic_object2D";

export type AkashicTextType = Text<g.Scene, g.E>;

export type CreateAkashicTextOption = CreateTextOption<g.Scene, g.E>;

class AkashicText extends AkashicObject2D<g.SystemLabel>
  implements AkashicTextType {
  protected _color: string;
  constructor(opts: CreateAkashicTextOption) {
    super(
      new g.SystemLabel({
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
        touchable: opts.hidden ?? false,
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
