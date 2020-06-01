import { Rectangle, Scene, ServiceAdapter } from "../adapters/adapter";

class ParticipationButton<T, C> {
  protected readonly scene: Scene<T, C>;
  protected readonly _entity: Rectangle<T, C>;

  public static ACTIVE_COLOR = "#ff5555";
  public static PRESSED_COLOR = "#883333";
  public static INACTIVE_COLOR = "#333333";

  constructor(adapter: ServiceAdapter<T, C>, scene: Scene<T, C>) {
    this.scene = scene;
    this._entity = adapter.createRectangle({
      local: true,
      scene,
      color: ParticipationButton.ACTIVE_COLOR,
      height: 100,
      width: 100,
      touchable: true,
    });
    let pointerId: number;
    this._entity.pointDown.add((ev) => {
      if (pointerId !== undefined) {
        return;
      }
      pointerId = ev.pointerId;
      this._entity.color = ParticipationButton.PRESSED_COLOR;
      this._entity.modified();
    });
    this._entity.pointUp.add((ev) => {
      if (pointerId !== ev.pointerId) {
        return;
      }
      pointerId = undefined;
      this._entity.color = ParticipationButton.INACTIVE_COLOR;
      this._entity.touchable = false;
      this._entity.modified();
    });
  }

  public get entity(): Rectangle<T, C> {
    return this._entity;
  }
}

export default ParticipationButton;
