import { EventType, modelListener } from "@yasshi2525/rushmini";

import { MessageEnvelop } from "events/message";
import { ServiceAdapter } from "adapters/adapter";
import { messageDecorder } from "events/event_mapper";

class TestAdapter implements ServiceAdapter {
  protected queue: MessageEnvelop[] = [];
  public send(msg: MessageEnvelop): void {
    this.queue.push(msg);
  }
  public fetch(): void {
    this.queue
      .map((msg) => messageDecorder()[msg.key](msg))
      .forEach((ev) => modelListener.add(EventType.CREATED, ev));
    modelListener.fire(EventType.CREATED);
    this.queue.length = 0;
  }
}

export default TestAdapter;
