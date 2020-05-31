import { Container, CreateContainerOption } from "./adapter";

import AkashicObject2D from "./akashic_object2D";

export type AkashicContainerType = Container<
  g.Scene,
  g.E,
  g.PointDownEvent,
  g.PointMoveEvent,
  g.PointUpEvent
>;

export type CreateAkashicContainerOption = CreateContainerOption<
  g.Scene,
  g.E,
  g.PointDownEvent,
  g.PointMoveEvent,
  g.PointUpEvent,
  g.MessageEvent
>;

class AkashicContainer extends AkashicObject2D<g.E>
  implements AkashicContainerType {
  constructor(opts: CreateAkashicContainerOption) {
    super(
      new g.E({
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

export default AkashicContainer;
