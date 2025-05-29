export const sampleQuickReferenceData = [
  {
    id: "big-o-complexities",
    title: "Big O Complexities",
    category: "Big O",
    description: "Complete complexity hierarchy and common examples",
    content: {
      syntax:
        "O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ) < O(n!)",
      example:
        "// O(1) Constant\narray[index], map.get(key)\n\n// O(log n) Logarithmic\nbinarySearch, balanced tree ops\n\n// O(n) Linear\nlinear search, array traversal\n\n// O(n log n) Linearithmic\nmergeSort, quickSort average\n\n// O(n²) Quadratic\nnested loops, bubble sort\n\n// O(2ⁿ) Exponential\nrecursive fibonacci, subset generation",
      complexity: "Reference only",
      usage: [
        "Algorithm analysis",
        "Performance comparison",
        "Optimization decisions",
        "Interview preparation",
      ],
      notes: [
        "Describes worst-case unless specified",
        "Drop constants and lower-order terms",
        "Focus on scalability as n grows",
        "Base of logarithm doesn't matter for Big O",
      ],
    },
    tags: ["complexity", "analysis", "performance", "algorithms"],
    difficulty: "beginner" as const,
  },
  {
    id: "binary-search-implementation",
    title: "Binary Search",
    category: "Algorithms",
    description: "Efficient search in sorted arrays",
    content: {
      syntax:
        "function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = left + Math.floor((right - left) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}",
      example:
        "binarySearch([1, 3, 5, 7, 9, 11], 7) // Returns: 3\nbinarySearch([1, 3, 5, 7, 9, 11], 4) // Returns: -1",
      complexity: "O(log n) time, O(1) space",
      usage: [
        "Searching in sorted arrays",
        "Finding insertion points",
        "Range queries",
        "Peak finding problems",
      ],
      notes: [
        "Array must be sorted",
        "Use safe mid calculation to avoid overflow",
        "Can be implemented recursively or iteratively",
        "Template for many divide-and-conquer problems",
      ],
    },
    tags: ["search", "algorithm", "sorted", "divide-conquer"],
    difficulty: "intermediate" as const,
    language: "JavaScript",
  },
  {
    id: "quicksort-algorithm",
    title: "Quick Sort",
    category: "Algorithms",
    description: "Efficient divide-and-conquer sorting algorithm",
    content: {
      syntax:
        "function quickSort(arr, low = 0, high = arr.length - 1) {\n  if (low < high) {\n    const pi = partition(arr, low, high);\n    quickSort(arr, low, pi - 1);\n    quickSort(arr, pi + 1, high);\n  }\n  return arr;\n}\n\nfunction partition(arr, low, high) {\n  const pivot = arr[high];\n  let i = low - 1;\n  for (let j = low; j < high; j++) {\n    if (arr[j] <= pivot) {\n      i++;\n      [arr[i], arr[j]] = [arr[j], arr[i]];\n    }\n  }\n  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];\n  return i + 1;\n}",
      example:
        "quickSort([64, 34, 25, 12, 22, 11, 90])\n// Returns: [11, 12, 22, 25, 34, 64, 90]",
      complexity: "O(n log n) avg, O(n²) worst, O(log n) space",
      usage: [
        "General purpose sorting",
        "When average case performance matters",
        "In-place sorting needed",
        "Cache-efficient sorting",
      ],
      notes: [
        "Not stable by default",
        "Performance depends on pivot selection",
        "Randomized pivot helps avoid worst case",
        "Faster than merge sort in practice",
      ],
    },
    tags: ["sorting", "divide-conquer", "recursive", "in-place"],
    difficulty: "intermediate" as const,
    language: "JavaScript",
  },
  {
    id: "merge-sort-algorithm",
    title: "Merge Sort",
    category: "Algorithms",
    description: "Stable divide-and-conquer sorting algorithm",
    content: {
      syntax:
        "function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  return merge(left, right);\n}\n\nfunction merge(left, right) {\n  const result = [];\n  let i = 0, j = 0;\n  while (i < left.length && j < right.length) {\n    if (left[i] <= right[j]) result.push(left[i++]);\n    else result.push(right[j++]);\n  }\n  return result.concat(left.slice(i), right.slice(j));\n}",
      example:
        "mergeSort([64, 34, 25, 12, 22, 11, 90])\n// Returns: [11, 12, 22, 25, 34, 64, 90]",
      complexity: "O(n log n) time, O(n) space",
      usage: [
        "When stability is required",
        "External sorting (large datasets)",
        "Predictable performance needed",
        "Linked list sorting",
      ],
      notes: [
        "Stable sorting algorithm",
        "Consistent O(n log n) performance",
        "Requires additional space",
        "Good for large datasets",
      ],
    },
    tags: ["sorting", "stable", "divide-conquer", "consistent"],
    difficulty: "intermediate" as const,
    language: "JavaScript",
  },
  {
    id: "hash-map-basics",
    title: "Hash Map/Table",
    category: "Data Structures",
    description: "Key-value data structure with O(1) average operations",
    content: {
      syntax:
        "// JavaScript Map\nconst map = new Map();\nmap.set(key, value);\nconst value = map.get(key);\nmap.has(key);\nmap.delete(key);\nmap.clear();\n\n// JavaScript Object\nconst obj = {};\nobj[key] = value;\nconst value = obj[key];\ndelete obj[key];",
      example:
        "const userAges = new Map();\nuserAges.set('Alice', 25);\nuserAges.set('Bob', 30);\nconsole.log(userAges.get('Alice')); // 25\nconsole.log(userAges.has('Charlie')); // false",
      complexity: "O(1) avg, O(n) worst for all operations",
      usage: [
        "Caching and memoization",
        "Counting frequencies",
        "Database indexing",
        "Fast lookups",
      ],
      notes: [
        "Collision handling affects performance",
        "Load factor should be managed",
        "Not ordered by default (use Map for insertion order)",
        "Hash function quality is crucial",
      ],
    },
    tags: ["data-structure", "key-value", "hash", "lookup"],
    difficulty: "beginner" as const,
    language: "JavaScript",
  },
  {
    id: "binary-tree-traversals",
    title: "Binary Tree Traversals",
    category: "Data Structures",
    description: "DFS and BFS traversal patterns for binary trees",
    content: {
      syntax:
        "// Pre-order (Root -> Left -> Right)\nfunction preOrder(root) {\n  if (!root) return [];\n  return [root.val, ...preOrder(root.left), ...preOrder(root.right)];\n}\n\n// In-order (Left -> Root -> Right)\nfunction inOrder(root) {\n  if (!root) return [];\n  return [...inOrder(root.left), root.val, ...inOrder(root.right)];\n}\n\n// Post-order (Left -> Right -> Root)\nfunction postOrder(root) {\n  if (!root) return [];\n  return [...postOrder(root.left), ...postOrder(root.right), root.val];\n}\n\n// Level-order (BFS)\nfunction levelOrder(root) {\n  if (!root) return [];\n  const queue = [root], result = [];\n  while (queue.length) {\n    const node = queue.shift();\n    result.push(node.val);\n    if (node.left) queue.push(node.left);\n    if (node.right) queue.push(node.right);\n  }\n  return result;\n}",
      example:
        "//     1\n//    / \\\n//   2   3\n//  / \\\n// 4   5\n\n// Pre-order: [1, 2, 4, 5, 3]\n// In-order: [4, 2, 5, 1, 3]\n// Post-order: [4, 5, 2, 3, 1]\n// Level-order: [1, 2, 3, 4, 5]",
      complexity: "O(n) time, O(h) space (h = height)",
      usage: [
        "Tree processing",
        "Expression evaluation",
        "File system traversal",
        "Serialization/deserialization",
      ],
      notes: [
        "In-order gives sorted sequence for BST",
        "Pre-order useful for tree copying",
        "Post-order for tree deletion",
        "Level-order for printing by levels",
      ],
    },
    tags: ["tree", "traversal", "dfs", "bfs", "recursion"],
    difficulty: "intermediate" as const,
    language: "JavaScript",
  },
  {
    id: "dynamic-programming-patterns",
    title: "Dynamic Programming",
    category: "Patterns",
    description: "Optimization technique using memoization and tabulation",
    content: {
      syntax:
        "// Memoization (Top-down)\nfunction fibMemo(n, memo = {}) {\n  if (n in memo) return memo[n];\n  if (n <= 2) return 1;\n  memo[n] = fibMemo(n-1, memo) + fibMemo(n-2, memo);\n  return memo[n];\n}\n\n// Tabulation (Bottom-up)\nfunction fibTab(n) {\n  if (n <= 2) return 1;\n  const dp = [0, 1, 1];\n  for (let i = 3; i <= n; i++) {\n    dp[i] = dp[i-1] + dp[i-2];\n  }\n  return dp[n];\n}\n\n// Space-optimized\nfunction fibOptimal(n) {\n  if (n <= 2) return 1;\n  let prev2 = 1, prev1 = 1;\n  for (let i = 3; i <= n; i++) {\n    const curr = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = curr;\n  }\n  return prev1;\n}",
      example:
        "// Fibonacci: 1, 1, 2, 3, 5, 8, 13, 21...\nfibMemo(10);    // 55\nfibTab(10);     // 55\nfibOptimal(10); // 55\n\n// Other DP problems:\n// - Coin Change\n// - Longest Common Subsequence\n// - 0/1 Knapsack\n// - Edit Distance",
      complexity: "O(n) time, O(n) or O(1) space",
      usage: [
        "Optimization problems",
        "Avoiding repeated calculations",
        "Finding optimal substructure",
        "Count number of ways problems",
      ],
      notes: [
        "Requires overlapping subproblems",
        "Optimal substructure property needed",
        "Can use top-down or bottom-up approach",
        "Space optimization often possible",
      ],
    },
    tags: ["optimization", "memoization", "recursion", "tabulation"],
    difficulty: "advanced" as const,
    language: "JavaScript",
  },
  {
    id: "javascript-array-methods",
    title: "JavaScript Array Methods",
    category: "JavaScript",
    description: "Essential array manipulation and functional methods",
    content: {
      syntax:
        "// Transform\narr.map(fn)           // Transform each element\narr.flatMap(fn)       // Map + flatten\n\n// Filter\narr.filter(fn)        // Keep elements that pass test\narr.find(fn)          // First element that passes test\narr.findIndex(fn)     // Index of first match\n\n// Test\narr.some(fn)          // True if any element passes test\narr.every(fn)         // True if all elements pass test\narr.includes(value)   // True if array contains value\n\n// Aggregate\narr.reduce(fn, init)  // Reduce to single value\narr.reduceRight(fn)   // Reduce from right to left\n\n// Modify\narr.sort(compareFn)   // Sort in place\narr.reverse()         // Reverse in place\narr.splice(start, deleteCount, ...items)",
      example:
        "const nums = [1, 2, 3, 4, 5];\n\n// Transform\nnums.map(x => x * 2);              // [2, 4, 6, 8, 10]\n[1, [2, 3], 4].flatMap(x => x);    // [1, 2, 3, 4]\n\n// Filter\nnums.filter(x => x > 3);           // [4, 5]\nnums.find(x => x > 3);             // 4\n\n// Test\nnums.some(x => x > 3);             // true\nnums.every(x => x > 0);            // true\n\n// Aggregate\nnums.reduce((sum, x) => sum + x);  // 15",
      complexity: "O(n) for most methods",
      usage: [
        "Data transformation",
        "Functional programming",
        "Array manipulation",
        "Data processing pipelines",
      ],
      notes: [
        "Most methods return new arrays (immutable)",
        "sort() and reverse() mutate original array",
        "Methods are chainable",
        "Callback receives (element, index, array)",
      ],
    },
    tags: ["javascript", "arrays", "functional", "methods"],
    difficulty: "beginner" as const,
    language: "JavaScript",
  },
  {
    id: "javascript-async-patterns",
    title: "JavaScript Async Patterns",
    category: "JavaScript",
    description: "Promises, async/await, and asynchronous programming",
    content: {
      syntax:
        "// Promise\nconst promise = new Promise((resolve, reject) => {\n  // async operation\n  if (success) resolve(result);\n  else reject(error);\n});\n\n// Async/Await\nasync function fetchData() {\n  try {\n    const response = await fetch('/api/data');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error:', error);\n  }\n}\n\n// Promise chaining\nfetch('/api/data')\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error(error));\n\n// Promise utilities\nPromise.all([p1, p2, p3])      // Wait for all\nPromise.allSettled([p1, p2])   // Wait for all (no fail-fast)\nPromise.race([p1, p2])         // First to complete",
      example:
        "// Sequential execution\nasync function sequential() {\n  const result1 = await operation1();\n  const result2 = await operation2();\n  return [result1, result2];\n}\n\n// Parallel execution\nasync function parallel() {\n  const [result1, result2] = await Promise.all([\n    operation1(),\n    operation2()\n  ]);\n  return [result1, result2];\n}",
      complexity: "Depends on operations",
      usage: [
        "API calls",
        "File operations",
        "Database queries",
        "Event handling",
      ],
      notes: [
        "async/await is syntactic sugar over Promises",
        "Use Promise.all() for parallel execution",
        "Always handle errors with try/catch",
        "Avoid mixing async/await with .then()",
      ],
    },
    tags: ["javascript", "async", "promises", "await"],
    difficulty: "intermediate" as const,
    language: "JavaScript",
  },
  {
    id: "java-collections-overview",
    title: "Java Collections Framework",
    category: "Java",
    description: "Essential Java collections and their characteristics",
    content: {
      syntax:
        "// List implementations\nList<String> arrayList = new ArrayList<>();    // Resizable array\nList<String> linkedList = new LinkedList<>();  // Doubly-linked list\n\n// Set implementations\nSet<String> hashSet = new HashSet<>();         // Hash table\nSet<String> treeSet = new TreeSet<>();         // Red-black tree\nSet<String> linkedHashSet = new LinkedHashSet<>(); // Hash + insertion order\n\n// Map implementations\nMap<String, Integer> hashMap = new HashMap<>();           // Hash table\nMap<String, Integer> treeMap = new TreeMap<>();           // Red-black tree\nMap<String, Integer> linkedHashMap = new LinkedHashMap<>(); // Hash + order\n\n// Queue implementations\nQueue<Integer> queue = new LinkedList<>();               // FIFO queue\nPriorityQueue<Integer> pq = new PriorityQueue<>();       // Heap-based priority queue\nDeque<Integer> deque = new ArrayDeque<>();               // Double-ended queue",
      example:
        '// ArrayList operations\nList<String> list = new ArrayList<>();\nlist.add("apple");           // O(1) amortized\nlist.get(0);                 // O(1)\nlist.remove(0);              // O(n)\n\n// HashMap operations\nMap<String, Integer> map = new HashMap<>();\nmap.put("key", 42);          // O(1) average\nInteger value = map.get("key"); // O(1) average\nmap.containsKey("key");      // O(1) average\n\n// TreeSet operations\nSet<Integer> set = new TreeSet<>();\nset.add(42);                 // O(log n)\nboolean contains = set.contains(42); // O(log n)',
      complexity: "Varies by implementation",
      usage: [
        "Data storage and retrieval",
        "Algorithm implementation",
        "Caching mechanisms",
        "Ordered data processing",
      ],
      notes: [
        "ArrayList: Fast random access, slow insertion/deletion",
        "LinkedList: Fast insertion/deletion, slow random access",
        "HashMap: Fast operations, no ordering",
        "TreeMap/TreeSet: Ordered, O(log n) operations",
      ],
    },
    tags: ["java", "collections", "data-structures", "performance"],
    difficulty: "intermediate" as const,
    language: "Java",
  },
  {
    id: "java-streams-api",
    title: "Java Streams API",
    category: "Java",
    description: "Functional-style operations on collections",
    content: {
      syntax:
        '// Stream creation\nStream<String> stream = list.stream();\nStream<Integer> numbers = Stream.of(1, 2, 3, 4, 5);\nStream<Integer> range = IntStream.range(1, 10).boxed();\n\n// Intermediate operations (lazy)\nstream.filter(s -> s.length() > 3)\n      .map(String::toUpperCase)\n      .sorted()\n      .distinct()\n      .limit(10)\n      .skip(2)\n\n// Terminal operations (eager)\n.collect(Collectors.toList())          // Collect to list\n.forEach(System.out::println)          // Execute for each\n.reduce(String::concat)                // Reduce to single value\n.findFirst()                           // Get first element\n.anyMatch(s -> s.startsWith("A"))     // Test if any match\n.count()                               // Count elements',
      example:
        'List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");\n\n// Filter and transform\nList<String> result = names.stream()\n    .filter(name -> name.length() > 3)\n    .map(String::toLowerCase)\n    .sorted()\n    .collect(Collectors.toList());\n// Result: ["alice", "charlie", "david"]\n\n// Group by length\nMap<Integer, List<String>> grouped = names.stream()\n    .collect(Collectors.groupingBy(String::length));\n// Result: {3=["Bob"], 5=["Alice", "David"], 7=["Charlie"]}\n\n// Find max by length\nOptional<String> longest = names.stream()\n    .max(Comparator.comparing(String::length));\n// Result: Optional["Charlie"]',
      complexity: "O(n) for most operations",
      usage: [
        "Data processing pipelines",
        "Filtering and transforming collections",
        "Aggregating data",
        "Functional programming",
      ],
      notes: [
        "Streams are lazy until terminal operation",
        "Intermediate operations return new streams",
        "Use parallel() for CPU-intensive operations",
        "Don't reuse streams - create new ones",
      ],
    },
    tags: ["java", "streams", "functional", "collections"],
    difficulty: "intermediate" as const,
    language: "Java",
  },
  {
    id: "system-design-caching",
    title: "Caching Strategies",
    category: "System Design",
    description: "Caching patterns and strategies for system optimization",
    content: {
      syntax:
        "// Cache-Aside (Lazy Loading)\nfunction getData(key) {\n  let data = cache.get(key);\n  if (!data) {\n    data = database.get(key);\n    cache.set(key, data, TTL);\n  }\n  return data;\n}\n\n// Write-Through\nfunction setData(key, value) {\n  database.set(key, value);\n  cache.set(key, value, TTL);\n}\n\n// Write-Behind (Write-Back)\nfunction setDataAsync(key, value) {\n  cache.set(key, value, TTL);\n  // Database write happens asynchronously\n  writeQueue.push({key, value});\n}",
      example:
        "// Cache hierarchy example\n// L1: Application cache (in-memory)\n// L2: Distributed cache (Redis)\n// L3: CDN (for static content)\n// L4: Database query cache\n\n// Cache eviction policies:\n// - LRU (Least Recently Used)\n// - LFU (Least Frequently Used)\n// - FIFO (First In, First Out)\n// - TTL (Time To Live)\n\n// Cache warming\nasync function warmCache() {\n  const popularItems = await getPopularItems();\n  for (const item of popularItems) {\n    cache.set(item.key, item.value, TTL);\n  }\n}",
      complexity: "O(1) for cache operations",
      usage: [
        "Reducing database load",
        "Improving response times",
        "Handling high traffic",
        "Storing computed results",
      ],
      notes: [
        "Choose appropriate cache size and TTL",
        "Consider cache coherence in distributed systems",
        "Monitor hit/miss ratios",
        "Handle cache stampede scenarios",
      ],
    },
    tags: ["system-design", "caching", "performance", "scalability"],
    difficulty: "intermediate" as const,
  },
  {
    id: "system-design-load-balancing",
    title: "Load Balancing",
    category: "System Design",
    description: "Distributing traffic across multiple servers",
    content: {
      syntax:
        "// Round Robin\nclass RoundRobinBalancer {\n  constructor(servers) {\n    this.servers = servers;\n    this.current = 0;\n  }\n  \n  getServer() {\n    const server = this.servers[this.current];\n    this.current = (this.current + 1) % this.servers.length;\n    return server;\n  }\n}\n\n// Weighted Round Robin\nclass WeightedRoundRobin {\n  constructor(servers) {\n    this.servers = servers; // [{server, weight}, ...]\n    this.currentWeights = servers.map(s => 0);\n  }\n  \n  getServer() {\n    let selected = 0;\n    let total = 0;\n    \n    for (let i = 0; i < this.servers.length; i++) {\n      this.currentWeights[i] += this.servers[i].weight;\n      total += this.servers[i].weight;\n      \n      if (this.currentWeights[i] > this.currentWeights[selected]) {\n        selected = i;\n      }\n    }\n    \n    this.currentWeights[selected] -= total;\n    return this.servers[selected].server;\n  }\n}",
      example:
        "// Load balancing algorithms:\n\n// 1. Round Robin - Equal distribution\n// Requests: A, B, C, A, B, C, ...\n\n// 2. Weighted Round Robin - Based on capacity\n// Server A (weight 3), Server B (weight 1)\n// Requests: A, A, A, B, A, A, A, B, ...\n\n// 3. Least Connections - Route to server with fewest active connections\n\n// 4. IP Hash - Route based on client IP hash\n// Ensures same client goes to same server\n\n// 5. Health Check - Remove unhealthy servers\nif (!server.isHealthy()) {\n  removeFromPool(server);\n}",
      complexity: "O(1) for most algorithms",
      usage: [
        "Distributing traffic across servers",
        "Preventing server overload",
        "Ensuring high availability",
        "Scaling horizontally",
      ],
      notes: [
        "Layer 4 (TCP) vs Layer 7 (HTTP) load balancing",
        "Health checks are crucial",
        "Consider session affinity requirements",
        "Monitor server performance metrics",
      ],
    },
    tags: ["system-design", "load-balancing", "scalability", "availability"],
    difficulty: "intermediate" as const,
  },
  {
    id: "sql-joins-reference",
    title: "SQL Joins",
    category: "Database",
    description: "Complete reference for SQL join operations",
    content: {
      syntax:
        "-- INNER JOIN - Records that have matching values in both tables\nSELECT columns\nFROM table1\nINNER JOIN table2 ON table1.key = table2.key;\n\n-- LEFT JOIN - All records from left table + matching from right\nSELECT columns\nFROM table1\nLEFT JOIN table2 ON table1.key = table2.key;\n\n-- RIGHT JOIN - All records from right table + matching from left\nSELECT columns\nFROM table1\nRIGHT JOIN table2 ON table1.key = table2.key;\n\n-- FULL OUTER JOIN - All records when there's a match in either table\nSELECT columns\nFROM table1\nFULL OUTER JOIN table2 ON table1.key = table2.key;\n\n-- CROSS JOIN - Cartesian product of both tables\nSELECT columns\nFROM table1\nCROSS JOIN table2;",
      example:
        "-- Example tables:\n-- Users: id, name\n-- Orders: id, user_id, amount\n\n-- Get users with their orders (only users who have orders)\nSELECT u.name, o.amount\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id;\n\n-- Get all users, with their orders if they have any\nSELECT u.name, o.amount\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id;\n\n-- Get users who have never placed an order\nSELECT u.name\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE o.user_id IS NULL;",
      complexity: "Depends on indexes and data size",
      usage: [
        "Combining data from multiple tables",
        "Data analysis and reporting",
        "Complex business queries",
        "Data warehouse operations",
      ],
      notes: [
        "Always consider performance implications",
        "Use proper indexes on join columns",
        "LEFT JOIN is most commonly used",
        "Be careful with CROSS JOINs on large tables",
      ],
    },
    tags: ["sql", "database", "joins", "queries"],
    difficulty: "intermediate" as const,
    language: "SQL",
  },
  {
    id: "rest-api-design",
    title: "REST API Design",
    category: "APIs",
    description: "RESTful API design principles and best practices",
    content: {
      syntax:
        "// Resource-based URLs\nGET    /api/users              // Get all users\nGET    /api/users/123          // Get specific user\nPOST   /api/users              // Create new user\nPUT    /api/users/123          // Update entire user\nPATCH  /api/users/123          // Partial update\nDELETE /api/users/123          // Delete user\n\n// Nested resources\nGET    /api/users/123/orders   // Get user's orders\nPOST   /api/users/123/orders   // Create order for user\n\n// Query parameters for filtering/pagination\nGET /api/users?page=1&limit=10&sort=name&filter=active\n\n// Status codes\n200 OK           // Success\n201 Created      // Resource created\n400 Bad Request  // Client error\n401 Unauthorized // Authentication required\n404 Not Found    // Resource not found\n500 Server Error // Internal server error",
      example:
        '// Good API design example\n\n// Consistent naming (plural nouns)\nGET /api/users\nGET /api/products\nGET /api/categories\n\n// Nested resources\nGET /api/users/123/orders/456\nGET /api/categories/tech/products\n\n// Filtering and sorting\nGET /api/products?category=electronics&sort=price&order=desc\n\n// Versioning\nGET /api/v1/users\nGET /api/v2/users\n\n// Response format\n{\n  "data": [...],\n  "meta": {\n    "page": 1,\n    "limit": 10,\n    "total": 100\n  },\n  "links": {\n    "next": "/api/users?page=2",\n    "prev": null\n  }\n}',
      complexity: "Design complexity varies",
      usage: [
        "Web and mobile applications",
        "Microservices communication",
        "Third-party integrations",
        "Public APIs",
      ],
      notes: [
        "Use HTTP methods semantically",
        "Keep URLs simple and predictable",
        "Include proper error handling",
        "Document your API thoroughly",
      ],
    },
    tags: ["api", "rest", "http", "design"],
    difficulty: "intermediate" as const,
  },
  {
    id: "git-commands-cheat-sheet",
    title: "Git Commands",
    category: "Tools",
    description: "Essential Git commands for version control",
    content: {
      syntax:
        '// Repository setup\ngit init                    // Initialize new repo\ngit clone <url>            // Clone remote repo\ngit remote add origin <url> // Add remote\n\n// Basic workflow\ngit status                 // Check status\ngit add <file>             // Stage changes\ngit add .                  // Stage all changes\ngit commit -m "message"    // Commit changes\ngit push origin main       // Push to remote\ngit pull origin main       // Pull from remote\n\n// Branching\ngit branch                 // List branches\ngit branch <name>          // Create branch\ngit checkout <branch>      // Switch branch\ngit checkout -b <branch>   // Create and switch\ngit merge <branch>         // Merge branch\ngit branch -d <branch>     // Delete branch\n\n// History and changes\ngit log                    // View commit history\ngit log --oneline          // Compact history\ngit diff                   // View changes\ngit diff --staged          // View staged changes\ngit show <commit>          // Show commit details',
      example:
        '// Typical workflow\ngit checkout -b feature/new-feature\n// Make changes\ngit add .\ngit commit -m "Add new feature"\ngit push origin feature/new-feature\n// Create pull request\n// After review and merge:\ngit checkout main\ngit pull origin main\ngit branch -d feature/new-feature\n\n// Undo changes\ngit checkout -- <file>     // Discard unstaged changes\ngit reset HEAD <file>      // Unstage file\ngit reset --soft HEAD~1    // Undo last commit (keep changes)\ngit reset --hard HEAD~1    // Undo last commit (discard changes)\n\n// Stashing\ngit stash                  // Temporarily save changes\ngit stash pop              // Apply and remove stash\ngit stash list             // List stashes',
      complexity: "Command complexity varies",
      usage: [
        "Version control",
        "Collaboration",
        "Code backup",
        "Release management",
      ],
      notes: [
        "Always commit with meaningful messages",
        "Use branches for features and fixes",
        "Pull before pushing to avoid conflicts",
        "Regular commits make history cleaner",
      ],
    },
    tags: ["git", "version-control", "commands", "workflow"],
    difficulty: "beginner" as const,
  },
  {
    id: "react-hooks-essentials",
    title: "React Hooks",
    category: "React",
    description: "Essential React hooks for functional components",
    content: {
      syntax:
        "import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';\n\n// useState - State management\nconst [count, setCount] = useState(0);\nconst [user, setUser] = useState(null);\n\n// useEffect - Side effects\nuseEffect(() => {\n  // Effect logic\n  return () => {\n    // Cleanup logic\n  };\n}, [dependencies]);\n\n// useCallback - Memoized function\nconst memoizedCallback = useCallback(() => {\n  doSomething(a, b);\n}, [a, b]);\n\n// useMemo - Memoized value\nconst memoizedValue = useMemo(() => {\n  return computeExpensiveValue(a, b);\n}, [a, b]);\n\n// useContext - Context consumption\nconst value = useContext(MyContext);\n\n// Custom hook\nfunction useCounter(initialValue = 0) {\n  const [count, setCount] = useState(initialValue);\n  const increment = () => setCount(c => c + 1);\n  const decrement = () => setCount(c => c - 1);\n  return { count, increment, decrement };\n}",
      example:
        "// Counter component with hooks\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  useEffect(() => {\n    document.title = `Count: ${count}`;\n  }, [count]);\n  \n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n\n// Data fetching with useEffect\nfunction UserProfile({ userId }) {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n  \n  useEffect(() => {\n    fetchUser(userId)\n      .then(setUser)\n      .finally(() => setLoading(false));\n  }, [userId]);\n  \n  if (loading) return <div>Loading...</div>;\n  return <div>{user?.name}</div>;\n}",
      complexity: "Hook complexity varies",
      usage: [
        "State management in functional components",
        "Side effects and lifecycle",
        "Performance optimization",
        "Code reuse with custom hooks",
      ],
      notes: [
        "Only call hooks at top level",
        "Don't call hooks inside loops or conditions",
        "Use dependency arrays correctly",
        "Custom hooks enable logic reuse",
      ],
    },
    tags: ["react", "hooks", "state", "effects"],
    difficulty: "intermediate" as const,
    language: "JavaScript",
  },
  {
    id: "linked-list",
    title: "Linked List",
    category: "Data Structures",
    description: "Linear data structure with dynamic size",
    content: {
      syntax:
        "class ListNode {\n  constructor(val = 0, next = null) {\n    this.val = val;\n    this.next = next;\n  }\n}\n\nclass LinkedList {\n  constructor() {\n    this.head = null;\n  }\n}",
      example:
        "const list = new LinkedList();\n// Insert: O(1) at head\n// Search: O(n)\n// Delete: O(1) with reference",
      complexity: "Insert O(1), Search O(n)",
      usage: [
        "Dynamic memory allocation",
        "Implementing stacks/queues",
        "Undo functionality",
      ],
      notes: [
        "No random access",
        "Extra memory for pointers",
        "Good for frequent insertions/deletions",
      ],
    },
    tags: ["data-structure", "linear", "pointers"],
    difficulty: "beginner" as const,
  },
  {
    id: "react-hooks",
    title: "React Hooks Essentials",
    category: "React",
    description: "Core React hooks for state and lifecycle",
    content: {
      syntax:
        "// State hook\nconst [state, setState] = useState(initial);\n\n// Effect hook\nuseEffect(() => {\n  // side effect\n  return () => cleanup();\n}, [dependencies]);",
      example:
        "function Counter() {\n  const [count, setCount] = useState(0);\n  \n  useEffect(() => {\n    document.title = `Count: ${count}`;\n  }, [count]);\n  \n  return <button onClick={() => setCount(count + 1)}>\n    {count}\n  </button>;\n}",
      usage: [
        "State management in functions",
        "Side effects and cleanup",
        "Performance optimization",
      ],
      notes: [
        "Only call at top level",
        "Don't call inside loops or conditions",
        "Use dependency arrays carefully",
      ],
    },
    tags: ["react", "hooks", "state", "effects"],
    difficulty: "intermediate" as const,
    language: "JavaScript",
  },
  {
    id: "rest-api-design",
    title: "REST API Design",
    category: "System Design",
    description: "RESTful API design principles and patterns",
    content: {
      syntax:
        "GET    /users          # List users\nGET    /users/:id      # Get specific user\nPOST   /users          # Create user\nPUT    /users/:id      # Update user\nDELETE /users/:id      # Delete user",
      example:
        "// HTTP Status Codes\n200 OK - Success\n201 Created - Resource created\n400 Bad Request - Client error\n401 Unauthorized - Auth required\n404 Not Found - Resource not found\n500 Internal Server Error",
      usage: [
        "Web API development",
        "Microservices communication",
        "Mobile app backends",
      ],
      notes: [
        "Use HTTP methods semantically",
        "Return appropriate status codes",
        "Design URLs as resource hierarchies",
      ],
    },
    tags: ["api", "rest", "http", "design"],
    difficulty: "intermediate" as const,
  },
  {
    id: "binary-tree-traversal",
    title: "Binary Tree Traversal",
    category: "Data Structures",
    description: "Methods to visit all nodes in a binary tree",
    content: {
      syntax:
        "// Inorder: Left -> Root -> Right\nfunction inorder(node) {\n  if (!node) return;\n  inorder(node.left);\n  visit(node);\n  inorder(node.right);\n}",
      example:
        "// Preorder: Root -> Left -> Right\n// Postorder: Left -> Right -> Root\n// Level-order: BFS using queue\n\n// Tree: [1,2,3]\n// Inorder: [2,1,3]\n// Preorder: [1,2,3]\n// Postorder: [2,3,1]",
      complexity: "O(n) time, O(h) space",
      usage: [
        "Tree processing",
        "Expression evaluation",
        "Serialization/deserialization",
      ],
      notes: [
        "Inorder gives sorted sequence for BST",
        "Preorder useful for copying trees",
        "Level-order uses O(w) extra space",
      ],
    },
    tags: ["tree", "traversal", "recursion", "dfs", "bfs"],
    difficulty: "intermediate" as const,
  },
  {
    id: "sql-joins",
    title: "SQL Joins",
    category: "Databases",
    description: "Combining data from multiple tables",
    content: {
      syntax:
        "-- INNER JOIN\nSELECT * FROM users u\nINNER JOIN orders o ON u.id = o.user_id;\n\n-- LEFT JOIN\nSELECT * FROM users u\nLEFT JOIN orders o ON u.id = o.user_id;",
      example:
        "-- Get users with their order count\nSELECT u.name, COUNT(o.id) as order_count\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.name;",
      usage: [
        "Combining related data",
        "Data analysis and reporting",
        "Relational data modeling",
      ],
      notes: [
        "INNER JOIN returns only matching rows",
        "LEFT JOIN includes all left table rows",
        "Performance depends on indexes",
      ],
    },
    tags: ["sql", "database", "joins", "queries"],
    difficulty: "intermediate" as const,
  },
  {
    id: "typescript-types",
    title: "TypeScript Types",
    category: "TypeScript",
    description: "Essential TypeScript type definitions and utilities",
    content: {
      syntax:
        "// Basic types\nstring, number, boolean, array, object, null, undefined\n\n// Array types\nstring[] or Array<string>\n\n// Object types\ninterface User {\n  id: number;\n  name: string;\n  email?: string; // optional\n}\n\n// Function types\ntype Handler = (event: Event) => void;\n\n// Union types\ntype Status = 'loading' | 'success' | 'error';\n\n// Generic types\ninterface Response<T> {\n  data: T;\n  status: number;\n}\n\n// Utility types\nPartial<T>, Required<T>, Pick<T, K>, Omit<T, K>",
      example:
        "// Interface vs Type\ninterface User {\n  name: string;\n}\n\ntype User = {\n  name: string;\n};\n\n// Generic function\nfunction identity<T>(arg: T): T {\n  return arg;\n}\n\n// Utility type usage\ntype PartialUser = Partial<User>; // All properties optional\ntype UserName = Pick<User, 'name'>; // Only name property",
      complexity: "Type complexity varies",
      usage: [
        "Type safety",
        "Better IDE support",
        "Compile-time error catching",
        "Code documentation",
      ],
      notes: [
        "Interfaces are extendable, types are not",
        "Use strict mode for better type checking",
        "Generic types provide reusability",
        "Utility types reduce boilerplate",
      ],
    },
    tags: ["typescript", "types", "interfaces", "generics"],
    difficulty: "intermediate" as const,
    language: "TypeScript",
  },
  {
    id: "linux-commands",
    title: "Linux Commands",
    category: "Tools",
    description: "Essential Linux/Unix commands for developers",
    content: {
      syntax:
        "// File operations\nls -la                 // List files with details\ncp source dest         // Copy files\nmv old new             // Move/rename files\nrm -rf directory       // Remove directory recursively\nfind . -name \"*.js\"    // Find files by name\n\n// Text processing\ngrep \"pattern\" file    // Search in files\nsed 's/old/new/g' file // Replace text\nawk '{print $1}' file  // Process columns\ncat file               // Display file content\nhead -n 10 file        // First 10 lines\ntail -f file           // Follow file changes\n\n// Process management\nps aux                 // List processes\nkill -9 PID            // Kill process\ntop                    // Monitor processes\njobs                   // List background jobs\nnohup command &        // Run in background",
      example:
        "// Common workflows\n\n// Find and replace in multiple files\ngrep -r \"oldText\" . | xargs sed -i 's/oldText/newText/g'\n\n// Monitor log files\ntail -f /var/log/application.log\n\n// Find large files\nfind . -type f -size +100M\n\n// Check disk usage\ndu -sh * | sort -hr\n\n// Network operations\ncurl -X GET https://api.example.com\nwget https://example.com/file.zip",
      complexity: "Command complexity varies",
      usage: [
        "System administration",
        "File management",
        "Text processing",
        "Process monitoring",
      ],
      notes: [
        "Be careful with rm -rf command",
        "Use man command for help",
        "Pipe commands for complex operations",
        "Regular expressions enhance power",
      ],
    },
    tags: ["linux", "unix", "commands", "bash"],
    difficulty: "intermediate" as const,
  },
  {
    id: "docker-basics",
    title: "Docker Essentials",
    category: "DevOps",
    description: "Docker commands and concepts for containerization",
    content: {
      syntax:
        '// Image operations\ndocker build -t myapp .           // Build image\ndocker pull nginx                 // Pull image\ndocker images                     // List images\ndocker rmi image_id               // Remove image\n\n// Container operations\ndocker run -d -p 8080:80 nginx    // Run container\ndocker ps                         // List running containers\ndocker ps -a                      // List all containers\ndocker stop container_id          // Stop container\ndocker rm container_id            // Remove container\ndocker exec -it container_id bash // Execute command\n\n// Docker Compose\ndocker-compose up -d              // Start services\ndocker-compose down               // Stop services\ndocker-compose logs               // View logs\n\n// Dockerfile example\nFROM node:16-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["npm", "start"]',
      example:
        '// Complete workflow\n\n// 1. Create Dockerfile\nFROM node:16-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\nEXPOSE 3000\nUSER node\nCMD ["node", "server.js"]\n\n// 2. Build and run\ndocker build -t myapp:latest .\ndocker run -d -p 3000:3000 --name myapp-container myapp:latest\n\n// 3. Check logs\ndocker logs myapp-container\n\n// 4. Clean up\ndocker stop myapp-container\ndocker rm myapp-container',
      complexity: "Container orchestration complexity",
      usage: [
        "Application containerization",
        "Development environment consistency",
        "Microservices deployment",
        "CI/CD pipelines",
      ],
      notes: [
        "Use multi-stage builds for optimization",
        "Don't run as root in containers",
        "Use .dockerignore to exclude files",
        "Layer caching improves build speed",
      ],
    },
    tags: ["docker", "containers", "devops", "deployment"],
    difficulty: "intermediate" as const,
  },
  {
    id: "aws-services-overview",
    title: "AWS Core Services",
    category: "Cloud",
    description: "Essential AWS services for cloud development",
    content: {
      syntax:
        "// Compute\nEC2         // Virtual servers\nLambda      // Serverless functions\nECS/EKS     // Container services\n\n// Storage\nS3          // Object storage\nEBS         // Block storage\nEFS         // File storage\n\n// Database\nRDS         // Relational databases\nDynamoDB    // NoSQL database\nElastiCache // In-memory caching\n\n// Networking\nVPC         // Virtual private cloud\nCloudFront  // CDN\nRoute 53    // DNS service\nELB         // Load balancing\n\n// Monitoring & Security\nCloudWatch  // Monitoring & logging\nIAM         // Identity & access management\nCloudTrail  // API logging",
      example:
        "// Common architectures\n\n// Web application stack:\n// Route 53 -> CloudFront -> ALB -> EC2/ECS -> RDS\n// \n// Serverless stack:\n// API Gateway -> Lambda -> DynamoDB\n//                     -> S3\n//                     -> SQS\n\n// Microservices pattern:\n// Internet Gateway\n//     |\n// Application Load Balancer\n//     |\n// ECS Services (multiple)\n//     |\n// RDS + ElastiCache\n\n// Cost optimization:\n// - Use Reserved Instances for predictable workloads\n// - Spot Instances for fault-tolerant workloads\n// - S3 lifecycle policies for data archiving\n// - CloudWatch for monitoring and alerting",
      complexity: "Architecture complexity varies",
      usage: [
        "Scalable web applications",
        "Data processing pipelines",
        "Microservices architectures",
        "Serverless applications",
      ],
      notes: [
        "Follow principle of least privilege",
        "Use CloudFormation for infrastructure as code",
        "Monitor costs with Cost Explorer",
        "Design for failure and resilience",
      ],
    },
    tags: ["aws", "cloud", "services", "architecture"],
    difficulty: "intermediate" as const,
  },
  {
    id: "data-structures-complexities",
    title: "Data Structure Complexities",
    category: "Data Structures",
    description: "Time and space complexities for common data structures",
    content: {
      syntax:
        "// Array/List\n// Access: O(1), Search: O(n), Insert: O(n), Delete: O(n)\n\n// Dynamic Array (ArrayList)\n// Access: O(1), Search: O(n), Insert: O(1) amortized, Delete: O(n)\n\n// Linked List\n// Access: O(n), Search: O(n), Insert: O(1), Delete: O(1)\n\n// Hash Table\n// Access: N/A, Search: O(1), Insert: O(1), Delete: O(1)\n// Worst case: O(n) for all operations\n\n// Binary Search Tree\n// Access: O(log n), Search: O(log n), Insert: O(log n), Delete: O(log n)\n// Worst case: O(n) when unbalanced\n\n// Heap (Binary)\n// Access: O(n), Search: O(n), Insert: O(log n), Delete: O(log n)\n// Find min/max: O(1)\n\n// Trie\n// Search: O(m), Insert: O(m), Delete: O(m)\n// where m is the length of the key",
      example:
        "// When to use each structure:\n\n// Array: Fast random access, fixed size\nconst scores = [95, 87, 92, 78, 96];\nconsole.log(scores[2]); // O(1) access\n\n// Linked List: Frequent insertions/deletions\nclass Node {\n  constructor(data) {\n    this.data = data;\n    this.next = null;\n  }\n}\n\n// Hash Table: Fast lookups\nconst userMap = new Map();\nuserMap.set('user123', userData); // O(1)\n\n// BST: Ordered data with fast operations\nclass TreeNode {\n  constructor(val) {\n    this.val = val;\n    this.left = this.right = null;\n  }\n}\n\n// Heap: Priority queue operations\nclass MinHeap {\n  // Insert: O(log n), extractMin: O(log n)\n}",
      complexity: "Varies by structure and operation",
      usage: [
        "Algorithm optimization",
        "System design decisions",
        "Performance analysis",
        "Data organization",
      ],
      notes: [
        "Choose structure based on operation frequency",
        "Consider space-time tradeoffs",
        "Hash tables excellent for frequent lookups",
        "Trees good for ordered data",
      ],
    },
    tags: ["data-structures", "complexity", "performance", "algorithms"],
    difficulty: "intermediate" as const,
  },
  {
    id: "algorithm-patterns",
    title: "Algorithm Patterns",
    category: "Patterns",
    description: "Common algorithmic patterns and when to use them",
    content: {
      syntax:
        "// Two Pointers\n// Use for: sorted arrays, palindromes, pair finding\nfunction twoSum(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left < right) {\n    const sum = arr[left] + arr[right];\n    if (sum === target) return [left, right];\n    if (sum < target) left++;\n    else right--;\n  }\n}\n\n// Sliding Window\n// Use for: subarray problems, max/min in windows\nfunction maxSumSubarray(arr, k) {\n  let maxSum = 0, windowSum = 0;\n  for (let i = 0; i < k; i++) windowSum += arr[i];\n  maxSum = windowSum;\n  \n  for (let i = k; i < arr.length; i++) {\n    windowSum = windowSum - arr[i - k] + arr[i];\n    maxSum = Math.max(maxSum, windowSum);\n  }\n  return maxSum;\n}\n\n// Fast & Slow Pointers\n// Use for: cycle detection, middle element\nfunction hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}",
      example:
        "// Pattern selection guide:\n\n// Two Pointers: Valid Palindrome, Container With Most Water\n// Sliding Window: Longest Substring Without Repeating Characters\n// Fast & Slow: Linked List Cycle, Finding Middle of Linked List\n// Merge Intervals: Meeting Rooms, Insert Interval\n// Cyclic Sort: Find Missing Number, Find Duplicate Number\n// Tree DFS: Path Sum, Maximum Depth of Binary Tree\n// Tree BFS: Level Order Traversal, Minimum Depth\n// Topological Sort: Course Schedule, Alien Dictionary\n// Binary Search: Search in Rotated Array, Find Peak Element\n// Backtracking: N-Queens, Sudoku Solver, Permutations\n// Dynamic Programming: Coin Change, Longest Common Subsequence",
      complexity: "Pattern complexity varies",
      usage: [
        "Coding interviews",
        "Algorithm optimization",
        "Problem solving",
        "Efficient implementations",
      ],
      notes: [
        "Learn to recognize problem patterns",
        "Practice implementation variations",
        "Understand time/space tradeoffs",
        "Master a few patterns deeply",
      ],
    },
    tags: ["algorithms", "patterns", "problem-solving", "interviews"],
    difficulty: "advanced" as const,
    language: "JavaScript",
  },
  {
    id: "microservices-patterns",
    title: "Microservices Patterns",
    category: "System Design",
    description: "Common patterns for microservices architecture",
    content: {
      syntax:
        "// Service Discovery\n// Services register themselves and discover others\n// Tools: Consul, Eureka, Zookeeper\n\n// API Gateway\n// Single entry point for client requests\n// Handles: routing, authentication, rate limiting\n\n// Circuit Breaker\n// Prevents cascade failures\nclass CircuitBreaker {\n  constructor(threshold, timeout) {\n    this.threshold = threshold;\n    this.timeout = timeout;\n    this.failureCount = 0;\n    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN\n  }\n  \n  async call(operation) {\n    if (this.state === 'OPEN') {\n      throw new Error('Circuit breaker is OPEN');\n    }\n    \n    try {\n      const result = await operation();\n      this.onSuccess();\n      return result;\n    } catch (error) {\n      this.onFailure();\n      throw error;\n    }\n  }\n}\n\n// Event Sourcing\n// Store events instead of current state\n// Enables: audit trail, replay, temporal queries\n\n// CQRS (Command Query Responsibility Segregation)\n// Separate read and write models",
      example:
        "// Microservices communication patterns:\n\n// 1. Synchronous (HTTP/REST)\nconst userService = {\n  async getUser(id) {\n    return await fetch(`/user-service/users/${id}`);\n  }\n};\n\n// 2. Asynchronous (Message Queues)\nconst eventBus = {\n  publish(event, data) {\n    // Publish to message queue (RabbitMQ, Apache Kafka)\n  },\n  subscribe(event, handler) {\n    // Subscribe to events\n  }\n};\n\n// 3. Database per Service\n// Each service has its own database\n// Challenges: transactions, data consistency\n\n// 4. Saga Pattern (Distributed Transactions)\nclass OrderSaga {\n  async processOrder(order) {\n    try {\n      await this.reserveInventory(order);\n      await this.processPayment(order);\n      await this.shipOrder(order);\n    } catch (error) {\n      await this.compensate(order, error);\n    }\n  }\n}",
      complexity: "High architectural complexity",
      usage: [
        "Large scale applications",
        "Team autonomy",
        "Technology diversity",
        "Independent deployments",
      ],
      notes: [
        "Start with monolith, evolve to microservices",
        "Network latency becomes significant",
        "Distributed tracing is essential",
        "Consider operational complexity",
      ],
    },
    tags: ["microservices", "architecture", "distributed-systems", "patterns"],
    difficulty: "advanced" as const,
  },
];
