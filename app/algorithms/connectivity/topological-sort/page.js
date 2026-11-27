"use client";

import AlgoPage, { B, M } from "@/components/AlgoPage";
import GraphAlgoVisualizer from "@/components/GraphAlgoVisualizer";

const code = {
  js: `// Kahn's algorithm. graph[u][v] = 1 for an edge u -> v ("u before v").
function topologicalSort(graph) {
  const n = graph.length;
  const indeg = Array(n).fill(0);
  for (let u = 0; u < n; u++)
    for (let v = 0; v < n; v++) if (graph[u][v]) indeg[v]++;

  const queue = [];
  for (let v = 0; v < n; v++) if (indeg[v] === 0) queue.push(v);

  const order = [];
  while (queue.length) {
    const u = queue.shift();
    order.push(u);
    for (let v = 0; v < n; v++) {
      if (!graph[u][v]) continue;
      if (--indeg[v] === 0) queue.push(v);   // all of v's prerequisites done
    }
  }
  return order.length === n ? order : null;  // null: there is a cycle
}

// DFS alternative: append each vertex when it FINISHES, then reverse the list.`,
  py: `from collections import deque

def topological_sort(adj):
    """adj[u] = list of v for edges u -> v. Returns an order or None."""
    n = len(adj)
    indeg = [0] * n
    for u in range(n):
        for v in adj[u]:
            indeg[v] += 1
    queue = deque(v for v in range(n) if indeg[v] == 0)
    order = []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                queue.append(v)
    return order if len(order) == n else None`,
  cpp: `#include <vector>
#include <queue>
using namespace std;

// returns an empty vector if the graph has a cycle
vector<int> topologicalSort(const vector<vector<int>>& adj) {
    int n = adj.size();
    vector<int> indeg(n, 0), order;
    for (int u = 0; u < n; u++) for (int v : adj[u]) indeg[v]++;
    queue<int> q;
    for (int v = 0; v < n; v++) if (indeg[v] == 0) q.push(v);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u]) if (--indeg[v] == 0) q.push(v);
    }
    if ((int)order.size() != n) order.clear();
    return order;
}`,
  c: `#define N 7

// returns the number of vertices placed (< N means a cycle)
int topologicalSort(int graph[N][N], int order[N]) {
    int indeg[N] = {0}, queue[N], head = 0, tail = 0, k = 0;
    for (int u = 0; u < N; u++)
        for (int v = 0; v < N; v++) if (graph[u][v]) indeg[v]++;
    for (int v = 0; v < N; v++) if (indeg[v] == 0) queue[tail++] = v;
    while (head < tail) {
        int u = queue[head++];
        order[k++] = u;
        for (int v = 0; v < N; v++)
            if (graph[u][v] && --indeg[v] == 0) queue[tail++] = v;
    }
    return k;
}`,
  idea: `A topological order lists the vertices so that every
edge u -> v points forward: u comes before v.
(Think "do the prerequisite courses first".)

Kahn's algorithm:
1. Count the incoming edges of every vertex (in-degree).
2. Everything with in-degree 0 has nothing before it: it is
   ready. Put those in a queue.
3. Take a ready vertex, add it to the order, and remove its
   outgoing edges. Any vertex whose in-degree drops to 0 is
   now ready too.
4. If some vertices never become ready, they sit on a cycle:
   no order exists.`,
};

export default function Home() {
  return (
    <AlgoPage
      title="Topological Sort"
      whatTitle="What is a Topological Sort?"
      meta={[
        { color: "green", text: "Time: O(V + E)" },
        { color: "blue", text: "Kahn's algorithm (queue)" },
        { color: "rust", text: "Directed acyclic graphs" },
      ]}
      visualizer={<GraphAlgoVisualizer algo="topo" />}
      intro={
        <>
          <p>
            A <B>topological order</B> of a directed graph lists the vertices so that every edge points{" "}
            <B c="plum">forward</B>: for each <M>u → v</M>, <M>u</M> comes before <M>v</M>. If the edges mean
            &quot;must happen before&quot; (course prerequisites, build steps, tasks), a topological order is a valid
            schedule.
          </p>
          <p>
            <B>Kahn&apos;s algorithm</B> repeatedly picks a vertex with <B c="rust">no incoming edges left</B>: nothing
            still has to happen before it. It goes next in the order, and its outgoing edges are removed, which may
            make more vertices ready. An order exists only if the graph has <B c="rust">no cycle</B>; vertices on a
            cycle never become ready.
          </p>
        </>
      }
      keyIdea="Repeatedly take a vertex with nothing left before it, then remove its edges."
      usage={[
        <>The label <M>in 2</M> is a vertex&apos;s in-degree: how many edges still point into it.</>,
        <>Yellow vertices are ready (in the queue); green ones are placed. Used edges fade out.</>,
        <>Add an edge that closes a loop in <B c="plum">Edit graph</B> and watch the cycle get reported in red.</>,
      ]}
      steps={[
        { title: "1. Count in-degrees", color: "plum", body: <>For each vertex, the number of edges coming in.</> },
        { title: "2. Queue the ready ones", color: "gold", body: <>Every vertex with in-degree 0.</> },
        { title: "3. Place and remove", color: "green", body: <>Dequeue u, append it to the order, decrease the in-degree of each <M>v</M> with <M>u → v</M>; enqueue v when it hits 0.</> },
        { title: "4. Cycle check", color: "rust", body: <>Fewer than V vertices placed means the leftovers form a cycle.</> },
      ]}
      note={
        <>
          <span className="font-semibold text-pen-blue">Not unique:</span> when several vertices are ready at the same
          time, any of them can go next, so a DAG usually has many valid orders.
        </>
      }
      code={code}
      time={[<><B>Adjacency list:</B> O(V + E)</>, <><B>Adjacency matrix:</B> O(V²)</>]}
      space={[<><B c="blue">Space:</B> O(V) for in-degrees and the queue</>, <><B c="blue">Bonus:</B> detects cycles for free</>]}
      uses={[
        <><B>Build systems</B> (make, bundlers): compile dependencies first</>,
        <><B>Course planning:</B> prerequisites before advanced classes</>,
        <><B>Spreadsheets:</B> recompute cells after the cells they use</>,
        <><B>Package managers:</B> install order of dependencies</>,
      ]}
      limits={[
        <><span className="text-pen-gold">Only for DAGs:</span> a cycle means there is no valid order</>,
        <><span className="text-pen-gold">Not unique:</span> many orders can be correct</>,
      ]}
    />
  );
}
