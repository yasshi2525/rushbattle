import { Container, Scene, ServiceAdapter } from "adapters/adapter";
import {
  EventType,
  Point,
  Pointable,
  modelListener,
} from "@yasshi2525/rushmini";
import { Game, createGame } from "../_helpers/game";
import ModelBinder, { ViewCreator } from "entities/model_binder";

import { SimpleContainer } from "../_helpers/headless_container";
import { SimpleScene } from "../_helpers/headless_scene";

const X = 3;
const Y = 7;
const W = 11;
const H = 13;

const LOC = new Point(X, Y);

class Simple implements Pointable {
  constructor() {
    modelListener.add(EventType.CREATED, this);
  }
  loc() {
    return LOC;
  }
}

describe("model_binder", () => {
  let oldWarn: (msg: string) => void;
  let game: Game;
  let adapter: ServiceAdapter<SimpleScene, SimpleContainer>;
  let scene: Scene<SimpleScene, SimpleContainer>;
  let panel: Container<SimpleScene, SimpleContainer>;
  let creator: ViewCreator<SimpleScene, SimpleContainer, Simple>;
  let binder: ModelBinder<SimpleScene, SimpleContainer, Simple>;
  let modifyCount: number;

  beforeEach(() => {
    // eslint-disable-next-line no-console
    oldWarn = console.warn;
    modifyCount = 0;
    game = createGame();
    adapter = game.adapter;
    scene = adapter.createScene();
    const modifier: { [key in EventType]?: () => void } = {};
    modifier[EventType.MODIFIED] = () => modifyCount++;
    scene.loaded.add(() => {
      panel = adapter.createContainer({ scene });
      creator = (scene) =>
        adapter.createContainer({ scene, width: W, height: H });
      binder = new ModelBinder({
        adapter,
        scene,
        panel,
        creator,
        modifier,
        bind: Simple,
      });
    });
    adapter.pushScene(scene);
    game.tick();
  });

  afterEach(() => {
    game.destroy();
    // eslint-disable-next-line no-console
    console.warn = oldWarn;
  });

  it("CREATED event adds entity to panel", () => {
    const subject = new Simple();
    modelListener.fire(EventType.CREATED);
    const vos = binder.children;
    expect(vos.length).toEqual(1);
    expect(vos[0].subject).toEqual(subject);
    expect(vos[0].viewer.x).toEqual(X - W / 2);
    expect(vos[0].viewer.y).toEqual(Y - H / 2);
    expect(vos[0].viewer.width).toEqual(W);
    expect(vos[0].viewer.height).toEqual(H);
    expect(panel.children.length).toEqual(1);
    expect(panel.children[0]).toEqual(vos[0].viewer.original);
  });

  it("DELETED event removes registered object", () => {
    const subject = new Simple();
    modelListener.fire(EventType.CREATED);
    modelListener.add(EventType.DELETED, subject);
    modelListener.fire(EventType.DELETED);
    expect(binder.children.length).toEqual(0);
    expect(panel.children.length).toEqual(0);
  });

  it("DELETED event remains un-related object", () => {
    const s1 = new Simple();
    const s2 = new Simple();
    modelListener.fire(EventType.CREATED);
    modelListener.add(EventType.DELETED, s1);
    modelListener.fire(EventType.DELETED);
    expect(binder.children.length).toEqual(1);
    expect(binder.children[0].subject).toEqual(s2);
    expect(panel.children.length).toEqual(1);
    expect(panel.children[0]).toEqual(binder.children[0].viewer.original);
  });

  it("MODIFIED event modify panel", () => {
    const subject = new Simple();
    modelListener.fire(EventType.CREATED);
    modelListener.add(EventType.MODIFIED, subject);
    modelListener.fire(EventType.MODIFIED);
    expect(modifyCount).toEqual(1);
  });
});
