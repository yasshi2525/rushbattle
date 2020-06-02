import { BaseMessage, Message, MessageEnvelop } from "./message";

import { MessageType } from "./event_mapper";

export type GameEndMessageOption = { sender: number };

export class GameEndMessage extends BaseMessage implements Message {
  constructor(opts: GameEndMessageOption) {
    super({ sender: opts.sender, key: MessageType.GAME_END });
  }

  public static decode(msg: MessageEnvelop): GameEndMessage {
    return new GameEndMessage({ sender: msg.sender });
  }
}
