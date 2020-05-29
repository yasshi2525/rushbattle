import { BaseMessage, Message, MessageEnvelop } from "./message";

import { MessageType } from "./event_mapper";

export type JoinMessageOption = {
  team: number;
  user: string;
};

export class JoinMessage extends BaseMessage implements Message {
  public readonly team: number;
  public readonly user: string;
  constructor(opts: JoinMessageOption) {
    super({ sender: undefined, key: MessageType.JOIN });
    this.user = opts.user;
    this.team = opts.team;
  }
  public envelop(): MessageEnvelop {
    const msg = super.envelop();
    msg.team = this.team;
    msg.user = this.user;
    return msg;
  }
  public static decode(msg: MessageEnvelop): JoinMessage {
    return new JoinMessage({
      team: msg.team as number,
      user: msg.user as string,
    });
  }
}
