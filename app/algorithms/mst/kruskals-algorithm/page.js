"use client";

import { useEffect } from "react";

import { CodeBlock } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import AdBanner from "@/components/AdBanner";

import P5Sketch from "./P5Sketch";

const codeSnippets = {
  js: `// Kruskal's algorithm on an adjacency matrix (0 = no edge)
// Union-find with path compression and union by rank.
class DisjointSet {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
  }
  find(x) {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }
  union(a, b) {
    let ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;           // already in the same tree
    if (this.rank[ra] < this.rank[rb]) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;
    if (this.rank[ra] === this.rank[rb]) this.rank[ra]++;
    return true;
  }
}

function kruskalMST(graph) {
  const n = graph.length;

  // 1. collect every undirected edge once (upper triangle)
  const edges = [];
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      if (graph[i][j] !== 0) edges.push([i, j, graph[i][j]]);

  // 2. sort by weight
  edges.sort((a, b) => a[2] - b[2]);

  // 3. take each edge unless it would make a cycle
  const ds = new DisjointSet(n);
  const mst = [];
  let total = 0;
  for (const [u, v, w] of edges) {
    if (ds.union(u, v)) {
      mst.push([u, v, w]);
      total += w;
      if (mst.length === n - 1) break;     // tree is complete
    }
  }
  return { edges: mst, total };
}

// Example
const graph = [
  [0, 7, 0, 5, 0],
  [7, 0, 8, 9, 7],
  [0, 8, 0, 0, 5],
  [5, 9, 0, 0, 15],
  [0, 7, 5, 15, 0],
];
console.log(kruskalMST(graph)); // total: 24`,
  c: `#include <stdio.h>
#include <stdlib.h>

#define V 5

typedef struct { int u, v, w; } Edge;

int parent[V], rnk[V];

int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);  // path compression
    return parent[x];
}

int unite(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return 0;                // same set -> cycle
    if (rnk[ra] < rnk[rb]) { int t = ra; ra = rb; rb = t; }
    parent[rb] = ra;
    if (rnk[ra] == rnk[rb]) rnk[ra]++;
    return 1;
}

int cmp(const void* a, const void* b) {
    return ((Edge*)a)->w - ((Edge*)b)->w;
}

void kruskalMST(int graph[V][V]) {
    Edge edges[V * V];
    int e = 0;
    for (int i = 0; i < V; i++)
        for (int j = i + 1; j < V; j++)
            if (graph[i][j]) edges[e++] = (Edge){i, j, graph[i][j]};

    qsort(edges, e, sizeof(Edge), cmp);
    for (int i = 0; i < V; i++) { parent[i] = i; rnk[i] = 0; }

    int count = 0, total = 0;
    for (int i = 0; i < e && count < V - 1; i++) {
        if (unite(edges[i].u, edges[i].v)) {
            printf("%d - %d    %d\\n", edges[i].u, edges[i].v, edges[i].w);
            total += edges[i].w;
            count++;
        }
    }
    printf("Total weight: %d\\n", total);
}

int main() {
    int graph[V][V] = {
        {0, 7, 0, 5, 0},
        {7, 0, 8, 9, 7},
        {0, 8, 0, 0, 5},
        {5, 9, 0, 0, 15},
        {0, 7, 5, 15, 0},
    };
    kruskalMST(graph);
    return 0;
}`,
  py: `class DisjointSet:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # path compression
        return self.parent[x]

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False          # already connected -> would make a cycle
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        return True


def kruskal_mst(graph):
    """Kruskal's algorithm on an adjacency matrix (0 = no edge)."""
    n = len(graph)
    edges = [(graph[i][j], i, j)
             for i in range(n) for j in range(i + 1, n) if graph[i][j] != 0]
    edges.sort()

    ds = DisjointSet(n)
    mst, total = [], 0
    for w, u, v in edges:
        if ds.union(u, v):
            mst.append((u, v, w))
            total += w
            if len(mst) == n - 1:
                break
    return mst, total


graph = [
    [0, 7, 0, 5, 0],
    [7, 0, 8, 9, 7],
    [0, 8, 0, 0, 5],
    [5, 9, 0, 0, 15],
    [0, 7, 5, 15, 0],
]
print(kruskal_mst(graph))  # total = 24`,
  cpp: `#include <iostream>
#include <vector>
#include <tuple>
#include <algorithm>
#include <numeric>
using namespace std;

struct DisjointSet {
    vector<int> parent, rnk;
    DisjointSet(int n) : parent(n), rnk(n, 0) { iota(parent.begin(), parent.end(), 0); }
    int find(int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); }
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;              // would form a cycle
        if (rnk[a] < rnk[b]) swap(a, b);
        parent[b] = a;
        if (rnk[a] == rnk[b]) rnk[a]++;
        return true;
    }
};

int kruskalMST(const vector<vector<int>>& graph, vector<tuple<int,int,int>>& mst) {
    int n = graph.size();
    vector<tuple<int,int,int>> edges;          // (w, u, v)
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (graph[i][j] != 0) edges.push_back({graph[i][j], i, j});
    sort(edges.begin(), edges.end());

    DisjointSet ds(n);
    int total = 0;
    for (auto [w, u, v] : edges) {
        if (ds.unite(u, v)) {
            mst.push_back({u, v, w});
            total += w;
            if ((int)mst.size() == n - 1) break;
        }
    }
    return total;
}

int main() {
    vector<vector<int>> graph = {
        {0, 7, 0, 5, 0},
        {7, 0, 8, 9, 7},
        {0, 8, 0, 0, 5},
        {5, 9, 0, 0, 15},
        {0, 7, 5, 15, 0},
    };
    vector<tuple<int,int,int>> mst;
    int total = kruskalMST(graph, mst);
    for (auto [u, v, w] : mst) cout << u << " - " << v << "  " << w << "\\n";
    cout << "Total weight: " << total << "\\n";
}`,
  idea: `Kruskal's Algorithm (join forests with the cheapest safe edge):

1. List every edge and sort them by weight, smallest first.
2. Start with a forest: every vertex is its own tiny tree
   (its own set in a union-find / disjoint-set structure).
3. For each edge (u, v) in sorted order:
   a. find(u) and find(v) tell us which tree each end is in.
   b. Different trees?  -> add the edge, union(u, v).
   c. Same tree?        -> skip it, it would make a cycle.
4. Stop when the tree has V - 1 edges.

Why it works:
- When an edge joins two different trees, it is the cheapest
  edge crossing between them (every cheaper edge was already
  looked at), so by the cut property it belongs in an MST.

Complexity:
- Sorting edges: O(E log E)
- Union-find operations: almost O(1) each (inverse Ackermann)
- Total: O(E log E) = O(E log V)`,
};

