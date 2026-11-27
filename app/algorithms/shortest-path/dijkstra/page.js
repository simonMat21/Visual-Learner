"use client";

import Link from "next/link";
import AlgoPage, { B, M } from "@/components/AlgoPage";
import GraphAlgoVisualizer from "@/components/GraphAlgoVisualizer";

const code = {
  js: `// Dijkstra's algorithm with a simple array scan: O(V^2), good for dense graphs.
// graph[u][v] = weight of edge u -> v (0 = no edge), all weights >= 0
function dijkstra(graph, s) {
  const n = graph.length;
  const dist = Array(n).fill(Infinity);
  const prev = Array(n).fill(-1);
  const done = Array(n).fill(false);
  dist[s] = 0;

  for (let round = 0; round < n; round++) {
    // pick the unfinished vertex with the smallest distance
    let u = -1;
    for (let v = 0; v < n; v++)
      if (!done[v] && (u === -1 || dist[v] < dist[u])) u = v;
    if (dist[u] === Infinity) break;      // the rest is unreachable
    done[u] = true;

    // relax every edge leaving u
    for (let v = 0; v < n; v++) {
      const w = graph[u][v];
      if (w && !done[v] && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        prev[v] = u;
      }
    }
  }
  return { dist, prev };
}

// With a priority queue (binary heap) it runs in O((V + E) log V):
//   pq.push([0, s]);
//   while (pq.size) { const [d, u] = pq.pop(); if (d > dist[u]) continue; ...relax... pq.push([dist[v], v]); }`,
  py: `import heapq

def dijkstra(adj, s):
    """adj[u] = list of (v, w) with w >= 0.  O((V + E) log V) with a heap."""
    n = len(adj)
    dist = [float("inf")] * n
    prev = [-1] * n
    dist[s] = 0
    pq = [(0, s)]                       # (distance, vertex)

    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue                    # an old, longer entry: skip it
        for v, w in adj[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                prev[v] = u
                heapq.heappush(pq, (dist[v], v))
    return dist, prev


def path(prev, target):
    out = []
    while target != -1:
        out.append(target)
        target = prev[target]
    return out[::-1]`,
  cpp: `#include <vector>
#include <queue>
#include <limits>
using namespace std;

// adj[u] = list of {v, w}, all w >= 0
vector<long long> dijkstra(const vector<vector<pair<int,int>>>& adj, int s, vector<int>& prev) {
    const long long INF = numeric_limits<long long>::max();
    int n = adj.size();
    vector<long long> dist(n, INF);
    prev.assign(n, -1);
    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
    dist[s] = 0;
    pq.push({0, s});

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;          // stale entry
        for (auto [v, w] : adj[u]) {
            if (d + w < dist[v]) {
                dist[v] = d + w;
                prev[v] = u;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
  c: `#include <limits.h>
#include <stdbool.h>

#define N 7

// graph[u][v] = weight (0 = no edge). O(V^2) version.
void dijkstra(int graph[N][N], int s, int dist[N], int prev[N]) {
    bool done[N] = { false };
    for (int i = 0; i < N; i++) { dist[i] = INT_MAX; prev[i] = -1; }
    dist[s] = 0;

    for (int round = 0; round < N; round++) {
        int u = -1;
        for (int v = 0; v < N; v++)
            if (!done[v] && (u == -1 || dist[v] < dist[u])) u = v;
        if (dist[u] == INT_MAX) break;
        done[u] = true;

        for (int v = 0; v < N; v++) {
            int w = graph[u][v];
            if (w && !done[v] && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                prev[v] = u;
            }
        }
    }
}`,
  idea: `Dijkstra grows a set of "finished" vertices whose shortest
distance is known for sure.

1. dist[s] = 0, every other dist = infinity.
2. Repeat: pick the unfinished vertex u with the smallest dist.
   Because no edge is negative, nothing can ever reach u more
   cheaply later, so u is finished.
3. Relax u's edges: if dist[u] + w < dist[v], improve dist[v]
   and remember prev[v] = u.

Following prev[] backwards from any vertex gives its shortest
path. Needs all weights >= 0.`,
};

export default function Home() {
  return (
    <AlgoPage
      title="Dijkstra's Algorithm"
      whatTitle="What is Dijkstra's Algorithm?"
      meta={[
        { color: "green", text: "Time: O(V²) array, O((V+E) log V) heap" },
        { color: "blue", text: "Space: O(V)" },
        { color: "rust", text: "Weights must be ≥ 0" },
      ]}
      visualizer={<GraphAlgoVisualizer algo="dijkstra" />}
      intro={
        <>
          <p>
            <B>Dijkstra&apos;s algorithm</B> finds the shortest path from one start vertex to every other vertex in
            a graph whose edges have <B c="plum">non-negative weights</B>, like road lengths or travel times.
          </p>
          <p>
            It keeps a tentative distance for every vertex. Each round it picks the unfinished vertex with the{" "}
            <B c="rust">smallest</B> tentative distance: that distance can never improve any more (any other route
            would have to go through a vertex that is already farther away), so the vertex is{" "}
            <B c="plum">finished</B>. Then it tries to improve its neighbours through it, which is called{" "}
            <B c="plum">relaxing</B> an edge.
          </p>
        </>
      }
      keyIdea="Always finish the closest unfinished vertex, then relax its edges."
      usage={[
        <>
          <B c="plum">Edit graph</B> slides out the weighted matrix. Tick <B c="plum">Directed</B> for one-way
          roads. Pick the <B c="plum">start</B> or click a vertex.
        </>,
        <>Numbers next to the vertices are their current distances. Yellow = reached, green = finished.</>,
        <>A green edge being drawn is an improvement; a red dashed one is a route that wasn&apos;t shorter.</>,
        <>
          Type a negative weight and Dijkstra refuses: try the same graph on{" "}
          <Link href="/algorithms/shortest-path/bellman-ford" className="text-pen-blue font-semibold underline">
            Bellman-Ford
          </Link>
          .
        </>,
      ]}
      steps={[
        { title: "1. Start", color: "plum", body: <>Distance 0 for the start, ∞ for everything else.</> },
        { title: "2. Pick the closest", color: "gold", body: <>Choose the unfinished vertex with the smallest distance and mark it finished.</> },
        {
          title: "3. Relax its edges",
          color: "green",
          body: (
            <>
              For each edge <M>u → v</M> of weight <M>w</M>: if <M>dist[u] + w &lt; dist[v]</M>, update{" "}
              <M>dist[v]</M> and set <M>prev[v] = u</M>.
            </>
          ),
        },
        { title: "4. Repeat", color: "blue", body: <>Until every reachable vertex is finished. The prev edges form the shortest-path tree.</> },
      ]}
      note={
        <>
          <span className="font-semibold text-pen-blue">Why no negative edges?</span> Finishing the closest vertex
          assumes going further can only cost more. A negative edge breaks that: a longer detour could suddenly come
          out cheaper after the vertex was already finished.
        </>
      }
      code={code}
      time={[
        <><B>Array scan:</B> O(V²), simplest and best for dense graphs</>,
        <><B>Binary heap:</B> O((V + E) log V)</>,
        <><B>Fibonacci heap:</B> O(E + V log V)</>,
      ]}
      space={[
        <><B c="blue">Space:</B> O(V) for dist, prev and the finished flags</>,
        <><B c="blue">Output:</B> distances plus a shortest-path tree</>,
        <><B c="blue">Greedy:</B> each vertex is finished exactly once</>,
      ]}
      uses={[
        <><B>Maps and GPS:</B> fastest route between places</>,
        <><B>Network routing:</B> OSPF finds cheapest paths between routers</>,
        <><B>Games:</B> path finding (A* is Dijkstra plus a hint)</>,
        <><B>Any &quot;cheapest way&quot; problem</B> with non-negative costs</>,
      ]}
      limits={[
        <><span className="text-pen-gold">Negative weights:</span> gives wrong answers, use Bellman-Ford</>,
        <><span className="text-pen-gold">One source:</span> for all pairs, run it V times or use Floyd-Warshall</>,
        <><span className="text-pen-gold">Explores everywhere:</span> no sense of direction towards a target</>,
      ]}
    />
  );
}
