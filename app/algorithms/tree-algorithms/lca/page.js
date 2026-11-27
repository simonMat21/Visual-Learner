"use client";

import AlgoPage, { B, M } from "@/components/AlgoPage";
import TreeAlgoVisualizer from "@/components/TreeAlgoVisualizer";

const code = {
  js: `// Lowest common ancestor in a rooted tree (root = 0).
// adj = adjacency lists of the tree.

// Prepare: parent and depth with a DFS, then the binary lifting table.
function prepare(adj) {
  const n = adj.length, LOG = Math.max(1, Math.ceil(Math.log2(n)));
  const parent = Array(n).fill(-1), depth = Array(n).fill(0);
  const stack = [0], seen = Array(n).fill(false);
  seen[0] = true;
  while (stack.length) {
    const u = stack.pop();
    for (const v of adj[u]) if (!seen[v]) {
      seen[v] = true; parent[v] = u; depth[v] = depth[u] + 1; stack.push(v);
    }
  }
  const up = [parent];                         // up[k][x] = 2^k-th ancestor
  for (let k = 1; k < LOG; k++)
    up[k] = up[k - 1].map((a) => (a === -1 ? -1 : up[k - 1][a]));
  return { parent, depth, up, LOG };
}

// Method 1: climb. O(depth) per query.
function lcaClimb({ parent, depth }, u, v) {
  while (depth[u] > depth[v]) u = parent[u];
  while (depth[v] > depth[u]) v = parent[v];
  while (u !== v) { u = parent[u]; v = parent[v]; }
  return u;
}

// Method 2: binary lifting. O(log n) per query.
function lcaLift({ parent, depth, up, LOG }, u, v) {
  if (depth[u] < depth[v]) [u, v] = [v, u];
  let diff = depth[u] - depth[v];
  for (let k = 0; diff; k++, diff >>= 1) if (diff & 1) u = up[k][u];
  if (u === v) return u;
  for (let k = LOG - 1; k >= 0; k--)
    if (up[k][u] !== up[k][v]) { u = up[k][u]; v = up[k][v]; }
  return parent[u];
}`,
  py: `import math

def prepare(adj, root=0):
    n = len(adj)
    LOG = max(1, math.ceil(math.log2(n)))
    parent, depth = [-1] * n, [0] * n
    stack, seen = [root], {root}
    while stack:
        u = stack.pop()
        for v in adj[u]:
            if v not in seen:
                seen.add(v); parent[v] = u; depth[v] = depth[u] + 1; stack.append(v)
    up = [parent]
    for k in range(1, LOG):
        up.append([-1 if a == -1 else up[k - 1][a] for a in up[k - 1]])
    return parent, depth, up, LOG

def lca(parent, depth, up, LOG, u, v):
    if depth[u] < depth[v]:
        u, v = v, u
    diff = depth[u] - depth[v]
    for k in range(LOG):
        if diff >> k & 1:
            u = up[k][u]
    if u == v:
        return u
    for k in reversed(range(LOG)):
        if up[k][u] != up[k][v]:
            u, v = up[k][u], up[k][v]
    return parent[u]`,
  cpp: `#include <vector>
#include <algorithm>
using namespace std;

struct LCA {
    int LOG; vector<int> depth; vector<vector<int>> up;
    LCA(const vector<vector<int>>& adj, int root = 0) {
        int n = adj.size();
        LOG = 1; while ((1 << LOG) < n) LOG++;
        depth.assign(n, 0);
        up.assign(LOG, vector<int>(n, -1));
        vector<int> stack = {root}; vector<bool> seen(n); seen[root] = true;
        while (!stack.empty()) {
            int u = stack.back(); stack.pop_back();
            for (int v : adj[u]) if (!seen[v]) { seen[v] = true; up[0][v] = u; depth[v] = depth[u] + 1; stack.push_back(v); }
        }
        for (int k = 1; k < LOG; k++)
            for (int x = 0; x < n; x++) up[k][x] = up[k-1][x] < 0 ? -1 : up[k-1][up[k-1][x]];
    }
    int query(int u, int v) {
        if (depth[u] < depth[v]) swap(u, v);
        for (int k = 0, d = depth[u] - depth[v]; d; k++, d >>= 1) if (d & 1) u = up[k][u];
        if (u == v) return u;
        for (int k = LOG - 1; k >= 0; k--) if (up[k][u] != up[k][v]) { u = up[k][u]; v = up[k][v]; }
        return up[0][u];
    }
};`,
  idea: `The lowest common ancestor (LCA) of u and v is the deepest
node that is an ancestor of both (a node counts as its own
ancestor).

Climbing (simple):
  1. lift the deeper one until both are at the same depth
  2. lift both together until they meet

Binary lifting (fast for many queries):
  Precompute up[k][x] = the 2^k-th ancestor of x.
  1. lift the deeper one by the depth difference, using its
     binary digits (5 = 4 + 1: one jump of 4, one of 1)
  2. for k from big to small: if up[k][u] != up[k][v], jump both
     (they are still below the LCA); otherwise don't (would
     overshoot)
  3. now they are children of the LCA: answer parent[u]

Preprocessing O(n log n), each query O(log n).`,
};

