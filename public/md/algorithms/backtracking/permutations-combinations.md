# Permutations and Combinations

**Permutations and Combinations** are fundamental combinatorial algorithms that generate all possible arrangements and selections from a given set. These algorithms form the backbone of many backtracking, dynamic programming, and optimization problems, with applications ranging from password generation to machine learning.

Efficient generation of permutations and combinations requires careful consideration of **order**, **repetition**, and **memory usage** to handle large datasets and avoid redundant computations.

## Key Concepts

- **Permutation**: Arrangement where order matters (ABC ≠ BAC)
- **Combination**: Selection where order doesn't matter ({A,B,C} = {C,A,B})
- **With/Without Repetition**: Whether elements can be reused
- **Lexicographic Order**: Dictionary-like ordering for systematic generation
- **In-place Generation**: Memory-efficient algorithms that modify input array

## Time and Space Complexity

| Operation                    | Count         | Generation Time  | Space |
| ---------------------------- | ------------- | ---------------- | ----- |
| Permutations (n!)            | n!            | O(n! × n)        | O(n)  |
| Combinations (nCr)           | n!/(r!(n-r)!) | O(nCr × r)       | O(r)  |
| Permutations with Repetition | n^r           | O(n^r × r)       | O(r)  |
| Combinations with Repetition | (n+r-1)Cr     | O((n+r-1)Cr × r) | O(r)  |

## Implementation

### Permutation Algorithms

#### 1. Basic Recursive Permutations

```typescript
class PermutationGenerator {
  generatePermutations<T>(arr: T[]): T[][] {
    const result: T[][] = [];

    const backtrack = (current: T[], used: boolean[]): void => {
      if (current.length === arr.length) {
        result.push([...current]);
        return;
      }

      for (let i = 0; i < arr.length; i++) {
        if (!used[i]) {
          current.push(arr[i]);
          used[i] = true;

          backtrack(current, used);

          current.pop();
          used[i] = false;
        }
      }
    };

    backtrack([], new Array(arr.length).fill(false));
    return result;
  }

  generatePermutationsIterative<T>(arr: T[]): T[][] {
    const result: T[][] = [[]];

    for (const element of arr) {
      const newPermutations: T[][] = [];

      for (const perm of result) {
        for (let i = 0; i <= perm.length; i++) {
          newPermutations.push([
            ...perm.slice(0, i),
            element,
            ...perm.slice(i),
          ]);
        }
      }

      result.length = 0;
      result.push(...newPermutations);
    }

    return result;
  }

  *generatePermutationsLazy<T>(arr: T[]): Generator<T[]> {
    const n = arr.length;
    const indices = Array.from({ length: n }, (_, i) => i);

    yield arr.map((item) => item);

    while (true) {
      let k = -1;
      for (let i = n - 2; i >= 0; i--) {
        if (indices[i] < indices[i + 1]) {
          k = i;
          break;
        }
      }

      if (k === -1) break;

      let l = -1;
      for (let i = n - 1; i > k; i--) {
        if (indices[k] < indices[i]) {
          l = i;
          break;
        }
      }

      [indices[k], indices[l]] = [indices[l], indices[k]];

      for (let i = k + 1, j = n - 1; i < j; i++, j--) {
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      yield indices.map((i) => arr[i]);
    }
  }
}
```

#### 2. Heap's Algorithm (In-place Permutation Generation)

