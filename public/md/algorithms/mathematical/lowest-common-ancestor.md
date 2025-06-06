# Lowest Common Ancestor (LCA)

## Overview

The Lowest Common Ancestor (LCA) problem involves finding the deepest node that is an ancestor of two given nodes in a tree or directed acyclic graph. This fundamental problem appears in many applications including phylogenetic analysis, version control systems, and network routing. Various algorithms exist with different time and space complexities for preprocessing and query operations.

## Key Concepts

- **Ancestor**: A node v is an ancestor of node u if v lies on the path from the root to u
- **Common Ancestor**: A node that is an ancestor of both query nodes
- **Lowest Common Ancestor**: The common ancestor with the greatest depth
- **Preprocessing**: Building auxiliary data structures to answer queries efficiently
- **Query Time**: Time required to answer a single LCA query after preprocessing

## Time & Space Complexity

| Algorithm        | Preprocessing | Query    | Space      |
| ---------------- | ------------- | -------- | ---------- |
| Naive            | O(1)          | O(n)     | O(1)       |
| Binary Lifting   | O(n log n)    | O(log n) | O(n log n) |
| Euler Tour + RMQ | O(n log n)    | O(1)     | O(n log n) |
| Tarjan's Offline | O(n α(n))     | O(1)     | O(n)       |

## Basic Implementations

### Naive Approach

```typescript
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  parent: TreeNode | null;

  constructor(val: number) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

class NaiveLCA {
  private root: TreeNode;
  private depths: Map<TreeNode, number>;

  constructor(root: TreeNode) {
    this.root = root;
    this.depths = new Map();
    this.computeDepths(root, 0);
  }

  private computeDepths(node: TreeNode | null, depth: number): void {
    if (!node) return;

    this.depths.set(node, depth);
    this.computeDepths(node.left, depth + 1);
    this.computeDepths(node.right, depth + 1);
  }

  findLCA(node1: TreeNode, node2: TreeNode): TreeNode | null {
    const depth1 = this.depths.get(node1) || 0;
    const depth2 = this.depths.get(node2) || 0;

    let current1 = node1;
    let current2 = node2;

    while (depth1 > depth2 && current1.parent) {
      current1 = current1.parent;
    }

    while (depth2 > depth1 && current2.parent) {
      current2 = current2.parent;
    }

    while (current1 !== current2 && current1.parent && current2.parent) {
      current1 = current1.parent;
      current2 = current2.parent;
    }

    return current1 === current2 ? current1 : null;
  }
}
```

### Binary Lifting Approach

```typescript
class BinaryLiftingLCA {
  private parent: number[][];
  private depth: number[];
  private n: number;
  private logN: number;

  constructor(tree: number[][], root: number = 0) {
    this.n = tree.length;
    this.logN = Math.ceil(Math.log2(this.n));
    this.parent = Array(this.n)
      .fill(null)
      .map(() => Array(this.logN).fill(-1));
    this.depth = new Array(this.n).fill(0);

    this.dfs(tree, root, -1, 0);
    this.buildBinaryLifting();
  }

  private dfs(tree: number[][], node: number, par: number, d: number): void {
    this.parent[node][0] = par;
    this.depth[node] = d;

    for (const child of tree[node]) {
      if (child !== par) {
        this.dfs(tree, child, node, d + 1);
      }
    }
  }

  private buildBinaryLifting(): void {
    for (let j = 1; j < this.logN; j++) {
      for (let i = 0; i < this.n; i++) {
        if (this.parent[i][j - 1] !== -1) {
          this.parent[i][j] = this.parent[this.parent[i][j - 1]][j - 1];
        }
      }
    }
  }

  findLCA(u: number, v: number): number {
    if (this.depth[u] < this.depth[v]) {
      [u, v] = [v, u];
    }

    const diff = this.depth[u] - this.depth[v];
    for (let i = 0; i < this.logN; i++) {
      if ((diff >> i) & 1) {
        u = this.parent[u][i];
      }
    }

    if (u === v) return u;

    for (let i = this.logN - 1; i >= 0; i--) {
      if (this.parent[u][i] !== this.parent[v][i]) {
        u = this.parent[u][i];
        v = this.parent[v][i];
      }
    }

    return this.parent[u][0];
  }

  findDistance(u: number, v: number): number {
    const lca = this.findLCA(u, v);
    return this.depth[u] + this.depth[v] - 2 * this.depth[lca];
  }

  isAncestor(u: number, v: number): boolean {
    return this.findLCA(u, v) === u;
  }

  kthAncestor(node: number, k: number): number {
    if (this.depth[node] < k) return -1;

    for (let i = 0; i < this.logN; i++) {
      if ((k >> i) & 1) {
        node = this.parent[node][i];
        if (node === -1) return -1;
      }
    }

    return node;
  }
}
```

