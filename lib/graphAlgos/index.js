// Every algorithm the shared graph board (components/GraphAlgoVisualizer) can run.
import { SHORTEST_PATH_ALGOS } from "./shortestPaths";
import { STRUCTURE_ALGOS } from "./structure";

export const GRAPH_ALGOS = { ...SHORTEST_PATH_ALGOS, ...STRUCTURE_ALGOS };
