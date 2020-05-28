import { BaseMessage, Message, MessageEnvelop } from "./message";

import { MessageType } from "./event_mapper";

export type JoinMessageOption = { team: string; user: string };

export class JoinMessage extends BaseMessage implements Message {
  public readonly team: string;
  public readonly user: string;
  constructor(opts: JoinMessageOption) {
    super({ sender: undefined, key: MessageType.JOIN });
    this.user = opts.user;
    this.team = opts.team;
  }
  public envelop(): MessageEnvelop {
    const msg = super.envelop();
    msg.user = this.user;
    msg.team = this.team;
    return msg;
  }
  static decode(msg: MessageEnvelop): JoinMessage {
    return new JoinMessage({
      user: msg.user as string,
      team: msg.team as string,
    });
  }
}
