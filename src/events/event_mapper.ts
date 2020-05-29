import { Message, MessageEnvelop } from "./message";

import { ExtendRailMessage } from "./rail_extend";
import { JoinMessage } from "./join";

export enum MessageType {
  JOIN = "join",
  EXTEND_RAIL = "rail_extend",
}

export const messageDecorder = (): {
  [key in MessageType]: (msg: MessageEnvelop) => Message;
} => ({
  join: JoinMessage.decode,
  rail_extend: ExtendRailMessage.decode,
});
