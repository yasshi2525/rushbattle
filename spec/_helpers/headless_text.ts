import {
  CreateSimpleObject2DOption,
  HeadlessObject2D,
  SimpleObject2D,
} from "./headless_object2d";
import { CreateTextOption, Text } from "adapters/adapter";

import { SimpleContainer } from "./headless_container";
import { SimpleScene } from "./headless_scene";

export type CreateSimpleText = CreateSimpleObject2DOption & {
  text: string;
  fontSize: number;
};

export class SimpleText extends SimpleObject2D {
  public text: string;
  public fontSize: number;
  constructor(opts: CreateSimpleText) {
    super(opts);
    this.text = opts.text;
    this.fontSize = opts.fontSize;
  }
}

export type HeadlessTextType = Text<
  SimpleScene,
  SimpleContainer,
  g.PointDownEvent,
  g.PointMoveEvent,
  g.PointUpEvent
>;

export type CreateHeadlessTextOption = CreateTextOption<
  SimpleScene,
  SimpleContainer,
  g.PointDownEvent,
  g.PointMoveEvent,
  g.PointUpEvent,
  g.MessageEvent
>;

class HeadlessText extends HeadlessObject2D<SimpleText>
  implements HeadlessTextType {
  constructor(opts: CreateHeadlessTextOption) {
    super(
      new SimpleText({
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
        text: opts.text,
        fontSize: opts.fontSize,
        touchable: opts.hidden,
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

export default HeadlessText;
