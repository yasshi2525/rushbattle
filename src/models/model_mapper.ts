import Company from "./company";
import DeptTask from "./dept_task";
import EdgeTask from "./edge_task";
import Gate from "./gate";
import Human from "./human";
import Platform from "./platform";
import Player from "./player";
import RailEdge from "./rail_edge";
import RailLine from "./rail_line";
import RailNode from "./rail_node";
import { Reflectable } from "./resolver";
import Residence from "./residence";
import Station from "./station";
import Team from "./team";
import Train from "./train";

export const resourceTypes: (new (...args: unknown[]) => Reflectable)[] = [
  Team,
  Player,
  Residence,
  Company,
  RailNode,
  RailEdge,
  Station,
  Platform,
  Gate,
  RailLine,
  DeptTask,
  EdgeTask,
  Train,
  Human,
];
