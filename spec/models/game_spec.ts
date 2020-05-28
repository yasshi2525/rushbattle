import { createGame } from "../_helpers/game";

describe("game", () => {
  it("create", () => {
    const game = createGame();
    expect(game).not.toBeUndefined();
  });
});
