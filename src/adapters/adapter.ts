import { MessageEnvelop } from "../events/message";

export interface Trigger<T> {
  add(cb: (ev?: T) => void): void;
  addOnce(cb: (ev?: T) => void): void;
  remove(cb: (ev?: T) => void): void;
  fire(ev?: T): void;
}

type Offset2D = { x: number; y: number };
type PlainPlayer = { id: string };

type PointEvent<T> = {
  local: boolean;
  player: PlainPlayer;
  point: Offset2D;
  pointerId: number;
  target: T;
};

export type PointDownEvent<T> = PointEvent<T>;
export type PointMoveEvent<T> = PointEvent<T> & {
  startDelta: Offset2D;
  prevDelta: Offset2D;
};
export type PointUpEvent<T> = PointMoveEvent<T>;
export type MessageEvent = {
  local: boolean;
  player: PlainPlayer;
  data: unknown;
};

export interface Container<T, C> {
  append(child: Container<T, C>): void;
  remove(child: Container<T, C>): void;
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
  pointDown: Trigger<PointDownEvent<C>>;
  pointMove: Trigger<PointMoveEvent<C>>;
  pointUp: Trigger<PointUpEvent<C>>;
  children: C[];
  show(): void;
  hide(): void;
  visible(): boolean;
  modified(): void;
  original: C;
}

export type CreateContainerOption<T, C> = {
  scene: Scene<T, C>;
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

export interface Rectangle<T, C> extends Container<T, C> {
  color: string;
}

export type CreateRectangleOption<T, C> = CreateContainerOption<T, C> & {
  color: string;
};

export type Sprite<T, C> = Container<T, C>;

export type CreateSpriteOption<T, C> = CreateContainerOption<T, C> & {
  src: string;
};

export interface Text<T, C> extends Container<T, C> {
  fontSize: number;
  text: string;
}

export type CreateTextOption<T, C> = CreateContainerOption<T, C> & {
  fontSize: number;
  text: string;
};

export interface Scene<T, C> {
  append(child: Container<T, C>): void;
  remove(child: Container<T, C>): void;
  isCurrentScene(): boolean;
  loaded: Trigger<T>;
  update: Trigger<void>;
  message: Trigger<MessageEvent>;
  original: T;
}

export interface ServiceAdapter<T, C> {
  scene: T;
  send(msg: MessageEnvelop): void;
  pushScene(scene: Scene<T, C>): void;
  createScene(): Scene<T, C>;
  createContainer(opts: CreateContainerOption<T, C>): Container<T, C>;
  createRectangle(opts: CreateRectangleOption<T, C>): Rectangle<T, C>;
  createSprite(opts: CreateSpriteOption<T, C>): Sprite<T, C>;
  createText(opts: CreateTextOption<T, C>): Text<T, C>;
}
