import Game from "models/game";
import Player from "models/player";
import PlayerAllocator from "services/PlayerAllocator";
import Team from "models/team";
import { createGame } from "../_helpers/game";

describe("player_allocator", () => {
  let game: Game;
  let team: Team;

  beforeEach(() => {
    game = createGame();
    team = game.createTeam("user");
  });

  afterEach(() => {
    game.destroy();
  });

  it("参加表明を受け付けると、抽選リストに加わる", () => {
    const allocator = new PlayerAllocator();
    const player = new Player({ name: "test1", team });
    allocator.join(player);
    expect(allocator.queue.length).toEqual(1);
  });

  it("ゲーム開始直前に、最初のプレイ担当者が決定される", () => {
    const allocator = new PlayerAllocator();
    const player = new Player({ name: "test1", team });
    allocator.join(player);
    expect(allocator.top()).toBeUndefined();
    allocator.shuffle();
    expect(allocator.top()).toBe(player);
  });

  it("ゲーム開始直前に、4人分のプレイ順番が決まっている", () => {
    // 注: 先頭の人がプレイ担当者
    const allocator = new PlayerAllocator();
    const ps: Player[] = [];
    for (let i = 0; i < 4; i++) {
      allocator.join(new Player({ name: `test${i}`, team }));
    }
    allocator.shuffle();
    const list = allocator.next(4);
    expect(list.length).toEqual(4);
    expect(list[0]).toBe(allocator.top());
    for (let i = 0; i < 4; i++) {
      expect(list[i]).not.toBeUndefined();
    }
  });

  it("参加者が1人の場合、プレイ順4枠がすべてその人になっている", () => {
    const allocator = new PlayerAllocator();
    allocator.join(new Player({ name: "yasshi", team }));
  });

  it("参加者が2人の場合、プレイ順4枠が交互になっている", () => {});

  it("参加者が4人の場合、プレイ順4枠の中で全員が登場する", () => {});

  it("順送りするとプレイ順が繰り上がる", () => {
    //順送り
    allocator.shift();
  });

  it("参加者が8人の場合、8人分順送りすると全員が2回ずつ登場する", () => {});
});
