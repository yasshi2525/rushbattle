import { Game, createGame } from "../_helpers/game";

import { JoinMessage } from "events/join";
import Railway from "models/railway";
import Team from "models/team";

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
    expect(team.id).toEqual(1);
    expect(team.name).toEqual("test");
    expect(team.railway).not.toBeUndefined();
    expect(team.railway.isAdmin).toBeFalsy();
    expect(game.teams.length).toEqual(1);
    expect(game.resolver.find(Team, team.id)).toBe(team);
    expect(game.resolver.list(Team)).toEqual([team]);
    expect(game.resolver.list(Railway)).toEqual([team.railway]);
  });

  it("create as admin", () => {
    const team = game.createTeam("admin", true);
    expect(team.id).toEqual(1);
    expect(team.railway.isAdmin).toBeTruthy();
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
