"use client";

import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import AdBanner from "@/components/AdBanner";
import TraversalVisualizer from "@/components/TraversalVisualizer";

const codeSnippets = {
  js: `// Depth-first search on an adjacency matrix (graph[u][v] = 1 means an edge)
function dfs(graph, start) {
  const n = graph.length;
  const visited = Array(n).fill(false);
  const parent = Array(n).fill(-1);
  const order = [];

  function visit(u) {
    visited[u] = true;
    order.push(u);
    for (let v = 0; v < n; v++) {
      if (graph[u][v] && !visited[v]) {
        parent[v] = u;
        visit(v);               // go as deep as possible first
      }
    }
    // returning here = backtracking to the caller
  }

  visit(start);
  return { order, parent };
}

// The same thing with an explicit stack instead of recursion
function dfsIterative(graph, start) {
  const n = graph.length;
  const visited = Array(n).fill(false);
  const order = [];
  const stack = [start];
  while (stack.length) {
    const u = stack.pop();
    if (visited[u]) continue;
    visited[u] = true;
    order.push(u);
    for (let v = n - 1; v >= 0; v--)       // push in reverse so 0 is tried first
      if (graph[u][v] && !visited[v]) stack.push(v);
  }
  return order;
}`,
  c: `#include <stdbool.h>

#define N 8

static bool visited[N];
static int parent[N];
static int order[N], k = 0;

void visit(int graph[N][N], int u) {
    visited[u] = true;
    order[k++] = u;
    for (int v = 0; v < N; v++) {
        if (graph[u][v] && !visited[v]) {
            parent[v] = u;
            visit(graph, v);        // go deeper first
        }
    }
    // returning = backtracking
}

void dfs(int graph[N][N], int start) {
    for (int i = 0; i < N; i++) { visited[i] = false; parent[i] = -1; }
    k = 0;
    visit(graph, start);
}`,
  py: `def dfs(graph, start):
    """Depth-first search on an adjacency matrix (recursive)."""
    n = len(graph)
    visited = [False] * n
    parent = [-1] * n
    order = []

    def visit(u):
        visited[u] = True
        order.append(u)
        for v in range(n):
            if graph[u][v] and not visited[v]:
                parent[v] = u
                visit(v)        # go deeper first
        # returning here = backtracking

    visit(start)
    return order, parent`,
  cpp: `#include <vector>
using namespace std;

void visit(const vector<vector<int>>& graph, int u,
           vector<bool>& visited, vector<int>& parent, vector<int>& order) {
    visited[u] = true;
    order.push_back(u);
    for (int v = 0; v < (int)graph.size(); v++) {
        if (graph[u][v] && !visited[v]) {
            parent[v] = u;
            visit(graph, v, visited, parent, order);   // go deeper first
        }
    }
}

vector<int> dfs(const vector<vector<int>>& graph, int start, vector<int>& parent) {
    int n = graph.size();
    vector<bool> visited(n, false);
    parent.assign(n, -1);
    vector<int> order;
    visit(graph, start, visited, parent, order);
    return order;
}`,
  idea: `Depth-first search goes as deep as it can along one path,
and only when it gets stuck does it back up and try another.

dfs(u):
  1. mark u visited
  2. for each neighbour v of u that is not visited:
       remember parent[v] = u and call dfs(v)
  3. return (backtrack)

The recursion keeps a call stack of the path from the start
to where we are now. You can also write it with your own
stack: push neighbours, pop the newest one next.`,
};