```typescript
class HeapPermutationGenerator {
  *generatePermutations<T>(arr: T[]): Generator<T[]> {
    const n = arr.length;
    const c = new Array(n).fill(0);

    yield [...arr];

    let i = 0;
    while (i < n) {
      if (c[i] < i) {
        if (i % 2 === 0) {
          [arr[0], arr[i]] = [arr[i], arr[0]];
        } else {
          [arr[c[i]], arr[i]] = [arr[i], arr[c[i]]];
        }

        yield [...arr];

        c[i]++;
        i = 0;
      } else {
        c[i] = 0;
        i++;
      }
    }
  }

  countPermutations(n: number): number {
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  generateKthPermutation<T>(arr: T[], k: number): T[] {
    const n = arr.length;
    const factorials = this.computeFactorials(n);
    const result: T[] = [];
    const available = [...arr];

    let index = k - 1;

    for (let i = n; i > 0; i--) {
      const factorial = factorials[i - 1];
      const position = Math.floor(index / factorial);

      result.push(available[position]);
      available.splice(position, 1);

      index %= factorial;
    }

    return result;
  }

  private computeFactorials(n: number): number[] {
    const factorials = [1];
    for (let i = 1; i < n; i++) {
      factorials[i] = factorials[i - 1] * i;
    }
    return factorials;
  }
}
```

### Combination Algorithms

#### 1. Basic Recursive Combinations

```typescript
class CombinationGenerator {
  generateCombinations<T>(arr: T[], r: number): T[][] {
    const result: T[][] = [];

    const backtrack = (start: number, current: T[]): void => {
      if (current.length === r) {
        result.push([...current]);
        return;
      }

      for (let i = start; i < arr.length; i++) {
        current.push(arr[i]);
        backtrack(i + 1, current);
        current.pop();
      }
    };

    backtrack(0, []);
    return result;
  }

  generateCombinationsIterative<T>(arr: T[], r: number): T[][] {
    const result: T[][] = [];
    const indices = Array.from({ length: r }, (_, i) => i);
    const n = arr.length;

    while (true) {
      result.push(indices.map((i) => arr[i]));

      let i = r - 1;
      while (i >= 0 && indices[i] === n - r + i) {
        i--;
      }

      if (i < 0) break;

      indices[i]++;
      for (let j = i + 1; j < r; j++) {
        indices[j] = indices[j - 1] + 1;
      }
    }

    return result;
  }

  *generateCombinationsLazy<T>(arr: T[], r: number): Generator<T[]> {
    const n = arr.length;
    const indices = Array.from({ length: r }, (_, i) => i);

    yield indices.map((i) => arr[i]);

    while (true) {
      let i = r - 1;
      while (i >= 0 && indices[i] === n - r + i) {
        i--;
      }

      if (i < 0) break;

      indices[i]++;
      for (let j = i + 1; j < r; j++) {
        indices[j] = indices[j - 1] + 1;
      }

      yield indices.map((i) => arr[i]);
    }
  }

  countCombinations(n: number, r: number): number {
    if (r > n || r < 0) return 0;
    if (r === 0 || r === n) return 1;

    r = Math.min(r, n - r);

    let result = 1;
    for (let i = 0; i < r; i++) {
      result = (result * (n - i)) / (i + 1);
    }

    return Math.round(result);
  }
}
```

### Advanced Variants

#### 1. Permutations with Repetition

