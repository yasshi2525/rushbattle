import { EventType, modelListener, ticker } from "@yasshi2525/rushmini";
import { Game, createGame } from "../_helpers/game";

import City from "models/city";
import Company from "models/company";
import Residence from "models/residence";
import { XorshiftRandomGenerator } from "@akashic/akashic-engine";

describe("city", () => {
  let game: Game;
  let rand: () => number;
  beforeEach(() => {
    game = createGame();
    const random = new XorshiftRandomGenerator(0);
    rand = () => random.generate();
  });
  afterEach(() => {
    game.destroy();
  });

  it("create 2 residences per team", () => {
    new City({ width: 800, height: 300, rand });
    modelListener.fire(EventType.CREATED);
    expect(game.resolver.list(Residence).length).toEqual(
      City.INIT_PER_TEAM * 2
    );
    expect(game.resolver.list(Company).length).toEqual(1);
  });

  it("create 2 residence per interval", () => {
    const city = new City({ width: 800, height: 300, rand });
    modelListener.fire(EventType.CREATED);
    for (let i = 0; i < ticker.fps() * City.SPAWN_INTERVAL - 1; i++) {
      city._step();
      modelListener.fire(EventType.CREATED);
      expect(game.resolver.list(Residence).length).toEqual(
        City.INIT_PER_TEAM * 2
      );
      expect(game.resolver.list(Company).length).toEqual(1);
    }
    city._step();
    modelListener.fire(EventType.CREATED);
    expect(game.resolver.list(Residence).length).toEqual(
      City.INIT_PER_TEAM * 3
    );
    expect(game.resolver.list(Company).length).toEqual(1);

    for (
      let i = 0;
      i <
      ticker.fps() *
        City.SPAWN_INTERVAL *
        (City.MAX_PER_TEAM - City.INIT_PER_TEAM);
      i++
    ) {
      city._step();
      modelListener.fire(EventType.CREATED);
    }
    expect(game.resolver.list(Residence).length).toEqual(City.MAX_PER_TEAM * 2);
    expect(game.resolver.list(Company).length).toEqual(1);
  });
});
