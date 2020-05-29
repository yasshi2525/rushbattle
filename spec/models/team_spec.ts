import { Game, createGame } from "../_helpers/game";

import { JoinMessage } from "events/join";
import { Point } from "@yasshi2525/rushmini";

describe("team", () => {
  let game: Game;
  beforeEach(() => {
    game = createGame();
  });
  afterEach(() => {
    game.destroy();
  });

  it("create", () => {
    expect(game.teams.length).toEqual(0);
    const team = game.createTeam("test");
    expect(team).not.toBeUndefined();
    expect(team.name).toEqual("test");
    expect(team.line).not.toBeUndefined();
    expect(game.teams.length).toEqual(1);
  });

  it("create start point", () => {
    const team = game.createTeam("testTeam");
    const rn = team.startRailway(new Point(5, 10));
    expect(rn.loc().x).toEqual(5);
    expect(rn.loc().y).toEqual(10);
    expect(rn.platform).not.toBeUndefined();
    expect(team.line.top.departure()).toBe(rn);
    expect(team.line.top.destination()).toBe(rn);
  });

  it("request join", () => {
    const team = game.createTeam("testTeam");
    expect(team.members.length).toEqual(0);
    game.send(new JoinMessage({ team: team.id, user: "testUser" }));
    expect(team.members.length).toEqual(0);
    game.tick();
    expect(team.members.length).toEqual(1);
    expect(team.members[0].name).toEqual("testUser");
    expect(team.members[0].team).toEqual(team);
  });
});