export default function Home() {
  return (
    <main className="vl-page">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      <div className="max-w-6xl mx-auto px-8 mb-6">
        <div className="vl-hero">
          <div>
            <h1 className="vl-title text-4xl mb-2">Depth-First Search (DFS)</h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Time: O(V + E) list, O(V²) matrix
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-blue rounded-full mr-2"></span>
                Space: O(V)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                Uses a stack (recursion)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="vl-card px-6 py-4">
          <TraversalVisualizer algo="dfs" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 space-y-8">
        <AdBanner position="bottom" size="responsive" adTest="off" />

        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">What is Depth-First Search?</h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
            <p className="text-lg">
              <span className="text-pen-green font-semibold">Depth-first search</span> follows one path as{" "}
              <span className="text-pen-plum font-semibold">deep</span> as it can go. Only when a vertex has no
              unvisited neighbours left does it <span className="text-pen-rust font-semibold">backtrack</span> to the
              previous vertex and try its next option, like exploring a maze by always taking the next unexplored
              turn and walking back when you hit a dead end.
            </p>
            <p className="text-lg">
              The recursion is a{" "}
              <Link href="/algorithms/stack-queue/stack" className="text-pen-blue font-semibold underline">
                stack
              </Link>{" "}
              in disguise: the call stack on the right holds the path from the start to the current vertex. Every
              call is pushed when DFS goes deeper and popped when it backtracks. Compare it with{" "}
              <Link href="/algorithms/graphs/bfs" className="text-pen-blue font-semibold underline">
                BFS
              </Link>{" "}
              on the same graph to see how the visit order changes.
            </p>
            <div className="vl-note vl-note-green p-4 my-4">
              <p className="text-center text-lg font-bold text-pen-green">Go deep first, backtrack when stuck.</p>
            </div>
          </div>
        </div>

        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">Using the Visualizer</h2>
          <ul className="space-y-2 text-ink-2 leading-relaxed">
            <li>
              • <span className="text-pen-plum font-semibold">Edit graph</span> slides out the adjacency matrix: click
              a cell to add or remove an edge, or use Random / Example. Tick{" "}
              <span className="font-semibold">Directed</span> for one-way edges.
            </li>
            <li>
              • Pick the <span className="text-pen-plum font-semibold">start</span> from the menu or click a vertex.
            </li>
            <li>
              • Blue vertices are still on the call stack (waiting for a deeper call to finish), green ones are
              finished. The <span className="font-mono">#</span> labels show the order each vertex was found.
            </li>
            <li>• Neighbours are tried in increasing order, so the result matches the code below.</li>
          </ul>
        </div>

        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">Implementation</h2>
          <CodeBlock codeSnippets={codeSnippets} defaultLang="js" height="600px" />
        </div>

        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">Properties & Complexity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-plum p-6">
              <h3 className="vl-h3 mb-2">Time Complexity</h3>
              <ul className="text-ink-2 space-y-2">
                <li>• <span className="text-pen-green font-semibold">Adjacency list:</span> O(V + E)</li>
                <li>• <span className="text-pen-green font-semibold">Adjacency matrix:</span> O(V²)</li>
                <li>• Every vertex is entered once, every edge looked at once (twice if undirected)</li>
              </ul>
            </div>
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-2">Space & Properties</h3>
              <ul className="text-ink-2 space-y-2">
                <li>• <span className="text-pen-blue font-semibold">Space:</span> O(V) for the call stack and arrays</li>
                <li>• <span className="text-pen-blue font-semibold">Shortest paths:</span> no, the first path found may be long</li>
                <li>• <span className="text-pen-blue font-semibold">Order:</span> one branch fully before the next</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4"><span>Where DFS Is Used</span></h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>• <span className="text-pen-green">Mazes and puzzles:</span> backtracking search</li>
              <li>• <span className="text-pen-green">Cycle detection</span> and finding connected parts</li>
              <li>• <span className="text-pen-green">Topological sort:</span> ordering tasks with dependencies</li>
              <li>• <span className="text-pen-green">Tree traversals:</span> pre-order, in-order, post-order are DFS</li>
            </ul>
          </div>
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4"><span>Limitations</span></h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>• <span className="text-pen-gold">Not shortest:</span> use BFS for fewest edges</li>
              <li>• <span className="text-pen-gold">Deep graphs:</span> recursion can overflow the call stack</li>
              <li>• <span className="text-pen-gold">Reachability:</span> only finds vertices connected to the start</li>
            </ul>
          </div>
        </div>

        <AdBanner position="bottom" size="responsive" adTest="off" adSlot="9575932649" />
        <div className="h-12"></div>
      </div>
    </main>
  );
}