### Euler Tour + Range Minimum Query

```typescript
class EulerTourLCA {
  private euler: number[];
  private first: number[];
  private depth: number[];
  private rmq: RangeMinimumQuery;

  constructor(tree: number[][], root: number = 0) {
    this.euler = [];
    this.first = new Array(tree.length).fill(-1);
    this.depth = [];

    this.eulerTour(tree, root, -1, 0);
    this.rmq = new RangeMinimumQuery(this.depth);
  }

  private eulerTour(
    tree: number[][],
    node: number,
    parent: number,
    d: number
  ): void {
    this.first[node] = this.euler.length;
    this.euler.push(node);
    this.depth.push(d);

    for (const child of tree[node]) {
      if (child !== parent) {
        this.eulerTour(tree, child, node, d + 1);
        this.euler.push(node);
        this.depth.push(d);
      }
    }
  }

  findLCA(u: number, v: number): number {
    let left = this.first[u];
    let right = this.first[v];

    if (left > right) [left, right] = [right, left];

    const minIndex = this.rmq.query(left, right);
    return this.euler[minIndex];
  }
}

class RangeMinimumQuery {
  private sparse: number[][];
  private values: number[];
  private n: number;
  private logN: number;

  constructor(arr: number[]) {
    this.values = arr;
    this.n = arr.length;
    this.logN = Math.ceil(Math.log2(this.n));
    this.sparse = Array(this.n)
      .fill(null)
      .map(() => Array(this.logN).fill(0));

    this.buildSparseTable();
  }

  private buildSparseTable(): void {
    for (let i = 0; i < this.n; i++) {
      this.sparse[i][0] = i;
    }

    for (let j = 1; j < this.logN; j++) {
      for (let i = 0; i + (1 << j) <= this.n; i++) {
        const left = this.sparse[i][j - 1];
        const right = this.sparse[i + (1 << (j - 1))][j - 1];

        this.sparse[i][j] =
          this.values[left] <= this.values[right] ? left : right;
      }
    }
  }

  query(left: number, right: number): number {
    const length = right - left + 1;
    const k = Math.floor(Math.log2(length));

    const leftMin = this.sparse[left][k];
    const rightMin = this.sparse[right - (1 << k) + 1][k];

    return this.values[leftMin] <= this.values[rightMin] ? leftMin : rightMin;
  }
}
```

### Tarjan's Offline LCA Algorithm