export default function Home() {
  useEffect(() => {
    window.scrollTo({ top: 50, behavior: "smooth" });
  }, []);

  return (
    <main className="vl-page">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Title */}
      <div className="max-w-6xl mx-auto px-8 mb-6">
        <div className="vl-hero">
          <div>
            <h1 className="vl-title text-4xl mb-2">
              Kruskal&apos;s Algorithm (Minimum Spanning Tree)
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Time: O(E log E)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                Space: O(V + E)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                Greedy · Union-Find
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="vl-card p-6">
          <P5Sketch />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-8 space-y-8">
        <AdBanner position="bottom" size="responsive" adTest="off" />

        {/* Description */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">Understanding Kruskal&apos;s Algorithm</h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
            <p className="text-lg">
              A <span className="text-pen-green font-semibold">minimum spanning tree</span>{" "}
              (MST) connects every vertex of an undirected, weighted graph using{" "}
              <span className="text-pen-plum font-semibold">V − 1 edges</span>, with no
              cycles, and with the smallest possible total weight.
            </p>
            <p className="text-lg">
              <span className="text-pen-blue font-semibold">Kruskal&apos;s algorithm</span>{" "}
              doesn&apos;t grow one tree like Prim&apos;s. Instead it looks at the edges{" "}
              <span className="text-pen-rust font-semibold">from cheapest to most expensive</span>{" "}
              and keeps an edge whenever it connects two pieces that are not yet connected.
              Many small trees (a forest) slowly merge into one spanning tree.
            </p>
            <div className="vl-note vl-note-green p-4 my-4">
              <p className="text-center text-lg font-bold text-pen-green">
                Take the cheapest edge that doesn&apos;t make a cycle. Repeat.
              </p>
            </div>
          </div>
        </div>

        {/* How to use */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">Using the Visualizer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-ink-2 leading-relaxed">
            <ul className="space-y-2">
              <li>
                • <span className="text-pen-plum font-semibold">Build your graph:</span> press{" "}
                <span className="font-semibold">Edit graph</span> to slide out the matrix and
                type a weight into any cell. Cell [i][j] is the edge between i and j,
                and it is copied to [j][i] for you because the graph is undirected.{" "}
                <span className="font-mono">0</span> means no edge.
              </li>
              <li>
                • <span className="text-pen-plum font-semibold">Vertices / Random / Example:</span>{" "}
                inside the drawer, change the size, get a random connected graph, or load the
                example back. The graph updates while you type.
              </li>
              <li>
                • <span className="text-pen-plum font-semibold">Colours:</span> vertices with
                the same colour are in the same set (the same tree of the forest).
              </li>
            </ul>
            <ul className="space-y-2">
              <li>
                • The controls above the board:{" "}
                <span className="text-pen-blue font-semibold">Play / Pause</span> runs the
                algorithm; <span className="text-pen-blue font-semibold">Back</span> and{" "}
                <span className="text-pen-blue font-semibold">Step</span> move one step at a
                time (or use ← → and space), and the bar under them jumps to any step.
              </li>
              <li>
                • The <span className="text-pen-blue font-semibold">sorted edge list</span> on
                the right shows which edge is next, which were kept and which were skipped.
              </li>
              <li>
                • The highlighted <span className="text-pen-blue font-semibold">pseudocode</span>{" "}
                line tells you exactly which part of the algorithm is running.
              </li>
            </ul>
          </div>
        </div>

        {/* Step by step */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">How Kruskal&apos;s Algorithm Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-plum p-6">
              <h3 className="vl-h3 mb-2">1. Sort the edges</h3>
              <p className="text-ink-2">
                Read every edge out of the upper half of the matrix and sort them by weight.
                Cheap edges get the first chance.
              </p>
            </div>
            <div className="vl-note vl-note-gold p-6">
              <h3 className="vl-h3 mb-2">2. Every vertex is its own set</h3>
              <p className="text-ink-2">
                A disjoint-set (union-find) structure remembers which vertices are already
                connected. At the start, nobody is connected to anybody.
              </p>
            </div>
            <div className="vl-note vl-note-green p-6">
              <h3 className="vl-h3 mb-2">3. Different sets → keep it</h3>
              <p className="text-ink-2">
                If <span className="font-mono">find(u) ≠ find(v)</span> the edge links two
                separate trees, so it can&apos;t close a loop. Add it (green) and{" "}
                <span className="font-mono">union</span> the two sets (the colours merge).
              </p>
            </div>
            <div className="vl-note vl-note-rust p-6">
              <h3 className="vl-h3 mb-2">4. Same set → skip it</h3>
              <p className="text-ink-2">
                If both ends are already in the same set there is already a path between them,
                so the edge would form a cycle (red, crossed out). Stop once V − 1 edges are in.
              </p>
            </div>
          </div>
          <div className="vl-note vl-note-blue p-4 mt-6">
            <p className="text-ink-2">
              <span className="font-semibold text-pen-blue">Prim&apos;s vs Kruskal&apos;s:</span>{" "}
              both are greedy and both give a minimum spanning tree (the same total weight).
              Prim&apos;s grows one tree from a start vertex and suits dense graphs; Kruskal&apos;s
              works edge by edge, suits sparse graphs, and on a disconnected graph naturally
              produces a minimum spanning <span className="font-semibold">forest</span>.
            </p>
          </div>
        </div>

        {/* Code Block */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">Implementation</h2>
          <CodeBlock codeSnippets={codeSnippets} defaultLang="js" height="600px" />
        </div>

        {/* Properties Analysis */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">Properties & Complexity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-plum p-6">
              <h3 className="vl-h3 mb-2">Time Complexity</h3>
              <ul className="text-ink-2 space-y-2">
                <li>
                  • <span className="text-pen-green font-semibold">Sorting edges:</span> O(E
                  log E)
                </li>
                <li>
                  • <span className="text-pen-green font-semibold">find / union:</span> ≈ O(1)
                  each (inverse Ackermann)
                </li>
                <li>
                  • <span className="text-pen-green font-semibold">Total:</span> O(E log E) =
                  O(E log V)
                </li>
                <li>
                  • <span className="text-pen-gold font-semibold">Reading a matrix:</span>{" "}
                  O(V²) to list the edges
                </li>
              </ul>
            </div>
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-2">Space & Properties</h3>
              <ul className="text-ink-2 space-y-2">
                <li>
                  • <span className="text-pen-blue font-semibold">Space:</span> O(E) edge list
                  + O(V) union-find
                </li>
                <li>
                  • <span className="text-pen-blue font-semibold">Strategy:</span> greedy
                </li>
                <li>
                  • <span className="text-pen-blue font-semibold">Grows:</span> a forest that
                  merges into one tree
                </li>
                <li>
                  • <span className="text-pen-blue font-semibold">Weights:</span> negative
                  weights are fine
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Use Cases & Comparisons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
              <span>Best Use Cases</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-green">Sparse graphs:</span> few edges means a
                cheap sort
              </li>
              <li>
                • <span className="text-pen-green">Edges given as a list:</span> no need to
                build an adjacency structure
              </li>
              <li>
                • <span className="text-pen-green">Network design:</span> cheapest way to wire
                up every site
              </li>
              <li>
                • <span className="text-pen-green">Clustering:</span> stop early with k sets to
                get k clusters
              </li>
            </ul>
          </div>
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
              <span>Limitations</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-gold">Dense graphs:</span> sorting ~V² edges is
                slower than Prim&apos;s O(V²)
              </li>
              <li>
                • <span className="text-pen-gold">Needs union-find:</span> one more data
                structure to implement
              </li>
              <li>
                • <span className="text-pen-gold">Undirected only:</span> not for directed
                graphs
              </li>
              <li>
                • <span className="text-pen-gold">Not shortest paths:</span> the MST does not
                give the shortest route between two vertices
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner Ad */}
        <AdBanner position="bottom" size="responsive" adTest="off" adSlot="9575932649" />

        {/* Bottom Spacer */}
        <div className="h-12"></div>
      </div>
    </main>
  );
}
