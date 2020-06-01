import { Container, CreateContainerOption } from "./adapter";

import AkashicObject2D from "./akashic_object2D";

export type AkashicContainerType = Container<g.Scene, g.E>;

export type CreateAkashicContainerOption = CreateContainerOption<g.Scene, g.E>;

class AkashicContainer extends AkashicObject2D<g.E>
  implements AkashicContainerType {
  constructor(opts: CreateAkashicContainerOption) {
    super(
      new g.E({
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
      })
    );
  }
}

export default AkashicContainer;