```typescript
class TarjanLCA {
  private parent: number[];
  private rank: number[];
  private ancestor: number[];
  private visited: boolean[];
  private queries: Map<number, Array<{ node: number; id: number }>>;
  private results: Array<number>;

  constructor(n: number) {
    this.parent = Array(n)
      .fill(0)
      .map((_, i) => i);
    this.rank = Array(n).fill(0);
    this.ancestor = Array(n)
      .fill(0)
      .map((_, i) => i);
    this.visited = Array(n).fill(false);
    this.queries = new Map();
    this.results = [];
  }

  private find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  private union(x: number, y: number): void {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX !== rootY) {
      if (this.rank[rootX] < this.rank[rootY]) {
        this.parent[rootX] = rootY;
      } else if (this.rank[rootX] > this.rank[rootY]) {
        this.parent[rootY] = rootX;
      } else {
        this.parent[rootY] = rootX;
        this.rank[rootX]++;
      }
    }
  }

  addQuery(u: number, v: number): number {
    const queryId = this.results.length;
    this.results.push(-1);

    if (!this.queries.has(u)) this.queries.set(u, []);
    if (!this.queries.has(v)) this.queries.set(v, []);

    this.queries.get(u)!.push({ node: v, id: queryId });
    this.queries.get(v)!.push({ node: u, id: queryId });

    return queryId;
  }

  solveLCA(tree: number[][], root: number): number[] {
    this.dfs(tree, root, -1);
    return this.results;
  }

  private dfs(tree: number[][], node: number, parent: number): void {
    this.ancestor[this.find(node)] = node;

    for (const child of tree[node]) {
      if (child !== parent) {
        this.dfs(tree, child, node);
        this.union(node, child);
        this.ancestor[this.find(node)] = node;
      }
    }

    this.visited[node] = true;

    if (this.queries.has(node)) {
      for (const query of this.queries.get(node)!) {
        if (this.visited[query.node]) {
          this.results[query.id] = this.ancestor[this.find(query.node)];
        }
      }
    }
  }
}
```

## Step-by-Step Example

### Binary Lifting Example

Consider a tree with nodes 0-6:

```
    0
   / \
  1   2
 /   / \
3   4   5
   /
  6
```

Building the binary lifting table:

```
parent[i][0] = direct parent
parent[0][0] = -1
parent[1][0] = 0
parent[2][0] = 0
parent[3][0] = 1
parent[4][0] = 2
parent[5][0] = 2
parent[6][0] = 4

parent[i][1] = parent[parent[i][0]][0] (grandparent)
parent[1][1] = parent[0][0] = -1
parent[2][1] = parent[0][0] = -1
parent[3][1] = parent[1][0] = 0
parent[4][1] = parent[2][0] = 0
parent[5][1] = parent[2][0] = 0
parent[6][1] = parent[4][0] = 2
```

Finding LCA(6, 5):

```
depth[6] = 3, depth[5] = 2
Lift node 6 up by 1 level: 6 → 4
Now both nodes are at depth 2
Check if parent[4][0] = parent[5][0]: 2 = 2 ✓
LCA(6, 5) = 2
```

## Real-World Applications

### Version Control System

```typescript
class GitLikeVersionControl {
  private commits: Map<string, Commit>;
  private lca: BinaryLiftingLCA;
  private commitToIndex: Map<string, number>;
  private tree: number[][];

  constructor() {
    this.commits = new Map();
    this.commitToIndex = new Map();
    this.tree = [];
  }

  addCommit(hash: string, parentHash: string | null, message: string): void {
    const commit = new Commit(hash, parentHash, message);
    this.commits.set(hash, commit);

    const index = this.commitToIndex.size;
    this.commitToIndex.set(hash, index);

    if (this.tree.length <= index) {
      this.tree.push([]);
    }

    if (parentHash && this.commitToIndex.has(parentHash)) {
      const parentIndex = this.commitToIndex.get(parentHash)!;
      this.tree[parentIndex].push(index);
      this.tree[index].push(parentIndex);
    }

    this.rebuildLCA();
  }

  findMergeBase(hash1: string, hash2: string): string | null {
    const index1 = this.commitToIndex.get(hash1);
    const index2 = this.commitToIndex.get(hash2);

    if (index1 === undefined || index2 === undefined) return null;

    const lcaIndex = this.lca.findLCA(index1, index2);

    for (const [hash, index] of this.commitToIndex) {
      if (index === lcaIndex) return hash;
    }

    return null;
  }

  getCommitDistance(hash1: string, hash2: string): number {
    const index1 = this.commitToIndex.get(hash1);
    const index2 = this.commitToIndex.get(hash2);

    if (index1 === undefined || index2 === undefined) return -1;

    return this.lca.findDistance(index1, index2);
  }

  private rebuildLCA(): void {
    if (this.tree.length > 0) {
      this.lca = new BinaryLiftingLCA(this.tree, 0);
    }
  }
}

class Commit {
  hash: string;
  parentHash: string | null;
  message: string;
  timestamp: Date;

  constructor(hash: string, parentHash: string | null, message: string) {
    this.hash = hash;
    this.parentHash = parentHash;
    this.message = message;
    this.timestamp = new Date();
  }
}
```