```typescript
class RepetitionPermutationGenerator {
  generatePermutationsWithRepetition<T>(arr: T[], r: number): T[][] {
    const result: T[][] = [];

    const backtrack = (current: T[]): void => {
      if (current.length === r) {
        result.push([...current]);
        return;
      }

      for (const element of arr) {
        current.push(element);
        backtrack(current);
        current.pop();
      }
    };

    backtrack([]);
    return result;
  }

  generateUniquePermutations<T>(arr: T[]): T[][] {
    const result: T[][] = [];
    const sortedArr = [...arr].sort();
    const used = new Array(arr.length).fill(false);

    const backtrack = (current: T[]): void => {
      if (current.length === arr.length) {
        result.push([...current]);
        return;
      }

      for (let i = 0; i < sortedArr.length; i++) {
        if (used[i]) continue;

        if (i > 0 && sortedArr[i] === sortedArr[i - 1] && !used[i - 1]) {
          continue;
        }

        current.push(sortedArr[i]);
        used[i] = true;

        backtrack(current);

        current.pop();
        used[i] = false;
      }
    };

    backtrack([]);
    return result;
  }

  *generateMultisetPermutations<T>(arr: T[]): Generator<T[]> {
    const multiset = new Map<T, number>();
    for (const item of arr) {
      multiset.set(item, (multiset.get(item) || 0) + 1);
    }

    const elements = Array.from(multiset.keys());
    const counts = Array.from(multiset.values());
    const current: T[] = [];

    yield* this.generateMultisetPermutationsHelper(
      elements,
      counts,
      current,
      arr.length
    );
  }

  private *generateMultisetPermutationsHelper<T>(
    elements: T[],
    counts: number[],
    current: T[],
    totalLength: number
  ): Generator<T[]> {
    if (current.length === totalLength) {
      yield [...current];
      return;
    }

    for (let i = 0; i < elements.length; i++) {
      if (counts[i] > 0) {
        current.push(elements[i]);
        counts[i]--;

        yield* this.generateMultisetPermutationsHelper(
          elements,
          counts,
          current,
          totalLength
        );

        current.pop();
        counts[i]++;
      }
    }
  }
}
```

#### 2. Combinations with Repetition

```typescript
class RepetitionCombinationGenerator {
  generateCombinationsWithRepetition<T>(arr: T[], r: number): T[][] {
    const result: T[][] = [];

    const backtrack = (start: number, current: T[]): void => {
      if (current.length === r) {
        result.push([...current]);
        return;
      }

      for (let i = start; i < arr.length; i++) {
        current.push(arr[i]);
        backtrack(i, current);
        current.pop();
      }
    };

    backtrack(0, []);
    return result;
  }

  generatePowerSet<T>(arr: T[]): T[][] {
    const result: T[][] = [];

    const backtrack = (index: number, current: T[]): void => {
      if (index === arr.length) {
        result.push([...current]);
        return;
      }

      backtrack(index + 1, current);

      current.push(arr[index]);
      backtrack(index + 1, current);
      current.pop();
    };

    backtrack(0, []);
    return result;
  }

  generatePowerSetIterative<T>(arr: T[]): T[][] {
    const result: T[][] = [[]];

    for (const element of arr) {
      const newSubsets = result.map((subset) => [...subset, element]);
      result.push(...newSubsets);
    }

    return result;
  }

  generatePowerSetBitwise<T>(arr: T[]): T[][] {
    const result: T[][] = [];
    const n = arr.length;
    const totalSubsets = 1 << n;

    for (let mask = 0; mask < totalSubsets; mask++) {
      const subset: T[] = [];

      for (let i = 0; i < n; i++) {
        if (mask & (1 << i)) {
          subset.push(arr[i]);
        }
      }

      result.push(subset);
    }

    return result;
  }
}
```

## Advanced Applications

### 1. Password and Key Generation

