"use client";

import AlgoPage, { B, M } from "@/components/AlgoPage";
import GraphAlgoVisualizer from "@/components/GraphAlgoVisualizer";

const code = {
  js: `// Floyd-Warshall: all-pairs shortest paths. graph[i][j] = weight (0 = no edge)
function floydWarshall(graph) {
  const n = graph.length;
  const dist = graph.map((row, i) =>
    row.map((w, j) => (i === j ? 0 : w !== 0 ? w : Infinity))
  );
  const next = graph.map((row, i) => row.map((w, j) => (w !== 0 ? j : -1)));

  for (let k = 0; k < n; k++)          // allow k as a stop-over
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];     // to rebuild the path later
        }

  const negativeCycle = dist.some((row, i) => row[i] < 0);
  return { dist, next, negativeCycle };
}

function path(next, i, j) {
  if (next[i][j] === -1) return [];
  const out = [i];
  while (i !== j) { i = next[i][j]; out.push(i); }
  return out;
}`,
  py: `def floyd_warshall(graph):
    """graph[i][j] = weight, 0 = no edge. Returns the distance matrix."""
    n = len(graph)
    INF = float("inf")
    dist = [[0 if i == j else (graph[i][j] if graph[i][j] else INF)
             for j in range(n)] for i in range(n)]

    for k in range(n):                 # allow k as a stop-over
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]

    negative_cycle = any(dist[i][i] < 0 for i in range(n))
    return dist, negative_cycle`,
  cpp: `#include <vector>
#include <limits>
using namespace std;

const long long INF = numeric_limits<long long>::max() / 4;

// dist starts as the edge weights (INF = no edge, 0 on the diagonal)
void floydWarshall(vector<vector<long long>>& dist) {
    int n = dist.size();
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (dist[i][k] < INF && dist[k][j] < INF &&
                    dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
}`,
  c: `#define N 5
#define INF 1000000000

void floydWarshall(int dist[N][N]) {
    for (int k = 0; k < N; k++)
        for (int i = 0; i < N; i++)
            for (int j = 0; j < N; j++)
                if (dist[i][k] < INF && dist[k][j] < INF &&
                    dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
}`,
  idea: `Ask the same question for every pair (i, j):
"is it shorter to go i -> k -> j than what I know?"

The trick is the ORDER: the outer loop is k.
After round k, dist[i][j] is the shortest path whose
stop-overs all come from {0, 1, ..., k}. After the last
round every vertex is allowed, so the matrix is final.

Three nested loops: O(V^3) time, O(V^2) memory.
Negative edges are fine; dist[i][i] < 0 at the end
means a negative cycle.`,
};

export default function Home() {
  return (
    <AlgoPage
      title="Floyd-Warshall Algorithm"
      whatTitle="What is the Floyd-Warshall Algorithm?"
      meta={[
        { color: "green", text: "Time: O(V³)" },
        { color: "blue", text: "Space: O(V²)" },
        { color: "rust", text: "All pairs · negative weights OK" },
      ]}
      visualizer={<GraphAlgoVisualizer algo="floyd-warshall" />}
      intro={
        <>
          <p>
            <B>Floyd-Warshall</B> finds the shortest distance between <B c="plum">every pair</B> of vertices at once.
            It keeps a <M>V × V</M> matrix of distances and improves it with one simple question: would it be shorter
            to go from <M>i</M> to <M>j</M> <B c="rust">via k</B>?
          </p>
          <p>
            The order matters. Round <M>k</M> allows vertex <M>k</M> as a stop-over, on top of everything allowed
            before. So after round 0 the matrix knows the best paths through vertex 0, after round 1 through 0 and 1,
            and after the last round through anything. The whole algorithm is three nested loops.
          </p>
        </>
      }
      keyIdea="For each stop-over k: is i → k → j shorter than i → j?"
      usage={[
        <>The matrix on the right is the answer being built. Row = from, column = to.</>,
        <>The highlighted row and column belong to the current stop-over <M>k</M> (yellow vertex). Blue vertices are i and j.</>,
        <>Only improvements are shown as separate steps; a green cell just got shorter.</>,
        <>Negative edges are allowed. Make a negative cycle in Edit graph and watch a diagonal cell drop below 0.</>,
      ]}
      steps={[
        { title: "1. Direct edges", color: "plum", body: <>Fill the matrix with the edge weights, 0 on the diagonal, ∞ where there is no edge.</> },
        { title: "2. Pick a stop-over k", color: "gold", body: <>Go through k = 0, 1, …, V − 1 in order.</> },
        { title: "3. Try every pair", color: "green", body: <>If <M>dist[i][k] + dist[k][j] &lt; dist[i][j]</M>, take the detour.</> },
        { title: "4. Check the diagonal", color: "rust", body: <>A negative <M>dist[i][i]</M> means i sits on a negative cycle.</> },
      ]}
      code={code}
      time={[<><B>Always:</B> O(V³), three nested loops</>, <><B>Small graphs:</B> very fast in practice, no queues or heaps</>]}
      space={[<><B c="blue">Space:</B> O(V²) for the matrix</>, <><B c="blue">Negative edges:</B> yes</>, <><B c="blue">Paths:</B> keep a next[][] matrix to rebuild them</>]}
      uses={[
        <><B>Small dense graphs</B> where all distances are needed</>,
        <><B>Transitive closure:</B> who can reach whom (with true/false instead of numbers)</>,
        <><B>Graph centre:</B> the vertex with the smallest largest distance</>,
      ]}
      limits={[
        <><span className="text-pen-gold">O(V³):</span> too slow for big graphs</>,
        <><span className="text-pen-gold">O(V²) memory</span> even when the graph is sparse</>,
        <><span className="text-pen-gold">Sparse graphs:</span> Johnson&apos;s algorithm is faster</>,
      ]}
    />
  );
}