### File System Hierarchy

```typescript
class FileSystemLCA {
  private pathToNode: Map<string, number>;
  private nodeToPath: Map<number, string>;
  private lca: BinaryLiftingLCA;

  constructor(paths: string[]) {
    this.pathToNode = new Map();
    this.nodeToPath = new Map();

    const tree = this.buildTree(paths);
    this.lca = new BinaryLiftingLCA(tree);
  }

  private buildTree(paths: string[]): number[][] {
    const sortedPaths = paths.sort();
    const tree: number[][] = [];

    sortedPaths.forEach((path, index) => {
      this.pathToNode.set(path, index);
      this.nodeToPath.set(index, path);
      tree.push([]);
    });

    for (let i = 0; i < sortedPaths.length; i++) {
      const currentPath = sortedPaths[i];
      const parentPath = this.getParentPath(currentPath);

      if (parentPath && this.pathToNode.has(parentPath)) {
        const parentIndex = this.pathToNode.get(parentPath)!;
        tree[parentIndex].push(i);
        tree[i].push(parentIndex);
      }
    }

    return tree;
  }

  private getParentPath(path: string): string | null {
    const lastSlash = path.lastIndexOf("/");
    if (lastSlash <= 0) return null;
    return path.substring(0, lastSlash);
  }

  findCommonAncestor(path1: string, path2: string): string | null {
    const node1 = this.pathToNode.get(path1);
    const node2 = this.pathToNode.get(path2);

    if (node1 === undefined || node2 === undefined) return null;

    const lcaNode = this.lca.findLCA(node1, node2);
    return this.nodeToPath.get(lcaNode) || null;
  }

  getRelativePath(fromPath: string, toPath: string): string | null {
    const commonAncestor = this.findCommonAncestor(fromPath, toPath);
    if (!commonAncestor) return null;

    const fromParts = fromPath
      .substring(commonAncestor.length)
      .split("/")
      .filter((p) => p);
    const toParts = toPath
      .substring(commonAncestor.length)
      .split("/")
      .filter((p) => p);

    const upSteps = "../".repeat(fromParts.length);
    const downSteps = toParts.join("/");

    return upSteps + downSteps;
  }
}
```

### Network Routing

```typescript
class NetworkRouter {
  private lca: BinaryLiftingLCA;
  private nodeWeights: Map<number, number>;
  private edgeWeights: Map<string, number>;

  constructor(network: Array<{ from: number; to: number; weight: number }>) {
    const tree = this.buildTree(network);
    this.lca = new BinaryLiftingLCA(tree);
    this.nodeWeights = new Map();
    this.edgeWeights = new Map();

    network.forEach((edge) => {
      const key = `${Math.min(edge.from, edge.to)}-${Math.max(
        edge.from,
        edge.to
      )}`;
      this.edgeWeights.set(key, edge.weight);
    });
  }

  private buildTree(
    network: Array<{ from: number; to: number; weight: number }>
  ): number[][] {
    const nodes = new Set<number>();
    network.forEach((edge) => {
      nodes.add(edge.from);
      nodes.add(edge.to);
    });

    const tree: number[][] = Array(nodes.size)
      .fill(null)
      .map(() => []);

    network.forEach((edge) => {
      tree[edge.from].push(edge.to);
      tree[edge.to].push(edge.from);
    });

    return tree;
  }

  findShortestPath(
    source: number,
    destination: number
  ): {
    path: number[];
    totalWeight: number;
  } {
    const lcaNode = this.lca.findLCA(source, destination);

    const pathToLCA = this.getPathToAncestor(source, lcaNode);
    const pathFromLCA = this.getPathToAncestor(destination, lcaNode);

    const fullPath = [...pathToLCA.reverse(), ...pathFromLCA.slice(1)];
    const totalWeight = this.calculatePathWeight(fullPath);

    return { path: fullPath, totalWeight };
  }

  private getPathToAncestor(node: number, ancestor: number): number[] {
    const path: number[] = [];
    let current = node;

    while (current !== ancestor) {
      path.push(current);
      current = this.lca.kthAncestor(current, 1);
      if (current === -1) break;
    }

    path.push(ancestor);
    return path;
  }

  private calculatePathWeight(path: number[]): number {
    let totalWeight = 0;

    for (let i = 0; i < path.length - 1; i++) {
      const key = `${Math.min(path[i], path[i + 1])}-${Math.max(
        path[i],
        path[i + 1]
      )}`;
      totalWeight += this.edgeWeights.get(key) || 0;
    }

    return totalWeight;
  }

  findBottleneck(source: number, destination: number): number {
    const { path } = this.findShortestPath(source, destination);
    let maxWeight = 0;

    for (let i = 0; i < path.length - 1; i++) {
      const key = `${Math.min(path[i], path[i + 1])}-${Math.max(
        path[i],
        path[i + 1]
      )}`;
      const weight = this.edgeWeights.get(key) || 0;
      maxWeight = Math.max(maxWeight, weight);
    }

    return maxWeight;
  }
}
```