```typescript
class PasswordGenerator {
  private readonly lowercase = "abcdefghijklmnopqrstuvwxyz";
  private readonly uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private readonly digits = "0123456789";
  private readonly special = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  generateAllPasswords(length: number, charset: string): string[] {
    const generator = new RepetitionPermutationGenerator();
    const chars = charset.split("");

    return generator
      .generatePermutationsWithRepetition(chars, length)
      .map((perm) => perm.join(""));
  }

  generateSecurePasswords(
    count: number,
    minLength: number,
    maxLength: number,
    requirements: {
      requireLowercase?: boolean;
      requireUppercase?: boolean;
      requireDigits?: boolean;
      requireSpecial?: boolean;
    } = {}
  ): string[] {
    const passwords: string[] = [];

    while (passwords.length < count) {
      const length =
        minLength + Math.floor(Math.random() * (maxLength - minLength + 1));
      const password = this.generateSinglePassword(length, requirements);

      if (!passwords.includes(password)) {
        passwords.push(password);
      }
    }

    return passwords;
  }

  private generateSinglePassword(
    length: number,
    requirements: {
      requireLowercase?: boolean;
      requireUppercase?: boolean;
      requireDigits?: boolean;
      requireSpecial?: boolean;
    }
  ): string {
    let charset = "";
    const requiredChars: string[] = [];

    if (requirements.requireLowercase) {
      charset += this.lowercase;
      requiredChars.push(this.getRandomChar(this.lowercase));
    }

    if (requirements.requireUppercase) {
      charset += this.uppercase;
      requiredChars.push(this.getRandomChar(this.uppercase));
    }

    if (requirements.requireDigits) {
      charset += this.digits;
      requiredChars.push(this.getRandomChar(this.digits));
    }

    if (requirements.requireSpecial) {
      charset += this.special;
      requiredChars.push(this.getRandomChar(this.special));
    }

    if (charset === "") {
      charset = this.lowercase + this.uppercase + this.digits;
    }

    const remainingLength = length - requiredChars.length;
    const randomChars = Array.from({ length: remainingLength }, () =>
      this.getRandomChar(charset)
    );

    const allChars = [...requiredChars, ...randomChars];
    return this.shuffleArray(allChars).join("");
  }

  private getRandomChar(charset: string): string {
    return charset[Math.floor(Math.random() * charset.length)];
  }

  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
```

### 2. Test Case Generation

```typescript
class TestCaseGenerator {
  generateTestCases<T>(
    parameters: Array<{ name: string; values: T[] }>,
    maxCases?: number
  ): Array<{ [key: string]: T }> {
    const paramNames = parameters.map((p) => p.name);
    const paramValues = parameters.map((p) => p.values);

    const combinations = this.cartesianProduct(paramValues);

    if (maxCases && combinations.length > maxCases) {
      return this.sampleCombinations(combinations, maxCases).map((combo) =>
        this.createTestCase(paramNames, combo)
      );
    }

    return combinations.map((combo) => this.createTestCase(paramNames, combo));
  }

  generatePairwiseTestCases<T>(
    parameters: Array<{ name: string; values: T[] }>
  ): Array<{ [key: string]: T }> {
    const pairs = this.generateAllPairs(parameters);
    const testCases: Array<{ [key: string]: T }> = [];

    while (pairs.length > 0) {
      const testCase = this.findBestTestCase(parameters, pairs);
      testCases.push(testCase);
      this.removeCoveredPairs(pairs, testCase, parameters);
    }

    return testCases;
  }

  private cartesianProduct<T>(arrays: T[][]): T[][] {
    return arrays.reduce<T[][]>(
      (acc, curr) =>
        acc.flatMap((combo) => curr.map((value) => [...combo, value])),
      [[]]
    );
  }

  private sampleCombinations<T>(combinations: T[][], maxCases: number): T[][] {
    const sampled: T[][] = [];
    const step = Math.floor(combinations.length / maxCases);

    for (
      let i = 0;
      i < combinations.length && sampled.length < maxCases;
      i += step
    ) {
      sampled.push(combinations[i]);
    }

    while (sampled.length < maxCases && sampled.length < combinations.length) {
      const randomIndex = Math.floor(Math.random() * combinations.length);
      if (!sampled.includes(combinations[randomIndex])) {
        sampled.push(combinations[randomIndex]);
      }
    }

    return sampled;
  }

  private createTestCase<T>(
    paramNames: string[],
    values: T[]
  ): { [key: string]: T } {
    const testCase: { [key: string]: T } = {};
    paramNames.forEach((name, index) => {
      testCase[name] = values[index];
    });
    return testCase;
  }

  private generateAllPairs<T>(
    parameters: Array<{ name: string; values: T[] }>
  ): Array<{ param1: number; value1: T; param2: number; value2: T }> {
    const pairs: Array<{
      param1: number;
      value1: T;
      param2: number;
      value2: T;
    }> = [];

    for (let i = 0; i < parameters.length; i++) {
      for (let j = i + 1; j < parameters.length; j++) {
        for (const value1 of parameters[i].values) {
          for (const value2 of parameters[j].values) {
            pairs.push({ param1: i, value1, param2: j, value2 });
          }
        }
      }
    }

    return pairs;
  }

  private findBestTestCase<T>(
    parameters: Array<{ name: string; values: T[] }>,
    remainingPairs: Array<{
      param1: number;
      value1: T;
      param2: number;
      value2: T;
    }>
  ): { [key: string]: T } {
    let bestTestCase: { [key: string]: T } = {};
    let maxCoveredPairs = 0;

    const combinations = this.cartesianProduct(parameters.map((p) => p.values));

    for (const combo of combinations) {
      const testCase = this.createTestCase(
        parameters.map((p) => p.name),
        combo
      );
      const coveredCount = this.countCoveredPairs(
        remainingPairs,
        testCase,
        parameters
      );

      if (coveredCount > maxCoveredPairs) {
        maxCoveredPairs = coveredCount;
        bestTestCase = testCase;
      }
    }

    return bestTestCase;
  }

  private countCoveredPairs<T>(
    pairs: Array<{ param1: number; value1: T; param2: number; value2: T }>,
    testCase: { [key: string]: T },
    parameters: Array<{ name: string; values: T[] }>
  ): number {
    return pairs.filter((pair) => {
      const param1Name = parameters[pair.param1].name;
      const param2Name = parameters[pair.param2].name;

      return (
        testCase[param1Name] === pair.value1 &&
        testCase[param2Name] === pair.value2
      );
    }).length;
  }

  private removeCoveredPairs<T>(
    pairs: Array<{ param1: number; value1: T; param2: number; value2: T }>,
    testCase: { [key: string]: T },
    parameters: Array<{ name: string; values: T[] }>
  ): void {
    for (let i = pairs.length - 1; i >= 0; i--) {
      const pair = pairs[i];
      const param1Name = parameters[pair.param1].name;
      const param2Name = parameters[pair.param2].name;

      if (
        testCase[param1Name] === pair.value1 &&
        testCase[param2Name] === pair.value2
      ) {
        pairs.splice(i, 1);
      }
    }
  }
}
```

