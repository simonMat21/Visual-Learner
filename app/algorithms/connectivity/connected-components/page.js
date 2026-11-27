"use client";

import Link from "next/link";
import AlgoPage, { B, M } from "@/components/AlgoPage";
import GraphAlgoVisualizer from "@/components/GraphAlgoVisualizer";

const code = {
  js: `// Label the connected components of an undirected graph.
// graph[u][v] = 1 when u and v are joined. Returns label[v] = component number.
function connectedComponents(graph) {
  const n = graph.length;
  const label = Array(n).fill(-1);
  let count = 0;

  for (let s = 0; s < n; s++) {
    if (label[s] !== -1) continue;       // already part of a component
    const stack = [s];                   // flood fill (DFS) from s
    label[s] = count;
    while (stack.length) {
      const u = stack.pop();
      for (let v = 0; v < n; v++) {
        if (graph[u][v] && label[v] === -1) {
          label[v] = count;
          stack.push(v);
        }
      }
    }
    count++;
  }
  return { count, label };
}`,
  py: `def connected_components(adj):
    """adj[u] = list of neighbours. Returns (count, label)."""
    n = len(adj)
    label = [-1] * n
    count = 0
    for s in range(n):
        if label[s] != -1:
            continue
        label[s] = count
        stack = [s]
        while stack:
            u = stack.pop()
            for v in adj[u]:
                if label[v] == -1:
                    label[v] = count
                    stack.append(v)
        count += 1
    return count, label`,
  cpp: `#include <vector>
using namespace std;

int connectedComponents(const vector<vector<int>>& adj, vector<int>& label) {
    int n = adj.size(), count = 0;
    label.assign(n, -1);
    for (int s = 0; s < n; s++) {
        if (label[s] != -1) continue;
        vector<int> stack = {s};
        label[s] = count;
        while (!stack.empty()) {
            int u = stack.back(); stack.pop_back();
            for (int v : adj[u])
                if (label[v] == -1) { label[v] = count; stack.push_back(v); }
        }
        count++;
    }
    return count;
}`,
  c: `#define N 8

int label[N];

void flood(int graph[N][N], int u, int c) {
    label[u] = c;
    for (int v = 0; v < N; v++)
        if (graph[u][v] && label[v] == -1) flood(graph, v, c);
}

int connectedComponents(int graph[N][N]) {
    int count = 0;
    for (int i = 0; i < N; i++) label[i] = -1;
    for (int s = 0; s < N; s++)
        if (label[s] == -1) flood(graph, s, count++);
    return count;
}`,
  idea: `Two vertices are in the same connected component when
there is a path between them.

Go through the vertices in order. Each time you meet one
that has no label yet, it starts a NEW component: flood
fill from it (BFS or DFS) and give everything you reach
the same label.

The number of flood fills = the number of components.
Every vertex and edge is touched once: O(V + E).
(Union-Find gives the same answer and also handles edges
that are added later.)`,
};

export default function Home() {
  return (
    <AlgoPage
      title="Connected Components"
      whatTitle="What are Connected Components?"
      meta={[
        { color: "green", text: "Time: O(V + E)" },
        { color: "blue", text: "Space: O(V)" },
        { color: "rust", text: "Undirected graphs" },
      ]}
      visualizer={<GraphAlgoVisualizer algo="components" />}
      intro={
        <>
          <p>
            A <B>connected component</B> is a group of vertices where you can get from any vertex to any other along
            edges, and nothing outside the group is reachable. A graph made of three separate islands has three
            components.
          </p>
          <p>
            To find them, walk through the vertices in order. Whenever a vertex has <B c="plum">no label yet</B>, it
            must belong to a new component: <B c="rust">flood fill</B> from it with{" "}
            <Link href="/algorithms/graphs/dfs" className="text-pen-blue font-semibold underline">
              DFS
            </Link>{" "}
            (or{" "}
            <Link href="/algorithms/graphs/bfs" className="text-pen-blue font-semibold underline">
              BFS
            </Link>
            ) and give every vertex it reaches that component&apos;s number.
          </p>
        </>
      }
      keyIdea="Every unlabelled vertex starts a new component; flood fill labels the rest of it."
      usage={[
        <>Each colour is one component; <M>#2</M> next to a vertex is its component number.</>,
        <>Open <B c="plum">Edit graph</B> and add one edge between two colours: they become one component.</>,
        <>The label[] row on the right is exactly the array the code fills in.</>,
      ]}
      steps={[
        { title: "1. Scan the vertices", color: "plum", body: <>In order 0, 1, 2, … looking for one with no label.</> },
        { title: "2. New component", color: "gold", body: <>An unlabelled vertex starts component number <M>count + 1</M>.</> },
        { title: "3. Flood fill", color: "green", body: <>DFS from it: every vertex reached gets the same label.</> },
        { title: "4. Done", color: "blue", body: <>After the scan, the number of flood fills is the number of components.</> },
      ]}
      code={code}
      time={[<><B>Adjacency list:</B> O(V + E)</>, <><B>Adjacency matrix:</B> O(V²)</>]}
      space={[<><B c="blue">Space:</B> O(V) for labels and the stack</>, <><B c="blue">Directed graphs:</B> need strongly connected components instead</>]}
      uses={[
        <><B>Image processing:</B> separate blobs in a picture (flood fill)</>,
        <><B>Networks:</B> which computers can talk to each other</>,
        <><B>Social graphs:</B> groups of people linked by friendships</>,
        <><B>Checking connectivity</B> before running MST or shortest paths</>,
      ]}
      limits={[
        <><span className="text-pen-gold">Undirected only:</span> one-way edges need SCC algorithms</>,
        <><span className="text-pen-gold">Static:</span> recompute after edges change, or use Union-Find for added edges</>,
      ]}
    />
  );
}