## Performance Comparison

### Benchmark Different LCA Algorithms

```typescript
class LCABenchmark {
  static compareLCAAlgorithms(
    tree: number[][],
    queries: Array<[number, number]>
  ): void {
    const algorithms = [
      {
        name: "Binary Lifting",
        setup: () => new BinaryLiftingLCA(tree),
        query: (lca: BinaryLiftingLCA, u: number, v: number) =>
          lca.findLCA(u, v),
      },
      {
        name: "Euler Tour + RMQ",
        setup: () => new EulerTourLCA(tree),
        query: (lca: EulerTourLCA, u: number, v: number) => lca.findLCA(u, v),
      },
    ];

    algorithms.forEach((algo) => {
      console.log(`\n${algo.name}:`);

      const setupStart = performance.now();
      const lcaInstance = algo.setup();
      const setupEnd = performance.now();
      console.log(`Setup time: ${(setupEnd - setupStart).toFixed(2)}ms`);

      const queryStart = performance.now();
      queries.forEach(([u, v]) => {
        algo.query(lcaInstance, u, v);
      });
      const queryEnd = performance.now();
      console.log(
        `Query time: ${(queryEnd - queryStart).toFixed(2)}ms for ${
          queries.length
        } queries`
      );
    });
  }

  static generateRandomTree(n: number): number[][] {
    const tree: number[][] = Array(n)
      .fill(null)
      .map(() => []);

    for (let i = 1; i < n; i++) {
      const parent = Math.floor(Math.random() * i);
      tree[parent].push(i);
      tree[i].push(parent);
    }

    return tree;
  }

  static generateRandomQueries(
    n: number,
    numQueries: number
  ): Array<[number, number]> {
    const queries: Array<[number, number]> = [];

    for (let i = 0; i < numQueries; i++) {
      const u = Math.floor(Math.random() * n);
      const v = Math.floor(Math.random() * n);
      queries.push([u, v]);
    }

    return queries;
  }
}
```

## Related Algorithms

- **[Binary Lifting](./binary-lifting.md)**: Core technique for LCA
- **[Range Minimum Query](./range-minimum-query.md)**: Used in Euler tour approach
- **[Union-Find](../graph/union-find.md)**: Used in Tarjan's offline algorithm
- **[Tree Traversal](../tree/tree-traversal.md)**: Foundation for tree algorithms

## LeetCode Problems

1. **[236. Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/)**
2. **[235. Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)**
3. **[1644. Lowest Common Ancestor of a Binary Tree II](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree-ii/)**
4. **[1650. Lowest Common Ancestor of a Binary Tree III](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree-iii/)**
5. **[1676. Lowest Common Ancestor of a Binary Tree IV](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree-iv/)**

## Implementation Challenges

### Challenge 1: LCA with Node Weights

