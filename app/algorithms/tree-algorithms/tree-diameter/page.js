"use client";

import Link from "next/link";
import AlgoPage, { B, M } from "@/components/AlgoPage";
import TreeAlgoVisualizer from "@/components/TreeAlgoVisualizer";

const code = {
  js: `// Diameter of a tree (number of edges on the longest path).
// adj = adjacency lists of the tree.
function bfs(adj, s) {
  const dist = Array(adj.length).fill(-1);
  const prev = Array(adj.length).fill(-1);
  dist[s] = 0;
  const queue = [s];
  while (queue.length) {
    const u = queue.shift();
    for (const v of adj[u]) if (dist[v] === -1) {
      dist[v] = dist[u] + 1;
      prev[v] = u;
      queue.push(v);
    }
  }
  return { dist, prev };
}

function treeDiameter(adj) {
  const farthest = (dist) => dist.indexOf(Math.max(...dist));
  const b = farthest(bfs(adj, 0).dist);          // 1st BFS: one end
  const { dist, prev } = bfs(adj, b);           // 2nd BFS: from that end
  const c = farthest(dist);
  const path = [];
  for (let x = c; x !== -1; x = prev[x]) path.push(x);
  return { length: dist[c], path };
}

// Weighted trees: the same idea works with DFS distances (weights >= 0),
// or use DP: diameter = max over nodes of (longest + second longest branch).`,
  py: `from collections import deque

def bfs(adj, s):
    dist = [-1] * len(adj)
    prev = [-1] * len(adj)
    dist[s] = 0
    q = deque([s])
    while q:
        u = q.popleft()
        for v in adj[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                prev[v] = u
                q.append(v)
    return dist, prev

def tree_diameter(adj):
    d0, _ = bfs(adj, 0)
    b = d0.index(max(d0))              # one end of a longest path
    d1, prev = bfs(adj, b)
    c = d1.index(max(d1))              # the other end
    path = []
    while c != -1:
        path.append(c)
        c = prev[c]
    return d1[path[0]], path`,
  cpp: `#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

vector<int> bfs(const vector<vector<int>>& adj, int s) {
    vector<int> dist(adj.size(), -1);
    queue<int> q; q.push(s); dist[s] = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) if (dist[v] == -1) { dist[v] = dist[u] + 1; q.push(v); }
    }
    return dist;
}

int treeDiameter(const vector<vector<int>>& adj) {
    auto d0 = bfs(adj, 0);
    int b = max_element(d0.begin(), d0.end()) - d0.begin();
    auto d1 = bfs(adj, b);
    return *max_element(d1.begin(), d1.end());
}`,
  idea: `The diameter of a tree is its longest path.

Trick: two searches.
1. From any vertex a, BFS and take the farthest vertex b.
2. From b, BFS again and take the farthest vertex c.
3. The path b ... c is a longest path.

Why: the farthest vertex from ANY vertex is always an end
of some diameter. If it weren't, you could stitch a longer
path together from pieces of the paths you found, which is
impossible.

Two BFS passes: O(n).`,
};

export default function Home() {
  return (
    <AlgoPage
      title="Tree Diameter"
      whatTitle="What is the Diameter of a Tree?"
      meta={[
        { color: "green", text: "Time: O(n)" },
        { color: "blue", text: "Two BFS passes" },
        { color: "rust", text: "Longest path in a tree" },
      ]}
      visualizer={<TreeAlgoVisualizer mode="diameter" />}
      intro={
        <>
          <p>
            The <B>diameter</B> of a tree is the length of its <B c="plum">longest path</B>: the two nodes that are
            farthest apart, counted in edges. In a network shaped like a tree it is the worst-case number of hops a
            message needs.
          </p>
          <p>
            Checking every pair would be slow, but trees allow a neat trick with two{" "}
            <Link href="/algorithms/graphs/bfs" className="text-pen-blue font-semibold underline">
              breadth-first searches
            </Link>
            . From <B c="rust">any</B> vertex, the farthest vertex <M>b</M> is always one end of a longest path. A
            second BFS from <M>b</M> then finds the farthest vertex <M>c</M>, the other end.
          </p>
        </>
      }
      keyIdea="Farthest from anywhere is one end; farthest from that end is the other."
      usage={[
        <>Blue numbers are BFS distances; the blue wave shows the layer being reached.</>,
        <>
          The first BFS starts at 0 and finds <M>b</M>; the second starts at <M>b</M> and finds <M>c</M>. The green
          path is the diameter.
        </>,
        <>Type a tree as edges like <M>0-1, 0-2, 1-3</M> and press Apply, or try a Random tree.</>,
      ]}
      steps={[
        { title: "1. Start anywhere", color: "plum", body: <>Pick any vertex a (here: 0).</> },
        { title: "2. First BFS", color: "gold", body: <>Find b, the vertex farthest from a.</> },
        { title: "3. Second BFS", color: "green", body: <>From b, find c, the vertex farthest from b.</> },
        { title: "4. Answer", color: "blue", body: <>dist(b, c) is the diameter, and following the BFS parents gives the path.</> },
      ]}
      note={
        <>
          <span className="font-semibold text-pen-blue">Only for trees:</span> in a general graph the farthest vertex
          from a random start is not always an end of the longest shortest path, so this shortcut can fail.
        </>
      }
      code={code}
      time={[<><B>Two BFS:</B> O(n)</>, <><B>Brute force</B> (BFS from every vertex): O(n²)</>]}
      space={[<><B c="blue">Space:</B> O(n)</>, <><B c="blue">Weighted trees:</B> same trick with DFS distances, or a DP on the tree</>]}
      uses={[
        <><B>Networks:</B> worst-case delay in a tree-shaped network</>,
        <><B>Tree centre:</B> the middle of the diameter minimises the farthest distance</>,
        <><B>Competitive programming:</B> a classic building block</>,
      ]}
      limits={[
        <><span className="text-pen-gold">Trees only:</span> not valid for graphs with cycles</>,
        <><span className="text-pen-gold">Negative weights</span> break the trick</>,
      ]}
    />
  );
}
