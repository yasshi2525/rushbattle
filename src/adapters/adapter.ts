import { MessageEnvelop } from "../events/message";

export interface ServiceAdapter {
  send(msg: MessageEnvelop): void;
}
