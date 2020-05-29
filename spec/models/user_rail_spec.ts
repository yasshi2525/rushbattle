import { ExtendRailMessage } from "events/rail_extend";
import { Point } from "@yasshi2525/rushmini";
import { createGame } from "../_helpers/game";

describe("user_rail", () => {
  it("start lottery just after first user requests extending rail", () => {
    const game = createGame();
    const team = game.createTeam("test");
    const rn = team.startRailway(new Point(0, 0));
    const user = team.join("test1");
    const tail = team.tailNode();

    expect(team.isRailLottery()).toBeFalsy();
    expect(team.railCandidates.length).toEqual(0);
    game.send(
      new ExtendRailMessage({
        sender: user.id,
        from: tail.id,
        x: 5,
        y: 10,
      })
    );

    // send した段階では抽選開始していない
    expect(team.isRailLottery()).toBeFalsy();
    expect(team.railCandidates.length).toEqual(0);
    expect(rn.out.length).toEqual(0);
    expect(rn.in.length).toEqual(0);

    game.tick();

    expect(team.isRailLottery()).toBeTruthy();
    expect(team.railCandidates.length).toEqual(1);
  });
});
