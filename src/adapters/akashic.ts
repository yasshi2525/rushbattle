import AkashicContainer, {
  AkashicContainerType,
  CreateAkashicContainerOption,
} from "./akashic_container";
import AkashicRectangle, {
  AkashicRectangleType,
  CreateAkashicRectangleOption,
} from "./akashic_rectangle";
import AkashicScene, { AkashicSceneType } from "./akashic_scene";
import AkashicSprite, {
  AkashicSpriteType,
  CreateAkashicSpriteOption,
} from "./akashic_sprite";
import AkashicText, {
  AkashicTextType,
  CreateAkashicTextOption,
} from "./akashic_text";
import { EventType, modelListener } from "@yasshi2525/rushmini";
import { MessageEnvelop, isMessageEnvelop } from "../events/message";

import { Game } from "@akashic/game-driver";
import { ServiceAdapter } from "./adapter";
import { messageDecorder } from "../events/event_mapper";

export type AkashicAdapterType = ServiceAdapter<g.Scene, g.E>;
export type AkashicAdapterOption = { game: g.Game };

class AkashicAdapter implements AkashicAdapterType {
  public game: g.Game;
  protected _scene: AkashicScene;

  constructor(opts: AkashicAdapterOption) {
    this.game = opts.game;
  }

  public send(msg: MessageEnvelop): void {
    this.game.raiseEvent(new g.MessageEvent(msg));
  }

  public get scene(): g.Scene {
    return this.game.scene();
  }

  public pushScene(v: AkashicSceneType): void {
    this.game.pushScene(v.original);
  }

  public createScene(): AkashicSceneType {
    const scene = new AkashicScene({ game: this.game });
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

  public createContainer(
    opts: CreateAkashicContainerOption
  ): AkashicContainerType {
    return new AkashicContainer(opts);
  }

  public createSprite(opts: CreateAkashicSpriteOption): AkashicSpriteType {
    return new AkashicSprite({
      game: this.game,
      local: opts.local,
      scene: opts.scene,
      src: opts.src,
      anchorX: opts.anchorX,
      anchorY: opts.anchorY,
      angle: opts.angle,
      height: opts.height,
      hidden: opts.hidden,
      scaleX: opts.scaleX,
      scaleY: opts.scaleY,
      touchable: opts.touchable,
      width: opts.width,
      opacity: opts.opacity,
      x: opts.x,
      y: opts.y,
    });
  }

  public createRectangle(
    opts: CreateAkashicRectangleOption
  ): AkashicRectangleType {
    return new AkashicRectangle(opts);
  }

  public createText(opts: CreateAkashicTextOption): AkashicTextType {
    return new AkashicText(opts);
  }
}

export default AkashicAdapter;
