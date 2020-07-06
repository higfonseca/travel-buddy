/**
 * @author Jonathan Hasenburg
 * @description Dijkstra's algorithm is an algorithm for finding the shortest paths between nodes in a graph, which may represent, for example, road networks.
 */
// @ts-nocheck

export interface DijkstraResponse {
  path: string[]
  distance: number
}

const lowestCostNode = (costs, processed) => {
  return Object.keys(costs).reduce((lowest, node) => {
      if (lowest === null || costs[node] < costs[lowest]) {
          if (!processed.includes(node)) {
              lowest = node;
          }
      }
      return lowest;
  }, null);
};

// function that returns the minimum cost and path to reach Finish
export const dijkstra = (graph, startNodeName = 'start', endNodeName = 'finish'): DijkstraResponse => {

  // track the lowest cost to reach each node
  let costs = {};
  costs[endNodeName] = Infinity;
  costs = Object.assign(costs, graph[startNodeName]);

  // track paths
  const parents = {endNodeName: null};
  for (let child in graph[startNodeName]) {
      parents[child] = startNodeName;
  }

  // track nodes that have already been processed
  const processed = [];

  let node = lowestCostNode(costs, processed);

  while (node) {
      let cost = costs[node];
      let children = graph[node];
      for (let n in children) {
        let newCost = cost + children[n];
        if (!costs[n] || costs[n] > newCost) {
            costs[n] = newCost;
            parents[n] = node;
        }
      }
      processed.push(node);
      node = lowestCostNode(costs, processed);
  }

  let optimalPath = [endNodeName];
  let parent = parents[endNodeName];
  while (parent) {
      optimalPath.push(parent);
      parent = parents[parent];
  }
  optimalPath.reverse();

  const results = {
      distance: costs[endNodeName],
      path: optimalPath
  };

  return results;
}
