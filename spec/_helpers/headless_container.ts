import { Container, CreateContainerOption } from "adapters/adapter";
import { HeadlessObject2D, SimpleObject2D } from "./headless_object2d";

import { SimpleScene } from "./headless_scene";

export class SimpleContainer extends SimpleObject2D {}

export type HeadlessContainerType = Container<
  SimpleScene,
  SimpleContainer,
  g.PointDownEvent,
  g.PointMoveEvent,
  g.PointUpEvent
>;

export type CreateHeadlessContainerOption = CreateContainerOption<
  SimpleScene,
  SimpleContainer,
  g.PointDownEvent,
  g.PointMoveEvent,
  g.PointUpEvent,
  g.MessageEvent
>;

class HeadlessContainer extends HeadlessObject2D<SimpleContainer>
  implements HeadlessContainerType {
  constructor(opts: CreateHeadlessContainerOption) {
    super(
      new SimpleContainer({
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

export default HeadlessContainer;
