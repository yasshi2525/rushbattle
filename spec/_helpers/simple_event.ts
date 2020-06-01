abstract class SimplePointEvent {
  public readonly local: boolean;
  public readonly player: { id: string };
  public readonly id: string;
  public readonly point: { x: number; y: number };
  public readonly pointId: number;
  public readonly priority: number;
}

export class SimplePointDownEvent extends SimplePointEvent {}
export class SimplePointMoveEvent extends SimplePointEvent {
  public readonly prevDelta: { x: number; y: number };
  public readonly startDelta: { x: number; y: number };
}
export class SimplePointUpEvent extends SimplePointMoveEvent {}
