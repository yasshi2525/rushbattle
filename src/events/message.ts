import { MessageType } from "./event_mapper";

type Primitive = number | string;
type PrimitiveArray = Primitive[];

export type SerializableObject = {
  [index: string]: Primitive | PrimitiveArray | SerializableObject;
};

export type MessageEnvelop = {
  key: MessageType;
  sender: number;
} & SerializableObject;

export const isMessageEnvelop = (obj: unknown): obj is MessageEnvelop =>
  obj && typeof obj == "object" && "key" in obj;

export interface Message {
  sender: number;
  envelop(): MessageEnvelop;
}

export type BaseMessageOption = { sender: number; key: MessageType };

export abstract class BaseMessage {
  protected readonly key: MessageType;
  protected readonly _sender: number;
  constructor(opts: BaseMessageOption) {
    this.key = opts.key;
    this._sender = opts.sender;
  }
  get sender(): number {
    return this._sender;
  }

  public envelop(): MessageEnvelop {
    return { key: this.key, sender: this.sender };
  }
}
