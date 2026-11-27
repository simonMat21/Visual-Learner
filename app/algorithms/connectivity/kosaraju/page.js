"use client";

import Link from "next/link";
import AlgoPage, { B, M } from "@/components/AlgoPage";
import GraphAlgoVisualizer from "@/components/GraphAlgoVisualizer";

const code = {
  js: `// Kosaraju's algorithm: strongly connected components of a directed graph.
// graph[u][v] = 1 for an edge u -> v. Returns comp[v] = component number.
function kosaraju(graph) {
  const n = graph.length;
  const visited = Array(n).fill(false);
  const order = [];                        // vertices by finish time

  function dfs1(u) {
    visited[u] = true;
    for (let v = 0; v < n; v++) if (graph[u][v] && !visited[v]) dfs1(v);
    order.push(u);                         // u finishes after everything it reaches
  }
  for (let v = 0; v < n; v++) if (!visited[v]) dfs1(v);

  const comp = Array(n).fill(-1);
  let count = 0;
  function dfs2(u, c) {                    // walk the REVERSED edges
    comp[u] = c;
    for (let v = 0; v < n; v++) if (graph[v][u] && comp[v] === -1) dfs2(v, c);
  }
  while (order.length) {
    const v = order.pop();                 // latest finish first
    if (comp[v] === -1) dfs2(v, count++);
  }
  return { count, comp };
}`,
  py: `import sys

def kosaraju(adj):
    """adj[u] = list of v for edges u -> v."""
    sys.setrecursionlimit(10000)
    n = len(adj)
    radj = [[] for _ in range(n)]
    for u in range(n):
        for v in adj[u]:
            radj[v].append(u)

    visited, order = [False] * n, []
    def dfs1(u):
        visited[u] = True
        for v in adj[u]:
            if not visited[v]:
                dfs1(v)
        order.append(u)
    for v in range(n):
        if not visited[v]:
            dfs1(v)

    comp, count = [-1] * n, 0
    def dfs2(u, c):
        comp[u] = c
        for v in radj[u]:
            if comp[v] == -1:
                dfs2(v, c)
    for v in reversed(order):
        if comp[v] == -1:
            dfs2(v, count)
            count += 1
    return count, comp`,
  cpp: `#include <vector>
using namespace std;

struct Kosaraju {
    int n; vector<vector<int>> adj, radj; vector<bool> seen; vector<int> order, comp;
    Kosaraju(const vector<vector<int>>& g) : n(g.size()), adj(g), radj(n), seen(n), comp(n, -1) {
        for (int u = 0; u < n; u++) for (int v : adj[u]) radj[v].push_back(u);
    }
    void dfs1(int u) { seen[u] = true; for (int v : adj[u]) if (!seen[v]) dfs1(v); order.push_back(u); }
    void dfs2(int u, int c) { comp[u] = c; for (int v : radj[u]) if (comp[v] == -1) dfs2(v, c); }
    int run() {
        for (int v = 0; v < n; v++) if (!seen[v]) dfs1(v);
        int count = 0;
        for (int i = n - 1; i >= 0; i--) if (comp[order[i]] == -1) dfs2(order[i], count++);
        return count;
    }
};`,
  idea: `A strongly connected component (SCC) is a group where
every vertex can reach every other one following the arrows.

Pass 1: DFS the graph and push each vertex on a stack
        when it FINISHES.
Pass 2: reverse every edge. Pop vertices off the stack;
        each one that has no component yet starts a DFS on
        the reversed graph. Everything it reaches is one SCC.

Why it works: the vertex that finishes last is in a "source"
SCC. In the reversed graph that SCC becomes a sink, so the
second DFS can't leak out of it.`,
};

export default function Home() {
  return (
    <AlgoPage
      title="Kosaraju's Algorithm"
      whatTitle="What is Kosaraju's Algorithm?"
      meta={[
        { color: "green", text: "Time: O(V + E)" },
        { color: "blue", text: "Two DFS passes" },
        { color: "rust", text: "Strongly connected components" },
      ]}
      visualizer={<GraphAlgoVisualizer algo="kosaraju" />}
      intro={
        <>
          <p>
            In a directed graph, a <B>strongly connected component</B> (SCC) is a group of vertices where each one can
            reach every other one by following the arrows. Squashing every SCC into a single vertex leaves a graph
            with no cycles.
          </p>
          <p>
            <B>Kosaraju&apos;s algorithm</B> finds them with two depth-first searches. The first records the order in
            which vertices <B c="plum">finish</B>. The second runs on the graph with every edge{" "}
            <B c="rust">reversed</B>, starting from the vertices that finished last. Each search in the second pass
            stays trapped inside exactly one SCC.
          </p>
        </>
      }
      keyIdea="DFS for finish order, then DFS the reversed graph in reverse finish order."
      usage={[
        <>Pass 1: blue = visited, yellow = finished and pushed on the stack shown on the right.</>,
        <>Pass 2 flips every arrow on the board (&quot;showing the REVERSED graph&quot;) and pops the stack.</>,
        <>Each colour is one strongly connected component.</>,
        <>
          Compare with{" "}
          <Link href="/algorithms/connectivity/tarjan" className="text-pen-blue font-semibold underline">
            Tarjan&apos;s algorithm
          </Link>
          , which finds the same components in one pass.
        </>,
      ]}
      steps={[
        { title: "1. First DFS", color: "plum", body: <>Explore everything; push each vertex on a stack when it finishes.</> },
        { title: "2. Reverse the edges", color: "gold", body: <>Every <M>u → v</M> becomes <M>v → u</M>.</> },
        { title: "3. Pop and explore", color: "green", body: <>Pop a vertex without a component and DFS the reversed graph from it.</> },
        { title: "4. One search, one SCC", color: "blue", body: <>Everything that search reaches is one strongly connected component.</> },
      ]}
      code={code}
      time={[<><B>Two DFS passes:</B> O(V + E) with adjacency lists</>, <><B>Reversing the graph:</B> O(V + E)</>]}
      space={[<><B c="blue">Space:</B> O(V + E) for the reversed graph and the stack</>, <><B c="blue">Output order:</B> SCCs come out in topological order</>]}
      uses={[
        <><B>Condensing</B> a graph into a DAG of components</>,
        <><B>2-SAT</B> solving</>,
        <><B>Finding cycles</B> of dependencies in software modules</>,
        <><B>Web graphs:</B> groups of pages that all link to each other</>,
      ]}
      limits={[
        <><span className="text-pen-gold">Two passes</span> and a reversed copy of the graph (Tarjan needs neither)</>,
        <><span className="text-pen-gold">Recursion depth</span> can overflow on very long paths</>,
      ]}
    />
  );
}
