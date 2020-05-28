import Player from "./player";
import { Reflectable } from "./resolver";
import Team from "./team";

export enum ReflectableType {
  Team = "team",
  Player = "player",
}

export const resourceTypes: (new (...args: unknown[]) => Reflectable)[] = [
  Team,
  Player,
];
