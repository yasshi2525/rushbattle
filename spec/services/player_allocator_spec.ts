import { Game, createGame } from "../_helpers/game";

import Player from "models/player";
import PlayerAllocator from "services/PlayerAllocator";
import Team from "models/team";

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
    const player = new Player({ name: "yasshi", team });
    allocator.join(player);
    allocator.shuffle();
    const expectArray = [player, player, player, player];
    expect(allocator.next(4)).toEqual(expectArray);
  });

  it("参加者が2人の場合、プレイ順4枠が交互になっている", () => {
    const allocator = new PlayerAllocator();
    const player1 = new Player({ name: "maeshi", team });
    const player2 = new Player({ name: "yukichi", team });
    allocator.join(player1);
    allocator.join(player2);
    allocator.shuffle();

    const firstPlayer = allocator.top();
    allocator.shift();
    const secondPlayer = allocator.top();
    allocator.shift();
    expect(firstPlayer).not.toEqual(secondPlayer);

    const thirdPlayer = allocator.top();
    allocator.shift();
    const fourthPlayer = allocator.top();
    expect(thirdPlayer).not.toEqual(fourthPlayer);
  });

  it("参加者が4人の場合、プレイ順4枠の中で全員が登場する", () => {
    const allocator = new PlayerAllocator();
    for (let i = 0; i < 4; i++) {
      const player = new Player({ name: `test${i}`, team });
      allocator.join(player);
    }

    allocator.shuffle();

    const players: Player[] = [];
    for (let n = 0; n < 4; n++) {
      expect(players.indexOf(allocator.top())).toEqual(-1);
      players.push(allocator.top());
      allocator.shift();
    }
  });

  it("順送りするとプレイ順が繰り上がる", () => {
    const allocator = new PlayerAllocator();
    for (let i = 0; i < 5; i++) {
      allocator.join(new Player({ name: `player${i}`, team }));
    }
    const firstList = allocator.next(5);
    const expectList = firstList.slice(1, 4);
    allocator.shift();
    expect(allocator.next(4)).toEqual(expectList);
  });

  it("参加者が4人の場合、8人分順送りすると全員が2回ずつ登場する", () => {
    const allocator = new PlayerAllocator();
    for (let i = 0; i < 4; i++) {
      const player = new Player({ name: `test${i}`, team });
      allocator.join(player);
    }

    allocator.shuffle();

    const players1: Player[] = [];
    for (let i = 0; i < 4; i++) {
      expect(players1.indexOf(allocator.top())).toEqual(-1);
      players1.push(allocator.top());
      allocator.shift();
    }

    allocator.shuffle();

    const players2: Player[] = [];
    for (let i = 0; i < 4; i++) {
      expect(players2.indexOf(allocator.top())).toEqual(-1);
      players2.push(allocator.top());
      allocator.shift();
    }
  });
});
