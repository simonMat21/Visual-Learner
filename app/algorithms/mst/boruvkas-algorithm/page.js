"use client";

import Link from "next/link";
import AlgoPage, { B } from "@/components/AlgoPage";
import GraphAlgoVisualizer from "@/components/GraphAlgoVisualizer";

const code = {
  js: `// Borůvka's algorithm. edges = [[u, v, w], ...] for an undirected graph.
function boruvka(n, edges) {
  const parent = [...Array(n).keys()];
  const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  const mst = [];
  let components = n;

  while (components > 1) {
    // cheapest edge leaving each component (ties broken by vertex numbers)
    const cheapest = Array(n).fill(null);
    for (const e of edges) {
      const [u, v, w] = e;
      const a = find(u), b = find(v);
      if (a === b) continue;
      for (const c of [a, b])
        if (!cheapest[c] || w < cheapest[c][2]) cheapest[c] = e;
    }
    let added = 0;
    for (const e of cheapest) {
      if (!e) continue;
      const a = find(e[0]), b = find(e[1]);
      if (a === b) continue;            // already joined this round
      parent[a] = b;
      mst.push(e);
      components--;
      added++;
    }
    if (added === 0) break;             // disconnected: a forest is all we get
  }
  return mst;
}`,
  py: `def boruvka(n, edges):
    """edges = list of (u, v, w). Returns the MST edges."""
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    mst, components = [], n
    while components > 1:
        cheapest = {}
        for u, v, w in edges:
            a, b = find(u), find(v)
            if a == b:
                continue
            for c in (a, b):
                if c not in cheapest or w < cheapest[c][2]:
                    cheapest[c] = (u, v, w)
        added = 0
        for u, v, w in cheapest.values():
            a, b = find(u), find(v)
            if a != b:
                parent[a] = b
                mst.append((u, v, w))
                components -= 1
                added += 1
        if added == 0:
            break
    return mst`,
  cpp: `#include <vector>
#include <array>
#include <numeric>
#include <functional>
using namespace std;

vector<array<int,3>> boruvka(int n, const vector<array<int,3>>& edges) {
    vector<int> parent(n);
    iota(parent.begin(), parent.end(), 0);
    function<int(int)> find = [&](int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); };
    vector<array<int,3>> mst;
    int components = n;
    while (components > 1) {
        vector<int> cheapest(n, -1);
        for (int i = 0; i < (int)edges.size(); i++) {
            int a = find(edges[i][0]), b = find(edges[i][1]);
            if (a == b) continue;
            for (int c : {a, b})
                if (cheapest[c] == -1 || edges[i][2] < edges[cheapest[c]][2]) cheapest[c] = i;
        }
        int added = 0;
        for (int c = 0; c < n; c++) {
            if (cheapest[c] == -1) continue;
            auto& e = edges[cheapest[c]];
            int a = find(e[0]), b = find(e[1]);
            if (a == b) continue;
            parent[a] = b;
            mst.push_back(e);
            components--;
            added++;
        }
        if (!added) break;
    }
    return mst;
}`,
  idea: `Borůvka works in rounds, and in every round ALL components
grow at the same time:

1. Start with every vertex as its own component.
2. Each component picks the cheapest edge leaving it.
3. Add all those edges and merge the components they join.
4. Repeat until one component is left.

Each round at least halves the number of components, so
there are at most log V rounds: O(E log V) in total.
Because components choose independently, the rounds are
easy to run in parallel.`,
};

export default function Home() {
  return (
    <AlgoPage
      title="Borůvka's Algorithm"
      whatTitle="What is Borůvka's Algorithm?"
      meta={[
        { color: "green", text: "Time: O(E log V)" },
        { color: "blue", text: "At most log V rounds" },
        { color: "rust", text: "Greedy · easy to parallelise" },
      ]}
      visualizer={<GraphAlgoVisualizer algo="boruvka" />}
      intro={
        <>
          <p>
            <B>Borůvka&apos;s algorithm</B> (1926) is the oldest minimum spanning tree algorithm. Like{" "}
            <Link href="/algorithms/mst/prims-algorithm" className="text-pen-blue font-semibold underline">
              Prim&apos;s
            </Link>{" "}
            and{" "}
            <Link href="/algorithms/mst/kruskals-algorithm" className="text-pen-blue font-semibold underline">
              Kruskal&apos;s
            </Link>
            , it builds the cheapest set of edges that connects every vertex.
          </p>
          <p>
            It works in <B c="plum">rounds</B>. In each round, <B c="rust">every component at once</B> picks the
            cheapest edge that leaves it. All those edges are added, the components they connect merge, and the next
            round starts with fewer, bigger components. Since each component joins at least one other, the number of
            components at least halves every round.
          </p>
        </>
      }
      keyIdea="Every component grabs its cheapest outgoing edge, all at the same time."
      usage={[
        <>Each colour is one component. In each round, yellow edges are the cheapest edge leaving some component.</>,
        <>Green edges are in the MST. Two components can pick the same edge; it is only added once.</>,
        <>Use the same example as on the Prim and Kruskal pages and compare: the total weight is the same.</>,
      ]}
      steps={[
        { title: "1. Start", color: "plum", body: <>Every vertex is a component by itself.</> },
        { title: "2. Cheapest edge out", color: "gold", body: <>Each component finds its cheapest edge to a different component.</> },
        { title: "3. Add and merge", color: "green", body: <>Add all chosen edges (skipping duplicates) and merge the components.</> },
        { title: "4. Repeat", color: "blue", body: <>Until one component remains, or no edge leaves a component (disconnected graph).</> },
      ]}
      note={
        <>
          <span className="font-semibold text-pen-blue">Ties:</span> with equal weights, two components could choose
          edges that form a cycle. Breaking ties by a fixed rule (here: by vertex numbers) prevents that.
        </>
      }
      code={code}
      time={[<><B>Rounds:</B> at most log₂ V</>, <><B>Each round:</B> O(E) to scan the edges</>, <><B>Total:</B> O(E log V)</>]}
      space={[<><B c="blue">Space:</B> O(V) for union-find and the cheapest edges</>, <><B c="blue">Result:</B> same total weight as Prim and Kruskal</>]}
      uses={[
        <><B>Parallel and distributed</B> MST computation (components work independently)</>,
        <><B>Network design</B> and clustering, like the other MST algorithms</>,
        <><B>Building block</B> of faster MST algorithms (Karger–Klein–Tarjan)</>,
      ]}
      limits={[
        <><span className="text-pen-gold">Needs tie-breaking</span> when weights repeat</>,
        <><span className="text-pen-gold">Sequentially</span> no faster than Kruskal or Prim</>,
        <><span className="text-pen-gold">Undirected graphs only</span></>,
      ]}
    />
  );
}
