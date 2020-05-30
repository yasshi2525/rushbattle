class ParticipationButton {
  protected readonly scene: g.Scene;
  protected readonly _entity: g.FilledRect;

  public static ACTIVE_COLOR = "#ff5555";
  public static PRESSED_COLOR = "#883333";
  public static INACTIVE_COLOR = "#333333";

  constructor(scene: g.Scene) {
    this.scene = scene;
    this._entity = new g.FilledRect({
      local: true,
      scene,
      cssColor: ParticipationButton.ACTIVE_COLOR,
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
      this._entity.cssColor = ParticipationButton.PRESSED_COLOR;
      this._entity.modified();
    });
    this._entity.pointUp.add((ev) => {
      if (pointerId !== ev.pointerId) {
        return;
      }
      pointerId = undefined;
      this._entity.cssColor = ParticipationButton.INACTIVE_COLOR;
      this._entity.touchable = false;
      this._entity.modified();
    });
  }

  public get entity(): g.FilledRect {
    return this._entity;
  }
}

export default ParticipationButton;
