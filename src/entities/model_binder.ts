import { Container, Scene, ServiceAdapter } from "../adapters/adapter";
import {
  EventType,
  Pointable,
  Tracker,
  modelListener,
} from "@yasshi2525/rushmini";

import { locatePointableView } from "./point_view";

/**
 * モデルとビューを紐付けたオブジェクト
 */
export type ViewObject<T, C, E> = {
  readonly subject: E;
  viewer: Container<T, C>;
};

/**
 * 指定されたモデルをラップしたビューアを作成する関数
 */
export type ViewCreator<T, C, E extends Pointable> = (
  scene: Scene<T, C>,
  subject: E
) => Container<T, C>;

/**
 * 特定のイベントが発生した際、ビューアを修正する関数
 */
export type ModelModifier<T, C, E extends Pointable> = (
  vo: ViewObject<T, C, E>
) => void;

/**
 * モデルが移動した場合、描画物の座標も移動させる
 * @param vo
 */
const positionModifier = <T, C, E extends Pointable>(
  vo: ViewObject<T, C, E>
) => {
  vo.viewer.x = vo.subject.loc().x - vo.viewer.width / 2;
  vo.viewer.y = vo.subject.loc().y - vo.viewer.height / 2;
};

export type CreateViewObjectFactoryOption<T, C, E extends Pointable> = {
  adapter: ServiceAdapter<T, C>;
  scene: Scene<T, C>;
  panel: Container<T, C>;
  creator: ViewCreator<T, C, E>;
  modifier: { [key in EventType]?: ModelModifier<T, C, E> };
  bind: { new (...args: unknown[]): E };
  desc?: boolean;
};

class ModelBinder<T, C, E extends Pointable> {
  protected readonly adapter: ServiceAdapter<T, C>;
  protected readonly scene: Scene<T, C>;
  protected readonly panel: Container<T, C>;
  protected readonly creator: ViewCreator<T, C, E>;
  public readonly children: ViewObject<T, C, E>[];
  protected readonly desc: boolean;

  constructor(opts: CreateViewObjectFactoryOption<T, C, E>) {
    this.adapter = opts.adapter;
    this.scene = opts.scene;
    this.panel = opts.panel;
    this.creator = opts.creator;
    this.children = [];
    this.desc = opts.desc ?? false;
    this.bind(opts.bind, opts.modifier);
  }

  protected bind(
    cls: { new (...args: unknown[]): E },
    modifier: { [key in EventType]?: ModelModifier<T, C, E> }
  ): void {
    modelListener.find(EventType.CREATED, cls).register((subject) => {
      const vo = this.createInstance(subject);

      Object.keys(modifier)
        .map((k) => parseInt(k, 10))
        .filter((k) => !isNaN(k))
        .forEach((k: EventType) => {
          const tracker = new Tracker(vo.subject);
          tracker.register(() => {
            if (k === EventType.MODIFIED) positionModifier(vo);
            modifier[k](vo);
            vo.viewer.modified();
          });
          modelListener.track(k, tracker);
        });
    });
    modelListener
      .find(EventType.DELETED, cls)
      .register((subject) => this.removeInstance(subject));
  }

  /**
   * 引数に指定したモデルに対応する描画物を作成し、パネルに配置します
   * @param subject
   */
  protected createInstance(subject: E): ViewObject<T, C, E> {
    const viewer = locatePointableView({
      adapter: this.adapter,
      scene: this.scene,
      subject,
      viewer: this.creator(this.scene, subject),
    });
    const obj: ViewObject<T, C, E> = { subject, viewer };

    if (this.desc) {
      this.panel.children.unshift(viewer.original);
    } else {
      this.panel.append(viewer);
    }
    this.children.push(obj);
    return obj;
  }

  /**
   * 引数に指定したモデルに対応する描画物を削除します
   * @param subject
   */
  protected removeInstance(subject: E): void {
    const index = this.children.findIndex((v) => v.subject === subject);
    if (index !== -1) {
      const object = this.children[index];
      this.panel.remove(object.viewer);
      this.children.splice(index, 1);
    }
  }
}

export default ModelBinder;
