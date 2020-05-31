import { CreateSpriteOption, Sprite } from "./adapter";

import AkashicObject2D from "./akashic_object2D";

export type AkashicSpriteType = Sprite<
  g.Scene,
  g.E,
  g.PointDownEvent,
  g.PointMoveEvent,
  g.PointUpEvent
>;

export type CreateAkashicSpriteOption = CreateSpriteOption<
  g.Scene,
  g.E,
  g.PointDownEvent,
  g.PointMoveEvent,
  g.PointUpEvent,
  g.MessageEvent
> & { game: g.Game };

class AkashicSprite extends AkashicObject2D<g.Sprite>
  implements AkashicSpriteType {
  constructor(opts: CreateAkashicSpriteOption) {
    super(
      new g.Sprite({
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
        src: opts.game.assets[opts.src],
      })
    );
  }
}

export default AkashicSprite;
