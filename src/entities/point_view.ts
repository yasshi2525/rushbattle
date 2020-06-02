import { Container, Scene, ServiceAdapter } from "../adapters/adapter";

import { Pointable } from "@yasshi2525/rushmini";

export type CreatePointableViewOption<T, C> = {
  adapter: ServiceAdapter<T, C>;
  scene: Scene<T, C>;
  p: Pointable;
  width: number;
  height: number;
};

export const createPointableView = <T, C>(
  opts: CreatePointableViewOption<T, C>
): Container<T, C> =>
  opts.adapter.createContainer({
    scene: opts.scene,
    x: opts.p.loc().x - opts.width / 2,
    y: opts.p.loc().y - opts.height / 2,
    width: opts.width,
    height: opts.height,
  });

export type LocatePointableView<T, C, E extends Pointable> = {
  adapter: ServiceAdapter<T, C>;
  scene: Scene<T, C>;
  subject: E;
  viewer: Container<T, C>;
};

/**
 * 指定されたエンティティをモデルの位置に移動させます。
 * エンティティの中心はモデルの中心を指します
 * @param opts
 */
export const locatePointableView = <T, C, E extends Pointable>(
  opts: LocatePointableView<T, C, E>
): Container<T, C> => {
  const panel = createPointableView({
    adapter: opts.adapter,
    scene: opts.scene,
    p: opts.subject,
    width: opts.viewer.width,
    height: opts.viewer.height,
  });
  panel.append(opts.viewer);
  return panel;
};