```typescript
class WeightedLCA extends BinaryLiftingLCA {
  private weights: number[];
  private maxWeights: number[][];

  constructor(tree: number[][], weights: number[], root: number = 0) {
    super(tree, root);
    this.weights = weights;
    this.maxWeights = Array(tree.length)
      .fill(null)
      .map(() => Array(20).fill(0));
    this.buildWeightedLifting(tree, root, -1, 0);
  }

  private buildWeightedLifting(
    tree: number[][],
    node: number,
    par: number,
    d: number
  ): void {
    if (par !== -1) {
      this.maxWeights[node][0] = Math.max(
        this.weights[node],
        this.weights[par]
      );
    }

    for (const child of tree[node]) {
      if (child !== par) {
        this.buildWeightedLifting(tree, child, node, d + 1);
      }
    }

    for (let j = 1; j < 20; j++) {
      for (let i = 0; i < tree.length; i++) {
        if (this.parent[i][j - 1] !== -1) {
          const mid = this.parent[i][j - 1];
          this.maxWeights[i][j] = Math.max(
            this.maxWeights[i][j - 1],
            this.maxWeights[mid][j - 1]
          );
        }
      }
    }
  }

  findMaxWeightOnPath(u: number, v: number): number {
    const lca = this.findLCA(u, v);
    return Math.max(
      this.findMaxWeightToAncestor(u, lca),
      this.findMaxWeightToAncestor(v, lca)
    );
  }

  private findMaxWeightToAncestor(node: number, ancestor: number): number {
    let maxWeight = this.weights[node];
    let current = node;

    while (current !== ancestor) {
      const nextParent = this.parent[current][0];
      maxWeight = Math.max(maxWeight, this.weights[nextParent]);
      current = nextParent;
    }

    return maxWeight;
  }
}
```

### Challenge 2: Dynamic LCA

```typescript
class DynamicLCA {
  private parent: Map<number, number>;
  private children: Map<number, Set<number>>;
  private depth: Map<number, number>;
  private lca: BinaryLiftingLCA | null;
  private needsRebuild: boolean;

  constructor() {
    this.parent = new Map();
    this.children = new Map();
    this.depth = new Map();
    this.lca = null;
    this.needsRebuild = true;
  }

  addNode(node: number, parent: number | null = null): void {
    if (!this.children.has(node)) {
      this.children.set(node, new Set());
    }

    if (parent !== null) {
      this.parent.set(node, parent);

      if (!this.children.has(parent)) {
        this.children.set(parent, new Set());
      }
      this.children.get(parent)!.add(node);

      this.depth.set(node, (this.depth.get(parent) || 0) + 1);
    } else {
      this.depth.set(node, 0);
    }

    this.needsRebuild = true;
  }

  removeNode(node: number): void {
    const parent = this.parent.get(node);
    const children = this.children.get(node) || new Set();

    if (parent !== undefined) {
      this.children.get(parent)?.delete(node);

      for (const child of children) {
        this.parent.set(child, parent);
        this.children.get(parent)?.add(child);
      }
    }

    this.parent.delete(node);
    this.children.delete(node);
    this.depth.delete(node);
    this.needsRebuild = true;
  }

  query(u: number, v: number): number {
    this.ensureLCABuilt();
    return this.lca!.findLCA(u, v);
  }

  private ensureLCABuilt(): void {
    if (!this.needsRebuild && this.lca) return;

    const nodeMap = new Map<number, number>();
    const nodes = Array.from(this.children.keys());
    nodes.forEach((node, index) => nodeMap.set(node, index));

    const tree: number[][] = Array(nodes.length)
      .fill(null)
      .map(() => []);

    for (const [node, children] of this.children) {
      const nodeIndex = nodeMap.get(node)!;
      for (const child of children) {
        const childIndex = nodeMap.get(child)!;
        tree[nodeIndex].push(childIndex);
        tree[childIndex].push(nodeIndex);
      }
    }

    this.lca = new BinaryLiftingLCA(tree);
    this.needsRebuild = false;
  }
}
```

The Lowest Common Ancestor problem is fundamental in tree algorithms and has wide-ranging applications from computational biology to version control systems. The choice of algorithm depends on the specific requirements: offline vs online queries, preprocessing time constraints, and memory limitations.
