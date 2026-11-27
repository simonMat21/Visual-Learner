"use client";

import Link from "next/link";
import AlgoPage, { B, M } from "@/components/AlgoPage";
import GraphAlgoVisualizer from "@/components/GraphAlgoVisualizer";

const code = {
  js: `// Johnson's algorithm: all-pairs shortest paths on a sparse graph with
// negative edges (but no negative cycle). edges = [[u, v, w], ...]
function johnson(n, edges) {
  // 1. Bellman-Ford from a new vertex q (index n) with 0-edges to everyone
  const h = Array(n + 1).fill(Infinity);
  h[n] = 0;
  const all = [...edges, ...Array.from({ length: n }, (_, v) => [n, v, 0])];
  for (let pass = 0; pass < n; pass++)
    for (const [u, v, w] of all)
      if (h[u] + w < h[v]) h[v] = h[u] + w;
  for (const [u, v, w] of all)
    if (h[u] + w < h[v]) return null;            // negative cycle

  // 2. reweight: w' = w + h[u] - h[v] is never negative
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) adj[u].push([v, w + h[u] - h[v]]);

  // 3. Dijkstra from every vertex, then undo the shift
  const dist = [];
  for (let s = 0; s < n; s++) {
    const d = dijkstra(adj, s);                  // any Dijkstra on w'
    dist.push(d.map((x, v) => (x === Infinity ? x : x - h[s] + h[v])));
  }
  return dist;
}`,
  py: `import heapq

def johnson(n, edges):
    """edges = list of (u, v, w). Returns the all-pairs matrix or None."""
    INF = float("inf")
    # 1. Bellman-Ford from an extra vertex q = n
    h = [0] * n                      # q -> v has weight 0, so start at 0
    for _ in range(n):
        for u, v, w in edges:
            if h[u] + w < h[v]:
                h[v] = h[u] + w
    if any(h[u] + w < h[v] for u, v, w in edges):
        return None                  # negative cycle

    # 2. reweight
    adj = [[] for _ in range(n)]
    for u, v, w in edges:
        adj[u].append((v, w + h[u] - h[v]))

    # 3. Dijkstra from every vertex, then shift back
    result = []
    for s in range(n):
        dist = [INF] * n
        dist[s] = 0
        pq = [(0, s)]
        while pq:
            d, u = heapq.heappop(pq)
            if d > dist[u]:
                continue
            for v, w in adj[u]:
                if d + w < dist[v]:
                    dist[v] = d + w
                    heapq.heappush(pq, (dist[v], v))
        result.append([x - h[s] + h[v] if x < INF else INF for v, x in enumerate(dist)])
    return result`,
  cpp: `// Outline (uses the Bellman-Ford and Dijkstra from their pages)
vector<vector<long long>> johnson(int n, vector<tuple<int,int,int>> edges) {
    // 1. potentials from an extra vertex q with 0-edges to everyone
    vector<long long> h(n, 0);
    for (int pass = 0; pass < n; pass++)
        for (auto [u, v, w] : edges) h[v] = min(h[v], h[u] + w);
    for (auto [u, v, w] : edges)
        if (h[u] + w < h[v]) return {};          // negative cycle

    // 2. reweight
    vector<vector<pair<int,int>>> adj(n);
    for (auto [u, v, w] : edges) adj[u].push_back({v, int(w + h[u] - h[v])});

    // 3. Dijkstra from every vertex and shift back
    vector<vector<long long>> dist(n);
    for (int s = 0; s < n; s++) {
        vector<int> prev;
        dist[s] = dijkstra(adj, s, prev);
        for (int v = 0; v < n; v++)
            if (dist[s][v] != LLONG_MAX) dist[s][v] += h[v] - h[s];
    }
    return dist;
}`,
  idea: `Dijkstra is fast but can't handle negative edges.
Johnson's trick: change the weights so none is negative,
without changing which paths are shortest.

1. Add a vertex q with a 0-weight edge to every vertex and
   run Bellman-Ford from q. Call the results h[v].
2. New weights: w'(u, v) = w(u, v) + h[u] - h[v] >= 0.
   Every path from s to t changes by the same amount,
   h[s] - h[t], so shortest paths stay shortest.
3. Run Dijkstra from every vertex on w', then undo the
   shift: dist(s, t) = dist'(s, t) - h[s] + h[t].

O(V E log V): better than Floyd-Warshall on sparse graphs.`,
};

