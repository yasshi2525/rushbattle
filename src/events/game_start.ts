import { BaseMessage, Message, MessageEnvelop } from "./message";

import { MessageType } from "./event_mapper";

export type GameStartMessageOption = { sender: number };

export class GameStartMessage extends BaseMessage implements Message {
  constructor(opts: GameStartMessageOption) {
    super({ sender: opts.sender, key: MessageType.GAME_START });
  }

  public static decode(msg: MessageEnvelop): GameStartMessage {
    return new GameStartMessage({ sender: msg.sender });
  }
}