export default function Home() {
  return (
    <AlgoPage
      title="Lowest Common Ancestor"
      whatTitle="What is the Lowest Common Ancestor?"
      meta={[
        { color: "green", text: "Climb: O(depth) per query" },
        { color: "blue", text: "Binary lifting: O(log n) per query" },
        { color: "rust", text: "Preprocess: O(n log n)" },
      ]}
      visualizer={<TreeAlgoVisualizer mode="lca" />}
      intro={
        <>
          <p>
            In a rooted tree, the <B>lowest common ancestor</B> (LCA) of two nodes <M>u</M> and <M>v</M> is the
            deepest node that has both of them below it. In a family tree it is the closest shared ancestor; in a
            file system, the deepest folder containing both files.
          </p>
          <p>
            The simple way is to <B c="plum">climb</B>: bring the deeper node up to the other&apos;s depth, then move
            both up one step at a time until they meet. That costs up to the height of the tree per question.{" "}
            <B c="rust">Binary lifting</B> precomputes every node&apos;s 1st, 2nd, 4th, 8th… ancestor, so the same
            climb can be done in big power-of-two jumps: O(log n) per question.
          </p>
        </>
      }
      keyIdea="Bring both nodes to the same depth, then climb together until they meet."
      usage={[
        <>Pick <M>u</M> and <M>v</M>, and choose <B c="plum">Climb up</B> or <B c="plum">Binary lifting</B>.</>,
        <>Pale yellow nodes are where the pointers have been; the green node is the answer.</>,
        <>With binary lifting, the table on the right fills one row (power of two) at a time; a green cell is the jump being used.</>,
        <>Type your own tree as edges like <M>0-1, 0-2, 1-3</M> (rooted at 0) and press Apply.</>,
      ]}
      steps={[
        { title: "1. Depths", color: "plum", body: <>One DFS from the root gives every node&apos;s parent and depth.</> },
        { title: "2. Level them", color: "gold", body: <>Move the deeper node up until both have the same depth.</> },
        { title: "3. Climb together", color: "green", body: <>Move both up until they are the same node: that is the LCA.</> },
        { title: "Binary lifting", color: "blue", body: <>Same idea with jumps of 2ᵏ: use the binary digits of the depth difference, then jump both while their 2ᵏ-ancestors differ.</> },
      ]}
      code={code}
      codeHeight="640px"
      time={[
        <><B>Climb:</B> O(h) per query, h = tree height (up to n)</>,
        <><B>Binary lifting:</B> O(n log n) to build, O(log n) per query</>,
        <><B>Euler tour + RMQ:</B> O(1) per query after O(n log n)</>,
      ]}
      space={[<><B c="blue">Climb:</B> O(n) for parent and depth</>, <><B c="blue">Binary lifting:</B> O(n log n) for the table</>]}
      uses={[
        <><B>Distance between two nodes:</B> depth[u] + depth[v] − 2·depth[LCA]</>,
        <><B>Version control:</B> git&apos;s merge base is a common ancestor of two commits</>,
        <><B>Biology:</B> closest common ancestor in an evolutionary tree</>,
        <><B>Network routing</B> in tree-shaped networks</>,
      ]}
      limits={[
        <><span className="text-pen-gold">Rooted trees:</span> the answer depends on the root</>,
        <><span className="text-pen-gold">Static:</span> the table must be rebuilt if the tree changes</>,
      ]}
    />
  );
}
