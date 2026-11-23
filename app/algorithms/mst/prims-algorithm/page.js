"use client";

import { useEffect } from "react";

import { CodeBlock } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import AdBanner from "@/components/AdBanner";

import P5Sketch from "./P5Sketch";

const codeSnippets = {
  js: `// Prim's algorithm on an adjacency matrix (0 = no edge)
// Returns the MST edges and its total weight. O(V^2)
function primMST(graph, start = 0) {
  const n = graph.length;
  const inTree = Array(n).fill(false);
  const key = Array(n).fill(Infinity); // cheapest edge to the tree
  const parent = Array(n).fill(-1);    // which tree vertex that edge comes from
  key[start] = 0;

  for (let count = 0; count < n; count++) {
    // 1. pick the vertex outside the tree with the smallest key
    let u = -1;
    for (let v = 0; v < n; v++) {
      if (!inTree[v] && (u === -1 || key[v] < key[u])) u = v;
    }
    if (key[u] === Infinity) break; // the rest is unreachable

    // 2. add it to the tree
    inTree[u] = true;

    // 3. its edges may be cheaper ways to reach the other vertices
    for (let v = 0; v < n; v++) {
      const w = graph[u][v];
      if (w !== 0 && !inTree[v] && w < key[v]) {
        key[v] = w;
        parent[v] = u;
      }
    }
  }

  const edges = [];
  let total = 0;
  for (let v = 0; v < n; v++) {
    if (parent[v] !== -1) {
      edges.push([parent[v], v, graph[parent[v]][v]]);
      total += graph[parent[v]][v];
    }
  }
  return { edges, total };
}

// Example
const graph = [
  [0, 7, 0, 5, 0],
  [7, 0, 8, 9, 7],
  [0, 8, 0, 0, 5],
  [5, 9, 0, 0, 15],
  [0, 7, 5, 15, 0],
];
console.log(primMST(graph)); // total: 24`,
  c: `#include <stdio.h>
#include <limits.h>
#include <stdbool.h>

#define V 5

// index of the vertex outside the tree with the smallest key
int minKey(int key[], bool inTree[]) {
    int min = INT_MAX, minIndex = -1;
    for (int v = 0; v < V; v++)
        if (!inTree[v] && key[v] < min) {
            min = key[v];
            minIndex = v;
        }
    return minIndex;
}

void primMST(int graph[V][V], int start) {
    int parent[V], key[V];
    bool inTree[V];

    for (int i = 0; i < V; i++) {
        key[i] = INT_MAX;
        inTree[i] = false;
        parent[i] = -1;
    }
    key[start] = 0;

    for (int count = 0; count < V; count++) {
        int u = minKey(key, inTree);
        if (u == -1) break;            // disconnected graph
        inTree[u] = true;

        for (int v = 0; v < V; v++)
            if (graph[u][v] && !inTree[v] && graph[u][v] < key[v]) {
                parent[v] = u;
                key[v] = graph[u][v];
            }
    }

    int total = 0;
    printf("Edge   Weight\\n");
    for (int v = 0; v < V; v++)
        if (parent[v] != -1) {
            printf("%d - %d    %d\\n", parent[v], v, graph[v][parent[v]]);
            total += graph[v][parent[v]];
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
    primMST(graph, 0);
    return 0;
}`,
  py: `import math

def prim_mst(graph, start=0):
    """Prim's algorithm on an adjacency matrix (0 = no edge). O(V^2)"""
    n = len(graph)
    in_tree = [False] * n
    key = [math.inf] * n      # cheapest edge connecting v to the tree
    parent = [-1] * n
    key[start] = 0

    for _ in range(n):
        # pick the vertex outside the tree with the smallest key
        u = min((v for v in range(n) if not in_tree[v]), key=lambda v: key[v])
        if key[u] == math.inf:
            break  # the remaining vertices can't be reached
        in_tree[u] = True

        # update the keys of u's neighbours
        for v in range(n):
            w = graph[u][v]
            if w != 0 and not in_tree[v] and w < key[v]:
                key[v] = w
                parent[v] = u

    edges = [(parent[v], v, graph[parent[v]][v]) for v in range(n) if parent[v] != -1]
    return edges, sum(w for _, _, w in edges)


graph = [
    [0, 7, 0, 5, 0],
    [7, 0, 8, 9, 7],
    [0, 8, 0, 0, 5],
    [5, 9, 0, 0, 15],
    [0, 7, 5, 15, 0],
]
edges, total = prim_mst(graph)
print(edges, total)  # total = 24`,
  cpp: `#include <iostream>
#include <vector>
#include <climits>
using namespace std;

// Prim's algorithm on an adjacency matrix (0 = no edge). O(V^2)
pair<vector<int>, int> primMST(const vector<vector<int>>& graph, int start = 0) {
    int n = graph.size();
    vector<int> key(n, INT_MAX), parent(n, -1);
    vector<bool> inTree(n, false);
    key[start] = 0;

    for (int count = 0; count < n; count++) {
        int u = -1;
        for (int v = 0; v < n; v++)
            if (!inTree[v] && (u == -1 || key[v] < key[u])) u = v;
        if (key[u] == INT_MAX) break;   // disconnected
        inTree[u] = true;

        for (int v = 0; v < n; v++) {
            int w = graph[u][v];
            if (w != 0 && !inTree[v] && w < key[v]) {
                key[v] = w;
                parent[v] = u;
            }
        }
    }

    int total = 0;
    for (int v = 0; v < n; v++)
        if (parent[v] != -1) total += graph[parent[v]][v];
    return {parent, total};
}

int main() {
    vector<vector<int>> graph = {
        {0, 7, 0, 5, 0},
        {7, 0, 8, 9, 7},
        {0, 8, 0, 0, 5},
        {5, 9, 0, 0, 15},
        {0, 7, 5, 15, 0},
    };
    auto [parent, total] = primMST(graph);
    for (int v = 0; v < (int)parent.size(); v++)
        if (parent[v] != -1)
            cout << parent[v] << " - " << v << "  " << graph[parent[v]][v] << "\\n";
    cout << "Total weight: " << total << "\\n";
}`,
  idea: `Prim's Algorithm (grow one tree):

1. Pick a start vertex. The tree is just that vertex.
2. Give every vertex a "key" = the weight of the cheapest edge
   that connects it to the tree (∞ if none is known yet).
3. Repeat until every vertex is in the tree:
   a. Choose the outside vertex u with the smallest key.
      (= the cheapest edge leaving the tree)
   b. Add u, and the edge that gave it its key, to the tree.
   c. For every neighbour v of u still outside the tree:
      if weight(u, v) < key[v], then key[v] = weight(u, v)
      and remember parent[v] = u.
4. The edges parent[v] – v form the minimum spanning tree.

Why it works (the cut property):
- Split the vertices into "in the tree" and "not in the tree".
- The cheapest edge crossing that split is always part of
  some minimum spanning tree, so taking it is never a mistake.

Complexity:
- Adjacency matrix + array: O(V²)  (best for dense graphs)
- Adjacency list + binary heap: O(E log V)`,
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
              Prim&apos;s Algorithm (Minimum Spanning Tree)
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Time: O(V²) with a matrix
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                Space: O(V)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                Greedy · Undirected · Weighted
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
          <h2 className="vl-h2 mb-4">What is a Minimum Spanning Tree?</h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
            <p className="text-lg">
              A <span className="text-pen-green font-semibold">spanning tree</span> of a
              connected, undirected graph is a set of edges that connects{" "}
              <span className="text-pen-green font-semibold">every vertex</span> without
              forming any cycle. A graph with{" "}
              <span className="text-pen-plum font-semibold">V vertices</span> always needs
              exactly <span className="text-pen-plum font-semibold">V − 1 edges</span> for
              this. The <span className="text-pen-rust font-semibold">minimum</span> spanning
              tree (MST) is the spanning tree whose edge weights add up to the smallest total.
            </p>
            <p className="text-lg">
              <span className="text-pen-blue font-semibold">Prim&apos;s algorithm</span>{" "}
              builds the MST by growing a single tree. It starts from one vertex and, again and
              again, adds the <span className="text-pen-rust font-semibold">cheapest edge</span>{" "}
              that connects a vertex inside the tree to a vertex outside it — until every
              vertex has joined.
            </p>
            <div className="vl-note vl-note-green p-4 my-4">
              <p className="text-center text-lg font-bold text-pen-green">
                Always add the cheapest edge that leaves the tree.
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
                • <span className="text-pen-plum font-semibold">Start vertex:</span> use the{" "}
                <span className="font-semibold">Start</span> menu above the board or simply click a vertex in the graph.
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
                • The <span className="text-pen-blue font-semibold">table</span> on the right
                shows each vertex&apos;s key and parent — the same arrays the code uses.
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
          <h2 className="vl-h2 mb-6">How Prim&apos;s Algorithm Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-plum p-6">
              <h3 className="vl-h3 mb-2">1. Start</h3>
              <p className="text-ink-2">
                Put the start vertex in the tree with key 0. Every other vertex gets key ∞ —
                we don&apos;t yet know any edge that reaches it.
              </p>
            </div>
            <div className="vl-note vl-note-gold p-6">
              <h3 className="vl-h3 mb-2">2. Pick the smallest key</h3>
              <p className="text-ink-2">
                Among the vertices outside the tree, choose the one with the smallest key. Its
                key edge is the cheapest edge leaving the tree (drawn thick yellow).
              </p>
            </div>
            <div className="vl-note vl-note-green p-6">
              <h3 className="vl-h3 mb-2">3. Add it to the tree</h3>
              <p className="text-ink-2">
                The vertex and its edge join the tree (green). Edges that now join two tree
                vertices can never be used — they would close a cycle — so they fade out.
              </p>
            </div>
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-2">4. Update the neighbours</h3>
              <p className="text-ink-2">
                Check every edge from the new vertex to the outside (blue). If it is cheaper
                than a neighbour&apos;s key, that key drops and its parent changes. Repeat
                from step 2 until every vertex is in.
              </p>
            </div>
          </div>
          <div className="vl-note vl-note-rust p-4 mt-6">
            <p className="text-ink-2">
              <span className="font-semibold text-pen-rust">Why is it correct?</span> Split the
              vertices into &quot;in the tree&quot; and &quot;not in the tree&quot;. Any
              spanning tree must use at least one edge across that split, and swapping it for
              the cheapest crossing edge can never make the tree heavier. This is called the{" "}
              <span className="font-semibold">cut property</span>.
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
                  • <span className="text-pen-green font-semibold">Adjacency matrix:</span>{" "}
                  O(V²)
                </li>
                <li>
                  • <span className="text-pen-green font-semibold">Binary heap + list:</span>{" "}
                  O(E log V)
                </li>
                <li>
                  • <span className="text-pen-green font-semibold">Fibonacci heap:</span>{" "}
                  O(E + V log V)
                </li>
                <li>
                  • <span className="text-pen-gold font-semibold">Per step:</span> pick min
                  O(V), update neighbours O(V)
                </li>
              </ul>
            </div>
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-2">Space & Properties</h3>
              <ul className="text-ink-2 space-y-2">
                <li>
                  • <span className="text-pen-blue font-semibold">Space:</span> O(V) for key,
                  parent and inTree
                </li>
                <li>
                  • <span className="text-pen-blue font-semibold">Strategy:</span> greedy
                </li>
                <li>
                  • <span className="text-pen-blue font-semibold">Grows:</span> one connected
                  tree the whole time
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
                • <span className="text-pen-green">Dense graphs:</span> the O(V²) matrix
                version beats Kruskal&apos;s when E is close to V²
              </li>
              <li>
                • <span className="text-pen-green">Network design:</span> cheapest cables,
                pipes or roads that connect every site
              </li>
              <li>
                • <span className="text-pen-green">Clustering:</span> build the MST, then cut
                the heaviest edges
              </li>
              <li>
                • <span className="text-pen-green">Approximations:</span> a building block for
                the travelling salesman 2-approximation
              </li>
            </ul>
          </div>
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
              <span>Limitations</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-gold">Connected graphs only:</span> on a
                disconnected graph it only spans the start vertex&apos;s piece
              </li>
              <li>
                • <span className="text-pen-gold">Undirected only:</span> directed graphs need
                a different algorithm (Edmonds&apos;)
              </li>
              <li>
                • <span className="text-pen-gold">Sparse graphs:</span> the matrix version
                wastes time scanning empty cells
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