### 3. Subset Sum and Optimization Problems

```typescript
class SubsetOptimizer {
  findOptimalSubset<T>(
    items: Array<{ value: T; weight: number; cost: number }>,
    maxWeight: number,
    targetCost: number
  ): Array<{ value: T; weight: number; cost: number }> {
    const generator = new RepetitionCombinationGenerator();
    const powerSet = generator.generatePowerSet(items);

    let bestSubset: Array<{ value: T; weight: number; cost: number }> = [];
    let bestScore = -Infinity;

    for (const subset of powerSet) {
      const totalWeight = subset.reduce((sum, item) => sum + item.weight, 0);
      const totalCost = subset.reduce((sum, item) => sum + item.cost, 0);

      if (totalWeight <= maxWeight) {
        const score = this.calculateScore(subset, totalCost, targetCost);
        if (score > bestScore) {
          bestScore = score;
          bestSubset = subset;
        }
      }
    }

    return bestSubset;
  }

  private calculateScore<T>(
    subset: Array<{ value: T; weight: number; cost: number }>,
    totalCost: number,
    targetCost: number
  ): number {
    const costDifference = Math.abs(totalCost - targetCost);
    const efficiency = subset.length > 0 ? totalCost / subset.length : 0;

    return efficiency - costDifference * 0.1;
  }

  generateOptimizationSolutions<T>(
    items: T[],
    evaluationFunction: (subset: T[]) => number,
    constraints: Array<(subset: T[]) => boolean> = []
  ): Array<{ subset: T[]; score: number }> {
    const generator = new RepetitionCombinationGenerator();
    const powerSet = generator.generatePowerSet(items);

    const validSolutions: Array<{ subset: T[]; score: number }> = [];

    for (const subset of powerSet) {
      const isValid = constraints.every((constraint) => constraint(subset));

      if (isValid) {
        const score = evaluationFunction(subset);
        validSolutions.push({ subset, score });
      }
    }

    return validSolutions.sort((a, b) => b.score - a.score);
  }
}
```

