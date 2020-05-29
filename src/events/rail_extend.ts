import { BaseMessage, Message, MessageEnvelop } from "./message";

import { MessageType } from "./event_mapper";

export type ExtendRailMessageOption = {
  sender: number;
  from: number;
  x: number;
  y: number;
};

export class ExtendRailMessage extends BaseMessage implements Message {
  public readonly from: number;
  public readonly x: number;
  public readonly y: number;

  constructor(opts: ExtendRailMessageOption) {
    super({ key: MessageType.EXTEND_RAIL, sender: opts.sender });
    this.from = opts.from;
    this.x = opts.x;
    this.y = opts.y;
  }

  public envelop(): MessageEnvelop {
    const msg = super.envelop();
    msg.from = this.from;
    msg.x = this.x;
    msg.y = this.y;
    return msg;
  }

  public static decode(msg: MessageEnvelop): ExtendRailMessage {
    return new ExtendRailMessage({
      sender: msg.sender,
      from: msg.from as number,
      x: msg.x as number,
      y: msg.y as number,
    });
  }
}
