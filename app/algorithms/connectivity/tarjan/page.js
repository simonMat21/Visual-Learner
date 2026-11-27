"use client";

import Link from "next/link";
import AlgoPage, { B, M } from "@/components/AlgoPage";
import GraphAlgoVisualizer from "@/components/GraphAlgoVisualizer";

const code = {
  js: `// Tarjan's algorithm: strongly connected components in one DFS.
function tarjan(graph) {
  const n = graph.length;
  const index = Array(n).fill(-1), low = Array(n).fill(0);
  const onStack = Array(n).fill(false), stack = [];
  const sccs = [];
  let counter = 0;

  function visit(u) {
    index[u] = low[u] = counter++;
    stack.push(u);
    onStack[u] = true;
    for (let v = 0; v < n; v++) {
      if (!graph[u][v]) continue;
      if (index[v] === -1) {               // tree edge: explore v first
        visit(v);
        low[u] = Math.min(low[u], low[v]);
      } else if (onStack[v]) {             // edge back into the current path
        low[u] = Math.min(low[u], index[v]);
      }
    }
    if (low[u] === index[u]) {             // u is the root of an SCC
      const scc = [];
      let w;
      do {
        w = stack.pop();
        onStack[w] = false;
        scc.push(w);
      } while (w !== u);
      sccs.push(scc);
    }
  }
  for (let v = 0; v < n; v++) if (index[v] === -1) visit(v);
  return sccs;
}`,
  py: `def tarjan(adj):
    n = len(adj)
    index, low = [-1] * n, [0] * n
    on_stack, stack, sccs = [False] * n, [], []
    counter = 0

    def visit(u):
        nonlocal counter
        index[u] = low[u] = counter
        counter += 1
        stack.append(u)
        on_stack[u] = True
        for v in adj[u]:
            if index[v] == -1:
                visit(v)
                low[u] = min(low[u], low[v])
            elif on_stack[v]:
                low[u] = min(low[u], index[v])
        if low[u] == index[u]:
            scc = []
            while True:
                w = stack.pop()
                on_stack[w] = False
                scc.append(w)
                if w == u:
                    break
            sccs.append(scc)

    for v in range(n):
        if index[v] == -1:
            visit(v)
    return sccs`,
  cpp: `#include <vector>
#include <algorithm>
using namespace std;

struct Tarjan {
    vector<vector<int>> adj; vector<int> idx, low, st; vector<bool> on;
    vector<vector<int>> sccs; int counter = 0;
    Tarjan(const vector<vector<int>>& g) : adj(g), idx(g.size(), -1), low(g.size()), on(g.size()) {}
    void visit(int u) {
        idx[u] = low[u] = counter++;
        st.push_back(u); on[u] = true;
        for (int v : adj[u]) {
            if (idx[v] == -1) { visit(v); low[u] = min(low[u], low[v]); }
            else if (on[v]) low[u] = min(low[u], idx[v]);
        }
        if (low[u] == idx[u]) {
            vector<int> scc; int w;
            do { w = st.back(); st.pop_back(); on[w] = false; scc.push_back(w); } while (w != u);
            sccs.push_back(scc);
        }
    }
    vector<vector<int>> run() { for (int v = 0; v < (int)adj.size(); v++) if (idx[v] == -1) visit(v); return sccs; }
};`,
  idea: `One DFS, two numbers per vertex:
  index[u] = when u was first reached
  low[u]   = the smallest index u can get back to using
             DFS-tree edges down and one edge to a vertex
             that is still on the stack

Vertices go on a stack when first reached. When u finishes
and low[u] == index[u], nothing below u can climb above it,
so u and everything above it on the stack form one SCC:
pop them off.`,
};

export default function Home() {
  return (
    <AlgoPage
      title="Tarjan's Algorithm"
      whatTitle="What is Tarjan's Algorithm?"
      meta={[
        { color: "green", text: "Time: O(V + E)" },
        { color: "blue", text: "One DFS pass" },
        { color: "rust", text: "Strongly connected components" },
      ]}
      visualizer={<GraphAlgoVisualizer algo="tarjan" />}
      intro={
        <>
          <p>
            <B>Tarjan&apos;s algorithm</B> finds the strongly connected components of a directed graph in a{" "}
            <B c="plum">single depth-first search</B>, without reversing the graph like{" "}
            <Link href="/algorithms/connectivity/kosaraju" className="text-pen-blue font-semibold underline">
              Kosaraju&apos;s
            </Link>{" "}
            does.
          </p>
          <p>
            Every vertex gets an <B c="plum">index</B> (the order it was discovered) and a <B c="rust">low-link</B>{" "}
            value: the smallest index it can reach back to through the part of the graph still being explored.
            Vertices wait on a stack. When a vertex finishes with <M>low == index</M>, it is the first vertex of its
            component, and it and everything above it on the stack are popped off as one SCC.
          </p>
        </>
      }
      keyIdea="If nothing below u can climb above it (low[u] == index[u]), u's component is complete."
      usage={[
        <>The label <M>3/1</M> next to a vertex means index 3, low-link 1.</>,
        <>Blue vertices are on the stack (shown on the right); each colour is a finished SCC.</>,
        <>Watch low values drop when an edge leads back to a vertex still on the stack.</>,
      ]}
      steps={[
        { title: "1. Discover", color: "plum", body: <>Give u the next index, set <M>low[u] = index[u]</M>, push it on the stack.</> },
        { title: "2. Tree edge", color: "gold", body: <>Unvisited v: explore it, then <M>low[u] = min(low[u], low[v])</M>.</> },
        { title: "3. Back edge", color: "green", body: <>v still on the stack: <M>low[u] = min(low[u], index[v])</M>.</> },
        { title: "4. Root found", color: "blue", body: <>If <M>low[u] == index[u]</M>, pop the stack down to u: that is one SCC.</> },
      ]}
      code={code}
      time={[<><B>One DFS:</B> O(V + E)</>, <><B>Each vertex</B> is pushed and popped exactly once</>]}
      space={[<><B c="blue">Space:</B> O(V) for index, low and the stack</>, <><B c="blue">Output order:</B> reverse topological order of the SCCs</>]}
      uses={[
        <><B>Compilers:</B> finding mutually recursive functions</>,
        <><B>Deadlock detection</B> in wait-for graphs</>,
        <><B>2-SAT</B> and condensing graphs into DAGs</>,
        <><B>Bridges and articulation points</B> use the same index/low idea</>,
      ]}
      limits={[
        <><span className="text-pen-gold">Harder to understand</span> than Kosaraju at first</>,
        <><span className="text-pen-gold">Deep recursion</span> on long paths (use an explicit stack in production)</>,
      ]}
    />
  );
}
