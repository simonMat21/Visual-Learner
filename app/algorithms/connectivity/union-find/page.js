"use client";

import Link from "next/link";
import AlgoPage, { B, M } from "@/components/AlgoPage";
import UnionFindVisualizer from "@/components/UnionFindVisualizer";

const code = {
  js: `// Disjoint Set Union with union by rank and path compression.
class DSU {
  constructor(n) {
    this.parent = [...Array(n).keys()];   // everyone starts as their own root
    this.rank = Array(n).fill(0);         // upper bound on each tree's height
  }

  find(x) {
    if (this.parent[x] !== x)
      this.parent[x] = this.find(this.parent[x]);   // path compression
    return this.parent[x];
  }

  union(a, b) {
    let ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;                    // already together
    if (this.rank[ra] < this.rank[rb]) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;                           // shorter tree under taller
    if (this.rank[ra] === this.rank[rb]) this.rank[ra]++;
    return true;
  }

  connected(a, b) {
    return this.find(a) === this.find(b);
  }
}`,
  py: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        # iterative, with path halving (a cheap form of compression)
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        return True`,
  cpp: `#include <vector>
#include <numeric>
#include <utility>
using namespace std;

struct DSU {
    vector<int> parent, rnk;
    DSU(int n) : parent(n), rnk(n, 0) { iota(parent.begin(), parent.end(), 0); }

    int find(int x) {
        return parent[x] == x ? x : parent[x] = find(parent[x]);
    }
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (rnk[a] < rnk[b]) swap(a, b);
        parent[b] = a;
        if (rnk[a] == rnk[b]) rnk[a]++;
        return true;
    }
};`,
  c: `#define N 10

int parent[N], rnk[N];

void makeSets(void) { for (int i = 0; i < N; i++) { parent[i] = i; rnk[i] = 0; } }

int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);   // path compression
    return parent[x];
}

int unite(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return 0;
    if (rnk[a] < rnk[b]) { int t = a; a = b; b = t; }
    parent[b] = a;
    if (rnk[a] == rnk[b]) rnk[a]++;
    return 1;
}`,
  idea: `Keep each set as a tree. Every element stores its parent;
the root is the set's name (its parent is itself).

find(x):  climb parents until the root.
union(a, b): find both roots, make one the child of the other.

Two tricks make it almost O(1):
- union by rank: hang the shorter tree under the taller one,
  so trees stay shallow (height <= log n).
- path compression: after a find, point every node on the
  path straight at the root, so the next find is instant.

Together: O(alpha(n)) per operation, where alpha grows so
slowly it is at most 4 for any realistic n.`,
};

export default function Home() {
  return (
    <AlgoPage
      title="Union-Find (Disjoint Set Union)"
      whatTitle="What is Union-Find?"
      meta={[
        { color: "green", text: "Find / Union: O(α(n)) ≈ O(1)" },
        { color: "blue", text: "Space: O(n)" },
        { color: "rust", text: "Union by rank + path compression" },
      ]}
      visualizer={<UnionFindVisualizer />}
      intro={
        <>
          <p>
            <B>Union-Find</B>, or <B>Disjoint Set Union (DSU)</B>, keeps track of elements split into groups that
            never overlap. It answers two questions very fast: <B c="plum">which group is x in?</B> (find) and{" "}
            <B c="plum">join the groups of a and b</B> (union).
          </p>
          <p>
            Each group is stored as a tree of <B c="rust">parent pointers</B>, and the root names the group. Find
            climbs to the root; union hangs one root under the other. Two small tricks, <B c="rust">union by rank</B>{" "}
            and <B c="rust">path compression</B>, keep the trees so flat that both operations are practically
            constant time. It is the engine behind{" "}
            <Link href="/algorithms/mst/kruskals-algorithm" className="text-pen-blue font-semibold underline">
              Kruskal&apos;s
            </Link>{" "}
            and{" "}
            <Link href="/algorithms/mst/boruvkas-algorithm" className="text-pen-blue font-semibold underline">
              Borůvka&apos;s
            </Link>{" "}
            algorithms.
          </p>
        </>
      }
      keyIdea="A set is a tree; its root is its name. Keep the trees flat."
      usage={[
        <>Type two elements (0–9) and press <B c="plum">Union</B>, <B c="plum">Find</B> or <B c="plum">Connected?</B></>,
        <>Arrows point from a child to its parent; each colour is one set and the thick-ringed node is its root.</>,
        <>The parent and rank arrays at the bottom are exactly what the code stores.</>,
        <>
          Load the <B c="plum">Worst-case chain</B> and run <M>Find(0)</M> with path compression on: the whole chain
          collapses to point at the root. Turn the tricks off to see trees grow tall.
        </>,
      ]}
      steps={[
        { title: "Find", color: "plum", body: <>Follow <M>parent[x]</M> until an element is its own parent: that root names the set.</> },
        { title: "Path compression", color: "green", body: <>Afterwards, point every node on the path straight at the root.</> },
        { title: "Union", color: "gold", body: <>Find both roots; if they differ, make one root the parent of the other.</> },
        { title: "Union by rank", color: "blue", body: <>Hang the tree with the smaller rank under the bigger one; equal ranks grow by one.</> },
      ]}
      code={code}
      time={[
        <><B>Both tricks:</B> O(α(n)) amortised per operation (α ≤ 4 in practice)</>,
        <><B>Only one trick:</B> O(log n)</>,
        <><B>Neither:</B> O(n) per find on a chain</>,
      ]}
      space={[<><B c="blue">Space:</B> O(n) for parent and rank</>, <><B c="blue">Union only:</B> sets can merge but never split</>]}
      uses={[
        <><B>Kruskal&apos;s MST:</B> does this edge make a cycle?</>,
        <><B>Connected components</B> as edges arrive one by one</>,
        <><B>Image segmentation</B> and percolation simulations</>,
        <><B>Equivalence:</B> merging accounts, type unification in compilers</>,
      ]}
      limits={[
        <><span className="text-pen-gold">No splitting:</span> you can&apos;t undo a union cheaply</>,
        <><span className="text-pen-gold">No listing:</span> getting all members of a set needs extra work</>,
      ]}
    />
  );
}