export default function Home() {
  return (
    <AlgoPage
      title="Johnson's Algorithm"
      whatTitle="What is Johnson's Algorithm?"
      meta={[
        { color: "green", text: "Time: O(V·E log V)" },
        { color: "blue", text: "Space: O(V²) for the answer" },
        { color: "rust", text: "All pairs · negative weights OK" },
      ]}
      visualizer={<GraphAlgoVisualizer algo="johnson" />}
      intro={
        <>
          <p>
            <B>Johnson&apos;s algorithm</B> finds shortest paths between all pairs of vertices, even with{" "}
            <B c="rust">negative edges</B>, by combining the two single-source algorithms:{" "}
            <Link href="/algorithms/shortest-path/bellman-ford" className="text-pen-blue font-semibold underline">
              Bellman-Ford
            </Link>{" "}
            once, then{" "}
            <Link href="/algorithms/shortest-path/dijkstra" className="text-pen-blue font-semibold underline">
              Dijkstra
            </Link>{" "}
            from every vertex.
          </p>
          <p>
            Dijkstra can&apos;t cope with negative edges, so Johnson first <B c="plum">reweights</B> them. A
            Bellman-Ford run from an extra vertex <M>q</M> gives every vertex a potential <M>h[v]</M>. The new weight{" "}
            <M>w&apos;(u, v) = w(u, v) + h[u] − h[v]</M> is never negative, and every path between the same two
            vertices changes by the same amount, so the shortest paths don&apos;t change. Run Dijkstra on the new
            weights and shift the answers back.
          </p>
        </>
      }
      keyIdea="Make every weight non-negative with potentials, then Dijkstra from every vertex."
      usage={[
        <>Phase 1 shows the potentials <M>h</M> (blue labels) being computed by Bellman-Ford from the invisible vertex q.</>,
        <>Phase 2 rewrites each edge weight on the board: watch the negative weights disappear.</>,
        <>Phase 3 runs one Dijkstra per vertex and fills one row of the answer matrix each time.</>,
        <>The sample is the same graph as on the Floyd-Warshall page, so you can compare the two answers.</>,
      ]}
      steps={[
        { title: "1. Potentials", color: "plum", body: <>Bellman-Ford from a new vertex q joined to everyone by 0-weight edges.</> },
        { title: "2. Negative cycle?", color: "rust", body: <>If Bellman-Ford finds one, stop: no shortest paths exist.</> },
        { title: "3. Reweight", color: "gold", body: <><M>w&apos;(u, v) = w(u, v) + h[u] − h[v] ≥ 0</M> for every edge.</> },
        { title: "4. Dijkstra × V", color: "green", body: <>From each s, then <M>dist(s, v) = dist&apos;(s, v) − h[s] + h[v]</M>.</> },
      ]}
      note={
        <>
          <span className="font-semibold text-pen-blue">Why is w&apos; ≥ 0?</span> <M>h</M> are shortest distances from
          q, so <M>h[v] ≤ h[u] + w(u, v)</M> for every edge (otherwise h[v] could still be improved). Rearranged, that is
          exactly <M>w(u, v) + h[u] − h[v] ≥ 0</M>.
        </>
      }
      code={code}
      time={[
        <><B>Bellman-Ford once:</B> O(V·E)</>,
        <><B>Dijkstra V times:</B> O(V·(V + E) log V)</>,
        <><B>Total:</B> O(V·E log V), better than O(V³) when the graph is sparse</>,
      ]}
      space={[<><B c="blue">Answer:</B> O(V²)</>, <><B c="blue">Working memory:</B> O(V + E)</>, <><B c="blue">Negative edges:</B> yes, negative cycles detected</>]}
      uses={[
        <><B>All-pairs shortest paths</B> on large sparse graphs</>,
        <><B>Road and network data</B> with a few negative adjustments</>,
        <><B>Reweighting idea</B> also used in min-cost flow algorithms</>,
      ]}
      limits={[
        <><span className="text-pen-gold">More complex</span> than Floyd-Warshall to implement</>,
        <><span className="text-pen-gold">Dense graphs:</span> Floyd-Warshall is simpler and just as fast</>,
        <><span className="text-pen-gold">Negative cycles:</span> no answer exists</>,
      ]}
    />
  );
}
