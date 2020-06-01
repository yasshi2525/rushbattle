import { EventType, modelListener } from "@yasshi2525/rushmini";
import HeadlessContainer, {
  CreateHeadlessContainerOption,
  SimpleContainer,
} from "./headless_container";
import HeadlessRectangle, {
  CreateHeadlessRectangleOption,
} from "./headless_rectangle";
import HeadlessScene, { SimpleScene } from "./headless_scene";
import HeadlessSprite, { CreateHeadlessSpriteOption } from "./headless_sprite";
import HeadlessText, { CreateHeadlessTextOption } from "./headless_text";
import { MessageEnvelop, isMessageEnvelop } from "events/message";

import { ServiceAdapter } from "adapters/adapter";
import { messageDecorder } from "events/event_mapper";

export type HeadlessAdapterType = ServiceAdapter<SimpleScene, SimpleContainer>;

class HeadlessAdapter implements HeadlessAdapterType {
  protected msgQueue: MessageEnvelop[] = [];
  protected sceneQueue: HeadlessScene[] = [];

  public send(msg: MessageEnvelop): void {
    this.msgQueue.push(msg);
  }

  public fetch(): void {
    this.msgQueue.forEach((msg) => {
      this.scene.message.fire(new g.MessageEvent(msg));
    });
  }

  public get scene(): SimpleScene {
    return this.sceneQueue[0].original;
  }

  public pushScene(v: HeadlessScene): void {
    this.sceneQueue.push(v);
  }

  public createScene(): HeadlessScene {
    const scene = new HeadlessScene();
    scene.message.add((ev) => {
      if (isMessageEnvelop(ev.data)) {
        modelListener.add(
          EventType.CREATED,
          messageDecorder()[ev.data.key](ev.data)
        );
        modelListener.fire(EventType.CREATED);
      }
    });
    return scene;
  }

  public shiftSceneIf(): void {
    if (this.sceneQueue.length > 1) {
      this.sceneQueue.shift();
      this.sceneQueue[0].loaded.fire(this.sceneQueue[0].original);
    }
  }

  public createContainer(
    opts: CreateHeadlessContainerOption
  ): HeadlessContainer {
    return new HeadlessContainer(opts);
  }

  public createSprite(opts: CreateHeadlessSpriteOption): HeadlessSprite {
    return new HeadlessSprite(opts);
  }

  public createRectangle(
    opts: CreateHeadlessRectangleOption
  ): HeadlessRectangle {
    return new HeadlessRectangle(opts);
  }

  public createText(opts: CreateHeadlessTextOption): HeadlessText {
    return new HeadlessText(opts);
  }
}

export default HeadlessAdapter;
