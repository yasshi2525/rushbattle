import { Message, MessageEnvelop } from "./message";

import { GameEndMessage } from "./game_end";
import { GameStartMessage } from "./game_start";
import { JoinMessage } from "./join";

export enum MessageType {
  JOIN = "join",
  GAME_START = "game_start",
  GAME_END = "game_end",
}

export const messageDecorder = (): {
  [key in MessageType]: (msg: MessageEnvelop) => Message;
} => ({
  join: JoinMessage.decode,
  game_start: GameStartMessage.decode,
  game_end: GameEndMessage.decode,
});
