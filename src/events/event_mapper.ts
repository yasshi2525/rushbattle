import { Message, MessageEnvelop } from "./message";

import { JoinMessage } from "./join";

export enum MessageType {
  JOIN = "join",
}

export const messageDecorder = (): {
  [key in MessageType]: (msg: MessageEnvelop) => Message;
} => ({
  join: JoinMessage.decode,
});
