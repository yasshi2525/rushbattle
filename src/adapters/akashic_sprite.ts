import { CreateSpriteOption, Sprite } from "./adapter";

import AkashicObject2D from "./akashic_object2D";

export type AkashicSpriteType = Sprite<g.Scene, g.E>;

export type CreateAkashicSpriteOption = CreateSpriteOption<g.Scene, g.E> & {
  game: g.Game;
};

class AkashicSprite extends AkashicObject2D<g.Sprite>
  implements AkashicSpriteType {
  constructor(opts: CreateAkashicSpriteOption) {
    super(
      new g.Sprite({
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
        src: opts.game.assets[opts.src],
      })
    );
  }
}

export default AkashicSprite;
