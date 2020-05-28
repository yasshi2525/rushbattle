import { MessageType } from "./event_mapper";
import Player from "../models/player";
import { UID } from "../models/resolver";

type Primitive = number | string;
type PrimitiveArray = Primitive[];

export type SerializableObject = {
  [index: string]: Primitive | PrimitiveArray | SerializableObject;
};

export type MessageEnvelop = {
  key: MessageType;
  sender: UID;
} & SerializableObject;

export const isMessageEnvelop = (obj: unknown): obj is MessageEnvelop =>
  obj && typeof obj == "object" && "key" in obj && "sender" in obj;

export interface Message {
  sender: Player;
  envelop(): MessageEnvelop;
}

export type BaseMessageOption = { sender: Player; key: MessageType };

export abstract class BaseMessage {
  protected readonly key: MessageType;
  protected readonly _sender: Player;
  constructor(opts: BaseMessageOption) {
    this.key = opts.key;
    this._sender = opts.sender;
  }
  get sender(): Player {
    return this._sender;
  }

  public envelop(): MessageEnvelop {
    return { key: this.key, sender: this.sender?.uid };
  }
}
