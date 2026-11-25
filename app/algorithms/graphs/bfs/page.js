"use client";

import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import AdBanner from "@/components/AdBanner";
import TraversalVisualizer from "@/components/TraversalVisualizer";

const codeSnippets = {
  js: `// Breadth-first search on an adjacency matrix (graph[u][v] = 1 means an edge)
function bfs(graph, start) {
  const n = graph.length;
  const visited = Array(n).fill(false);
  const dist = Array(n).fill(Infinity);   // number of edges from start
  const parent = Array(n).fill(-1);
  const order = [];

  const queue = [start];
  visited[start] = true;
  dist[start] = 0;

  while (queue.length > 0) {
    const u = queue.shift();              // take from the front
    order.push(u);
    for (let v = 0; v < n; v++) {
      if (graph[u][v] && !visited[v]) {
        visited[v] = true;                // mark when enqueued, not when dequeued
        dist[v] = dist[u] + 1;
        parent[v] = u;
        queue.push(v);                    // add to the back
      }
    }
  }
  return { order, dist, parent };
}

// Shortest path (fewest edges) from start to target, using parent[]
function path(parent, target) {
  const out = [];
  for (let v = target; v !== -1; v = parent[v]) out.unshift(v);
  return out;
}`,
  c: `#include <stdbool.h>

#define N 8

void bfs(int graph[N][N], int start, int order[], int dist[], int parent[]) {
    bool visited[N] = { false };
    int queue[N], head = 0, tail = 0, k = 0;

    for (int i = 0; i < N; i++) { dist[i] = -1; parent[i] = -1; }

    visited[start] = true;
    dist[start] = 0;
    queue[tail++] = start;

    while (head < tail) {
        int u = queue[head++];          // dequeue
        order[k++] = u;
        for (int v = 0; v < N; v++) {
            if (graph[u][v] && !visited[v]) {
                visited[v] = true;
                dist[v] = dist[u] + 1;
                parent[v] = u;
                queue[tail++] = v;      // enqueue
            }
        }
    }
}`,
  py: `from collections import deque

def bfs(graph, start):
    """Breadth-first search on an adjacency matrix."""
    n = len(graph)
    visited = [False] * n
    dist = [None] * n
    parent = [-1] * n
    order = []

    queue = deque([start])
    visited[start] = True
    dist[start] = 0

    while queue:
        u = queue.popleft()               # take from the front
        order.append(u)
        for v in range(n):
            if graph[u][v] and not visited[v]:
                visited[v] = True
                dist[v] = dist[u] + 1
                parent[v] = u
                queue.append(v)           # add to the back
    return order, dist, parent`,
  cpp: `#include <queue>
#include <vector>
using namespace std;

vector<int> bfs(const vector<vector<int>>& graph, int start,
                vector<int>& dist, vector<int>& parent) {
    int n = graph.size();
    vector<bool> visited(n, false);
    dist.assign(n, -1);
    parent.assign(n, -1);
    vector<int> order;

    queue<int> q;
    q.push(start);
    visited[start] = true;
    dist[start] = 0;

    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v = 0; v < n; v++) {
            if (graph[u][v] && !visited[v]) {
                visited[v] = true;
                dist[v] = dist[u] + 1;
                parent[v] = u;
                q.push(v);
            }
        }
    }
    return order;
}`,
  idea: `Breadth-first search explores in rings around the start:
first every vertex 1 edge away, then 2 edges away, and so on.

1. Mark the start visited and put it in a queue.
2. Repeat until the queue is empty:
   a. Take u from the FRONT of the queue and visit it.
   b. For each neighbour v of u that is not visited:
      mark it visited, remember parent[v] = u, put it at the BACK.

Because the queue is first-in first-out, vertices come out in
order of distance. So BFS finds the shortest path (fewest edges)
in an unweighted graph.`,
};

export default function Home() {
  return (
    <main className="vl-page">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      <div className="max-w-6xl mx-auto px-8 mb-6">
        <div className="vl-hero">
          <div>
            <h1 className="vl-title text-4xl mb-2">Breadth-First Search (BFS)</h1>
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
                Uses a queue
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="vl-card px-6 py-4">
          <TraversalVisualizer algo="bfs" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 space-y-8">
        <AdBanner position="bottom" size="responsive" adTest="off" />

        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">What is Breadth-First Search?</h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
            <p className="text-lg">
              <span className="text-pen-green font-semibold">Breadth-first search</span> visits a graph in{" "}
              <span className="text-pen-plum font-semibold">layers</span>: first the start vertex, then all of its
              neighbours, then all of their unvisited neighbours, and so on. It is like a ripple spreading out from
              where a stone hit the water.
            </p>
            <p className="text-lg">
              The trick is a{" "}
              <Link href="/algorithms/stack-queue/queue" className="text-pen-blue font-semibold underline">
                queue
              </Link>
              : newly found vertices join at the back, and the next vertex to explore is taken from the front. That
              keeps vertices in order of their distance from the start, which is why BFS also finds the{" "}
              <span className="text-pen-rust font-semibold">shortest path</span> (fewest edges) in an unweighted
              graph. Look at the <span className="font-mono">d =</span> labels on the board.
            </p>
            <div className="vl-note vl-note-green p-4 my-4">
              <p className="text-center text-lg font-bold text-pen-green">Explore the nearest vertices first: one layer at a time.</p>
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
              • On the right: the <span className="font-semibold">queue</span>, the{" "}
              <span className="font-semibold">visit order</span>, and each vertex&apos;s visited flag, parent and
              distance. Green edges are the <span className="font-semibold">BFS tree</span>: following parents back
              gives a shortest path.
            </li>
            <li>
              • Neighbours are tried in increasing order, so the result matches the code below.
            </li>
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
                <li>• Every vertex is enqueued and dequeued at most once</li>
              </ul>
            </div>
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-2">Space & Properties</h3>
              <ul className="text-ink-2 space-y-2">
                <li>• <span className="text-pen-blue font-semibold">Space:</span> O(V) for the queue and arrays</li>
                <li>• <span className="text-pen-blue font-semibold">Shortest paths:</span> yes, by edge count</li>
                <li>• <span className="text-pen-blue font-semibold">Order:</span> layer by layer</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4"><span>Where BFS Is Used</span></h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>• <span className="text-pen-green">Shortest routes</span> when every step costs the same</li>
              <li>• <span className="text-pen-green">Social networks:</span> friends, friends of friends…</li>
              <li>• <span className="text-pen-green">Web crawlers</span> and broadcasting in networks</li>
              <li>• <span className="text-pen-green">Puzzles:</span> fewest moves to solve a maze or a cube</li>
            </ul>
          </div>
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4"><span>Limitations</span></h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>• <span className="text-pen-gold">Weighted graphs:</span> fewest edges isn&apos;t cheapest; use Dijkstra</li>
              <li>• <span className="text-pen-gold">Memory:</span> a wide graph puts many vertices in the queue at once</li>
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
