import { Game, createGame } from "../_helpers/game";

import Team from "models/team";

describe("register_game", () => {
  let game: Game;
  let userTeam: Team;
  beforeEach(() => {
    game = createGame();
    userTeam = game.createTeam("user");
  });
  afterEach(() => {
    game.destroy();
  });
  it("参加申し込みアクションがビューアからコールされたならば、参加申し込みメッセージを送る", () => {
    const sender = new ParticipationSender(userTeam);
    sender.register("testID");
    // ↑ game.send(new JoinMessage(team, user)) をコールする

    expect(userTeam.members.length).toEqual(0);
    game.tick(); // 送信 & 受信処理がされる

    expect(userTeam.members.length).toEqual(1);
  });

  it("参加申し込み済みか取得できる", () => {
    const sender = new ParticipationSender(userTeam);
    expect(sender.isRequested("testID")).toBeFalsy();

    sender.register("testID");
    expect(sender.isRequested("testID")).toBeTruthy();

    game.tick();
    expect(sender.isRequested("testID")).toBeTruthy();
  });
});
