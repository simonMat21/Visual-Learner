"use client";

import Link from "next/link";
import AlgoPage, { B, M } from "@/components/AlgoPage";
import GraphAlgoVisualizer from "@/components/GraphAlgoVisualizer";

const code = {
  js: `// Bellman-Ford: shortest paths from s, negative weights allowed.
// edges = [[u, v, w], ...]; returns null if a negative cycle is reachable.
function bellmanFord(n, edges, s) {
  const dist = Array(n).fill(Infinity);
  const prev = Array(n).fill(-1);
  dist[s] = 0;

  for (let pass = 1; pass <= n - 1; pass++) {
    let changed = false;
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        prev[v] = u;
        changed = true;
      }
    }
    if (!changed) break;               // nothing moved: already final
  }

  // one more pass: any improvement now means a negative cycle
  for (const [u, v, w] of edges) {
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) return null;
  }
  return { dist, prev };
}`,
  py: `def bellman_ford(n, edges, s):
    """edges = list of (u, v, w). Returns (dist, prev) or None on a negative cycle."""
    INF = float("inf")
    dist = [INF] * n
    prev = [-1] * n
    dist[s] = 0

    for _ in range(n - 1):
        changed = False
        for u, v, w in edges:
            if dist[u] != INF and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                prev[v] = u
                changed = True
        if not changed:
            break

    for u, v, w in edges:
        if dist[u] != INF and dist[u] + w < dist[v]:
            return None                  # negative cycle
    return dist, prev`,
  cpp: `#include <vector>
#include <tuple>
#include <limits>
using namespace std;

// returns false if a negative cycle is reachable from s
bool bellmanFord(int n, const vector<tuple<int,int,int>>& edges, int s,
                 vector<long long>& dist, vector<int>& prev) {
    const long long INF = numeric_limits<long long>::max() / 4;
    dist.assign(n, INF);
    prev.assign(n, -1);
    dist[s] = 0;
    for (int pass = 1; pass < n; pass++) {
        bool changed = false;
        for (auto [u, v, w] : edges)
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                prev[v] = u;
                changed = true;
            }
        if (!changed) break;
    }
    for (auto [u, v, w] : edges)
        if (dist[u] != INF && dist[u] + w < dist[v]) return false;
    return true;
}`,
  c: `#include <limits.h>
#include <stdbool.h>

typedef struct { int u, v, w; } Edge;

// returns false on a negative cycle
bool bellmanFord(int n, Edge edges[], int m, int s, long long dist[], int prev[]) {
    for (int i = 0; i < n; i++) { dist[i] = LLONG_MAX; prev[i] = -1; }
    dist[s] = 0;
    for (int pass = 1; pass < n; pass++) {
        bool changed = false;
        for (int e = 0; e < m; e++) {
            int u = edges[e].u, v = edges[e].v, w = edges[e].w;
            if (dist[u] != LLONG_MAX && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                prev[v] = u;
                changed = true;
            }
        }
        if (!changed) break;
    }
    for (int e = 0; e < m; e++)
        if (dist[edges[e].u] != LLONG_MAX && dist[edges[e].u] + edges[e].w < dist[edges[e].v])
            return false;
    return true;
}`,
  idea: `Relax EVERY edge, V - 1 times.

After pass k, every shortest path that uses at most k edges
is correct. A shortest path never needs more than V - 1
edges (it can't repeat a vertex), so V - 1 passes are enough.

If anything still improves in pass V, the distances could go
down forever: there is a negative cycle.

Slower than Dijkstra, but it works with negative weights.`,
};

export default function Home() {
  return (
    <AlgoPage
      title="Bellman-Ford Algorithm"
      whatTitle="What is the Bellman-Ford Algorithm?"
      meta={[
        { color: "green", text: "Time: O(V · E)" },
        { color: "blue", text: "Space: O(V)" },
        { color: "rust", text: "Negative weights OK, detects negative cycles" },
      ]}
      visualizer={<GraphAlgoVisualizer algo="bellman-ford" />}
      intro={
        <>
          <p>
            <B>Bellman-Ford</B> finds shortest paths from one start vertex, like Dijkstra, but it also works when
            some edges have <B c="rust">negative weights</B>, for example a refund, an energy gain or an exchange
            rate.
          </p>
          <p>
            Instead of choosing vertices cleverly, it simply <B c="plum">relaxes every edge</B> again and again.
            After pass <M>k</M>, every shortest path that uses at most <M>k</M> edges is correct, so after{" "}
            <M>V − 1</M> passes all of them are. One extra pass then checks for a <B c="rust">negative cycle</B>: a
            loop whose weights add up to less than zero, which makes &quot;shortest&quot; meaningless.
          </p>
        </>
      }
      keyIdea="Relax every edge, V − 1 times. Still improving after that? Negative cycle."
      usage={[
        <>
          The example graph has negative edges but no negative cycle. Open <B c="plum">Edit graph</B> and make an
          edge more negative (for example 1 → 4 = −12) to create a negative cycle.
        </>,
        <>The chips on the right are the edges in the fixed order every pass uses. The yellow one is being tried now.</>,
        <>Passes stop early when nothing changes. A detected cycle is drawn in red.</>,
        <>
          Compare with{" "}
          <Link href="/algorithms/shortest-path/dijkstra" className="text-pen-blue font-semibold underline">
            Dijkstra
          </Link>{" "}
          on a graph without negative edges.
        </>,
      ]}
      steps={[
        { title: "1. Start", color: "plum", body: <>dist[s] = 0, every other distance ∞.</> },
        { title: "2. Relax every edge", color: "green", body: <>For each edge <M>u → v</M>: if <M>dist[u] + w &lt; dist[v]</M>, update it.</> },
        { title: "3. Repeat V − 1 times", color: "gold", body: <>Each pass lets shortest paths grow by one more edge. Stop early if a pass changes nothing.</> },
        { title: "4. Check once more", color: "rust", body: <>If any edge can still be relaxed, a negative cycle is reachable from the start.</> },
      ]}
      code={code}
      time={[
        <><B>Worst case:</B> O(V · E)</>,
        <><B>With early stop:</B> often much faster in practice</>,
        <><B>Compared to Dijkstra:</B> slower, but handles negative weights</>,
      ]}
      space={[
        <><B c="blue">Space:</B> O(V)</>,
        <><B c="blue">Negative edges:</B> yes</>,
        <><B c="blue">Negative cycles:</B> detected, not &quot;solved&quot;</>,
      ]}
      uses={[
        <><B>Distance-vector routing</B> (RIP) between routers</>,
        <><B>Currency arbitrage:</B> a negative cycle of −log(rates) is a money-making loop</>,
        <><B>Johnson&apos;s algorithm</B> uses it to reweight edges</>,
        <><B>Constraint systems</B> of the form x − y ≤ c</>,
      ]}
      limits={[
        <><span className="text-pen-gold">Slow:</span> O(V·E) is much more than Dijkstra on big graphs</>,
        <><span className="text-pen-gold">Negative cycles:</span> no shortest path exists through them</>,
        <><span className="text-pen-gold">Undirected negative edge:</span> is already a negative cycle (go back and forth)</>,
      ]}
    />
  );
}
