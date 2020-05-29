import { LineTask, RailEdge } from "@yasshi2525/rushmini";

import DeptTask from "./dept_task";
import EdgeTask from "./edge_task";

export const _createTask = (current: LineTask, edge: RailEdge): EdgeTask => {
  if (!current._isNeighbor(edge)) {
    return undefined;
  }

  const outbound = new EdgeTask(current.parent, edge, current);
  let inbound: EdgeTask;

  if (!edge.to.platform) {
    inbound = new EdgeTask(current.parent, edge.reverse, outbound);
  } else {
    inbound = new EdgeTask(
      current.parent,
      edge.reverse,
      new DeptTask(current.parent, edge.to.platform, outbound)
    );
  }

  return inbound;
};
