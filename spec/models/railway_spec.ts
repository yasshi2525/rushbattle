import { EventType, modelListener } from "@yasshi2525/rushmini";
import { Game, createGame } from "../_helpers/game";

import RailEdge from "models/rail_edge";
import RailNode from "models/rail_node";
import Railway from "models/railway";
import Station from "models/station";
import Train from "models/train";

describe("railway", () => {
  let game: Game;
  beforeEach(() => {
    game = createGame();
  });

  afterEach(() => {
    game.destroy();
  });

  it("admin", () => {
    const admin = new Railway({ isAdmin: true });
    modelListener.fire(EventType.CREATED);
    expect(admin.isAdmin).toBeTruthy();
    expect(game.resolver.list(Railway)).toEqual([admin]);
    admin.prepare();
    const rns = game.resolver.list(RailNode);
    expect(rns.length).toEqual(5);
    expect(rns[0].loc().x).toEqual(Railway.ADMIN_START.x);
    expect(rns[0].loc().y).toEqual(Railway.ADMIN_START.y);
    expect(rns[0].platform).not.toBeUndefined();

    expect(rns[1].loc().x).toEqual(Railway.ADMIN_START.x + Railway.CHUNK_SIZE);
    expect(rns[1].loc().y).toEqual(Railway.ADMIN_START.y);
    expect(rns[1].platform).toBeUndefined();

    expect(rns[2].loc().x).toEqual(
      Railway.ADMIN_START.x + Railway.CHUNK_SIZE * 2
    );
    expect(rns[2].loc().y).toEqual(
      Railway.ADMIN_START.y + Railway.CONNECT_LENGTH
    );
    expect(rns[2].platform).not.toBeUndefined();

    expect(rns[3].loc().x).toEqual(
      Railway.ADMIN_START.x + Railway.CHUNK_SIZE * 3
    );
    expect(rns[3].loc().y).toEqual(Railway.ADMIN_START.y);
    expect(rns[3].platform).toBeUndefined();

    expect(rns[4].loc().x).toEqual(
      Railway.ADMIN_START.x + Railway.CHUNK_SIZE * 4
    );
    expect(rns[4].loc().y).toEqual(Railway.ADMIN_START.y);
    expect(rns[4].platform).not.toBeUndefined();
    expect(game.resolver.list(RailEdge).length).toEqual(8);
    expect(game.resolver.list(Station).length).toEqual(3);
    const ts = game.resolver.list(Train);
    expect(ts.length).toEqual(4);
    expect(ts[0].loc()).toEqual(rns[0].loc());
    expect(ts[1].loc()).toEqual(rns[2].loc());
    expect(ts[2].loc()).toEqual(rns[2].loc());
    expect(ts[3].loc()).toEqual(rns[4].loc());
  });

  it("user", () => {
    const user = new Railway({ isAdmin: false });
    modelListener.fire(EventType.CREATED);
    expect(user.isAdmin).toBeFalsy();
    expect(game.resolver.list(Railway)).toEqual([user]);
    user.prepare();
    const rns = game.resolver.list(RailNode);
    expect(rns.length).toEqual(5);
    expect(rns[0].loc().x).toEqual(Railway.USER_START.x);
    expect(rns[0].loc().y).toEqual(Railway.USER_START.y);
    expect(rns[0].platform).not.toBeUndefined();

    expect(rns[1].loc().x).toEqual(Railway.USER_START.x + Railway.CHUNK_SIZE);
    expect(rns[1].loc().y).toEqual(Railway.USER_START.y);
    expect(rns[1].platform).not.toBeUndefined();

    expect(rns[2].loc().x).toEqual(
      Railway.USER_START.x + Railway.CHUNK_SIZE * 2
    );
    expect(rns[2].loc().y).toEqual(
      Railway.USER_START.y - Railway.CONNECT_LENGTH
    );
    expect(rns[2].platform).not.toBeUndefined();

    expect(rns[3].loc().x).toEqual(
      Railway.USER_START.x + Railway.CHUNK_SIZE * 3
    );
    expect(rns[3].loc().y).toEqual(Railway.USER_START.y);
    expect(rns[3].platform).not.toBeUndefined();

    expect(rns[4].loc().x).toEqual(
      Railway.USER_START.x + Railway.CHUNK_SIZE * 4
    );
    expect(rns[4].loc().y).toEqual(Railway.USER_START.y);
    expect(rns[4].platform).not.toBeUndefined();
    expect(game.resolver.list(RailEdge).length).toEqual(8);
    expect(game.resolver.list(Station).length).toEqual(5);
    const ts = game.resolver.list(Train);
    expect(ts.length).toEqual(4);
    expect(ts[0].loc()).toEqual(rns[0].loc());
    expect(ts[1].loc()).toEqual(rns[2].loc());
    expect(ts[2].loc()).toEqual(rns[2].loc());
    expect(ts[3].loc()).toEqual(rns[4].loc());
  });
});
