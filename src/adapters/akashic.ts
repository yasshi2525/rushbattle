import { EventType, modelListener } from "@yasshi2525/rushmini";
import { MessageEnvelop, isMessageEnvelop } from "../events/message";

import { ServiceAdapter } from "./adapter";
import { messageDecorder } from "../events/event_mapper";

export type AkashicAdapterOption = {
  game: g.Game;
  main: string;
  sceneMapper: { [index: string]: g.Scene };
};

class AkashicAdapter implements ServiceAdapter {
  public readonly game: g.Game;
  protected readonly sceneMapper: { [index: string]: g.Scene };
  protected watch: g.Scene;

  constructor(opts: AkashicAdapterOption) {
    this.game = opts.game;
    this.sceneMapper = opts.sceneMapper;
    this.scene = opts.main;
  }

  public send(msg: MessageEnvelop): void {
    this.game.raiseEvent(new g.MessageEvent(msg));
  }

  public set scene(key: string) {
    this.watch = this.sceneMapper[key];
    this.watch.message.add((ev) => {
      if (isMessageEnvelop(ev.data)) {
        modelListener.add(
          EventType.CREATED,
          messageDecorder()[ev.data.key](ev.data)
        );
        modelListener.fire(EventType.CREATED);
      }
    });
  }
}

export default AkashicAdapter;