## Performance Optimization Techniques

### 1. Iterative vs Recursive Performance

```typescript
class PerformanceComparison {
  comparePermutationMethods<T>(arr: T[]): {
    recursive: { time: number; memory: number };
    iterative: { time: number; memory: number };
    lazy: { time: number; memory: number };
  } {
    const results = {
      recursive: { time: 0, memory: 0 },
      iterative: { time: 0, memory: 0 },
      lazy: { time: 0, memory: 0 },
    };

    const generator = new PermutationGenerator();

    const startMemory = process.memoryUsage().heapUsed;

    const recursiveStart = Date.now();
    const recursiveResult = generator.generatePermutations(arr);
    results.recursive.time = Date.now() - recursiveStart;
    results.recursive.memory = process.memoryUsage().heapUsed - startMemory;

    const iterativeStart = Date.now();
    const iterativeResult = generator.generatePermutationsIterative(arr);
    results.iterative.time = Date.now() - iterativeStart;
    results.iterative.memory = process.memoryUsage().heapUsed - startMemory;

    const lazyStart = Date.now();
    let count = 0;
    for (const perm of generator.generatePermutationsLazy(arr)) {
      count++;
      if (count >= 1000) break;
    }
    results.lazy.time = Date.now() - lazyStart;
    results.lazy.memory = process.memoryUsage().heapUsed - startMemory;

    return results;
  }

  benchmarkLargeDataset(size: number): void {
    const data = Array.from({ length: size }, (_, i) => i);
    const startTime = Date.now();

    let count = 0;
    const generator = new PermutationGenerator();

    for (const perm of generator.generatePermutationsLazy(data)) {
      count++;
      if (count % 1000000 === 0) {
        console.log(
          `Generated ${count} permutations in ${Date.now() - startTime}ms`
        );
      }
      if (count >= 10000000) break;
    }
  }
}
```

## Real-World Applications

### 1. Scheduling and Resource Allocation

```typescript
class TaskScheduler {
  generateSchedules(
    tasks: Array<{ id: string; duration: number; priority: number }>,
    maxDuration: number
  ): Array<{
    schedule: typeof tasks;
    totalDuration: number;
    avgPriority: number;
  }> {
    const generator = new PermutationGenerator();
    const permutations = generator.generatePermutations(tasks);

    const validSchedules: Array<{
      schedule: typeof tasks;
      totalDuration: number;
      avgPriority: number;
    }> = [];

    for (const schedule of permutations) {
      const totalDuration = schedule.reduce(
        (sum, task) => sum + task.duration,
        0
      );

      if (totalDuration <= maxDuration) {
        const avgPriority =
          schedule.reduce((sum, task) => sum + task.priority, 0) /
          schedule.length;
        validSchedules.push({ schedule, totalDuration, avgPriority });
      }
    }

    return validSchedules.sort((a, b) => b.avgPriority - a.avgPriority);
  }

  optimizeResourceAllocation(
    resources: Array<{ id: string; capacity: number; cost: number }>,
    requirements: Array<{ task: string; requiredCapacity: number }>
  ): Array<{ allocation: Map<string, string>; totalCost: number }> {
    const generator = new CombinationGenerator();
    const allocations: Array<{
      allocation: Map<string, string>;
      totalCost: number;
    }> = [];

    const resourceCombinations = generator.generateCombinations(
      resources,
      requirements.length
    );

    for (const resourceSet of resourceCombinations) {
      const permutations = generator.generatePermutations(resourceSet);

      for (const resourceOrder of permutations) {
        const allocation = new Map<string, string>();
        let totalCost = 0;
        let isValid = true;

        for (let i = 0; i < requirements.length; i++) {
          const requirement = requirements[i];
          const resource = resourceOrder[i];

          if (resource.capacity >= requirement.requiredCapacity) {
            allocation.set(requirement.task, resource.id);
            totalCost += resource.cost;
          } else {
            isValid = false;
            break;
          }
        }

        if (isValid) {
          allocations.push({ allocation, totalCost });
        }
      }
    }

    return allocations.sort((a, b) => a.totalCost - b.totalCost);
  }
}
```

