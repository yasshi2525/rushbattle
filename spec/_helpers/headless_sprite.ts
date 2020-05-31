import { CreateContainerOption, Sprite } from "adapters/adapter";
import { HeadlessObject2D, SimpleObject2D } from "./headless_object2d";

import { SimpleContainer } from "./headless_container";
import { SimpleScene } from "./headless_scene";

export class SimpleSprite extends SimpleObject2D {}

export type HeadlessSpriteType = Sprite<
  SimpleScene,
  SimpleContainer,
  g.PointDownEvent,
  g.PointMoveEvent,
  g.PointUpEvent
>;

export type CreateHeadlessSpriteOption = CreateContainerOption<
  SimpleScene,
  SimpleContainer,
  g.PointDownEvent,
  g.PointMoveEvent,
  g.PointUpEvent,
  g.MessageEvent
>;

class HeadlessSprite extends HeadlessObject2D<SimpleSprite>
  implements HeadlessSpriteType {
  constructor(opts: CreateHeadlessSpriteOption) {
    super(
      new SimpleSprite({
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
      })
    );
  }
}

export default HeadlessSprite;
