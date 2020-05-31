import { MessageEnvelop } from "../events/message";

export interface Trigger<T> {
  add(cb: (ev?: T) => void): void;
  addOnce(cb: (ev?: T) => void): void;
  remove(cb: (ev?: T) => void): void;
  fire(ev?: T): void;
}

export interface Container<T, C, D, M, U> {
  append(child: Container<T, C, D, M, U>): void;
  remove(child: Container<T, C, D, M, U>): void;
  destroy(): void;
  local: boolean;
  scene: T;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  anchorX: number;
  anchorY: number;
  scaleX: number;
  scaleY: number;
  touchable: boolean;
  opacity: number;
  pointDown: Trigger<D>;
  pointMove: Trigger<M>;
  pointUp: Trigger<U>;
  children: C[];
  show(): void;
  hide(): void;
  visible(): boolean;
  modified(): void;
  original: C;
}

export type CreateContainerOption<T, C, D, M, U, MSG> = {
  scene: Scene<T, C, D, M, U, MSG>;
  local?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  angle?: number;
  anchorX?: number;
  anchorY?: number;
  hidden?: boolean;
  scaleX?: number;
  scaleY?: number;
  touchable?: boolean;
  opacity?: number;
};

export interface Rectangle<T, C, D, M, U> extends Container<T, C, D, M, U> {
  color: string;
}

export type CreateRectangleOption<T, C, D, M, U, MSG> = CreateContainerOption<
  T,
  C,
  D,
  M,
  U,
  MSG
> & {
  color: string;
};

export type Sprite<T, C, D, M, U> = Container<T, C, D, M, U>;

export type CreateSpriteOption<T, C, D, M, U, MSG> = CreateContainerOption<
  T,
  C,
  D,
  M,
  U,
  MSG
> & {
  src: string;
};

export interface Text<T, C, D, M, U> extends Container<T, C, D, M, U> {
  fontSize: number;
  text: string;
}

export type CreateTextOption<T, C, D, M, U, MSG> = CreateContainerOption<
  T,
  C,
  D,
  M,
  U,
  MSG
> & {
  fontSize: number;
  text: string;
};

export interface Scene<T, C, D, M, U, MSG> {
  append(child: Container<T, C, D, M, U>): void;
  remove(child: Container<T, C, D, M, U>): void;
  isCurrentScene(): boolean;
  loaded: Trigger<T>;
  update: Trigger<void>;
  message: Trigger<MSG>;
  original: T;
}

export interface ServiceAdapter<T, C, D, M, U, MSG> {
  scene: Scene<T, C, D, M, U, MSG>;
  send(msg: MessageEnvelop): void;
  pushScene(scene: Scene<T, C, D, M, U, MSG>): void;
  createScene(): Scene<T, C, D, M, U, MSG>;
  createContainer(
    opts: CreateContainerOption<T, C, D, M, U, MSG>
  ): Container<T, C, D, M, U>;
  createRectangle(
    opts: CreateRectangleOption<T, C, D, M, U, MSG>
  ): Rectangle<T, C, D, M, U>;
  createSprite(
    opts: CreateSpriteOption<T, C, D, M, U, MSG>
  ): Sprite<T, C, D, M, U>;
  createText(opts: CreateTextOption<T, C, D, M, U, MSG>): Text<T, C, D, M, U>;
}