## Mathematical Properties and Insights

### 1. Counting and Probability

```typescript
class CombinatorialMath {
  factorial(n: number): number {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  permutation(n: number, r: number): number {
    if (r > n) return 0;
    return this.factorial(n) / this.factorial(n - r);
  }

  combination(n: number, r: number): number {
    if (r > n) return 0;
    return this.factorial(n) / (this.factorial(r) * this.factorial(n - r));
  }

  stirlingSecondKind(n: number, k: number): number {
    if (n === 0 && k === 0) return 1;
    if (n === 0 || k === 0) return 0;
    if (k > n) return 0;

    const dp = Array(n + 1)
      .fill(null)
      .map(() => Array(k + 1).fill(0));

    dp[0][0] = 1;

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= Math.min(i, k); j++) {
        dp[i][j] = j * dp[i - 1][j] + dp[i - 1][j - 1];
      }
    }

    return dp[n][k];
  }

  bellNumber(n: number): number {
    let sum = 0;
    for (let k = 0; k <= n; k++) {
      sum += this.stirlingSecondKind(n, k);
    }
    return sum;
  }

  catalanNumber(n: number): number {
    if (n <= 1) return 1;

    const dp = new Array(n + 1).fill(0);
    dp[0] = dp[1] = 1;

    for (let i = 2; i <= n; i++) {
      for (let j = 0; j < i; j++) {
        dp[i] += dp[j] * dp[i - 1 - j];
      }
    }

    return dp[n];
  }
}
```

## Practice Problems

### LeetCode Problems

1. **[46. Permutations](https://leetcode.com/problems/permutations/)** - Basic permutation generation
2. **[47. Permutations II](https://leetcode.com/problems/permutations-ii/)** - Permutations with duplicates
3. **[77. Combinations](https://leetcode.com/problems/combinations/)** - Basic combination generation
4. **[78. Subsets](https://leetcode.com/problems/subsets/)** - Power set generation
5. **[90. Subsets II](https://leetcode.com/problems/subsets-ii/)** - Subsets with duplicates
6. **[39. Combination Sum](https://leetcode.com/problems/combination-sum/)** - Combinations with repetition
7. **[40. Combination Sum II](https://leetcode.com/problems/combination-sum-ii/)** - Combinations with constraints

### Advanced Challenges

1. **Permutation Rank**: Find rank of permutation in lexicographic order
2. **Derangements**: Permutations where no element appears in original position
3. **Circular Permutations**: Arrangements in a circle
4. **Restricted Permutations**: Permutations with forbidden patterns

## Key Insights for Interviews

1. **Space vs Time Tradeoff**: Generator pattern for memory efficiency
2. **Early Termination**: Stop when solution found in optimization problems
3. **Duplicate Handling**: Sort and skip duplicates systematically
4. **Mathematical Properties**: Use formulas when counting, not generating
5. **Real-World Applications**: Connect to scheduling, testing, optimization

## Related Algorithms

- **[Backtracking](./subset-sum.md)** - Uses permutations and combinations
- **[Dynamic Programming](../dynamic-programming/)** - Often optimizes combinatorial problems
- **[Graph Algorithms](../graph/)** - Hamiltonian paths use permutations
- **[Greedy Algorithms](../greedy/)** - Approximate solutions to combinatorial optimization

Permutations and combinations form the mathematical foundation for countless algorithmic problems, from simple enumeration to complex optimization challenges in computer science and beyond.
