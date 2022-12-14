import { ReactNode } from "react";
import { FaSortAmountDown, FaTree } from "react-icons/fa";

export interface ContentItem {
    title: string;
    link: string;
    icon: ReactNode | string;
    subContent?: ContentItem[]
}

// Declare all content here to be able to see it on the UI
export const Content: ContentItem[] = [
    {
        title: 'Home',
        link: '/',
        icon: '🏠'
    },
    {
        title: 'Algorithms',
        link: 'algorithms',
        icon: '🧠',
        subContent: [
            {
                title: 'Introduction',
                link: 'algorithms',
                icon: '💡',
            },
            {
                title: 'Sort',
                link: 'sort',
                icon: '📊',
                subContent: [
                    {
                        title: 'Introduction',
                        link: 'sort',
                        icon: '💡',
                    },
                    {
                        title: 'Bogo sort',
                        link: 'bogo-sort',
                        icon: '📊',
                    },
                    {
                        title: 'Bubble Sort',
                        link: 'bubble-sort',
                        icon: '📊',
                    },
                    {
                        title: 'Selection Sort',
                        link: 'selection-sort',
                        icon: '📊',
                    },
                    {
                        title: 'Merge Sort',
                        link: 'merge-sort',
                        icon: '📊',
                    },
                    {
                        title: 'Quick Sort',
                        link: 'quick-sort',
                        icon: '📊',
                    },
                    {
                        title: 'Radix Sort',
                        link: 'radix-sort',
                        icon: '📊',
                    },
                    {
                        title: 'Insertion Sort',
                        link: 'insertion-sort',
                        icon: '📊',
                    },
                    {
                        title: 'Bucket Sort',
                        link: 'bucket-sort',
                        icon: '📊',
                    }
                ]
            },
            {
                title: 'Search',
                link: 'search',
                icon: '🔎',
                subContent: [
                    {
                        title: 'Linear Search',
                        link: 'linear-search',
                        icon: '🔎',
                    },
                    {
                        title: 'Binary Search',
                        link: 'binary-search',
                        icon: '🔎',
                    },
                    {
                        title: 'BFS',
                        link: 'bfs',
                        icon: '🔎',
                    },
                    {
                        title: 'DFS',
                        link: 'dfs',
                        icon: '🔎',
                    },
                    {
                        title: 'DFS vs BFS',
                        link: 'dfs-vs-bfs',
                        icon: '🔎',
                    }
                ]
            },
            {
                title: 'Big O',
                link: 'big-o',
                icon: '📝',
            },
            {
                title: 'Tree traversal',
                link: 'tree-traversal',
                icon: '🌲',
            },
            {
                title: 'Kruskal’s Minimum Spanning Tree',
                link: 'kruskal-minimum-spanning-tree',
                icon: '🌲',
            },
            {
                title: 'Bit manipulation',
                link: 'bit-manipulation',
                icon: '📝',
            },
            {
                title: 'Dynamic programming',
                link: 'dynamic-programming',
                icon: '📝',
            },
            {
                title: 'Cheat sheets',
                link: 'algorithms-cheat-sheets',
                icon: '📝',
            },
            {
                title: 'Notes',
                link: 'algorithms-notes',
                icon: '📝',
                subContent: [
                    {
                        title: 'General notes',
                        link: 'algorithms-notes',
                        icon: '💡',  
                    },
                    {
                        title: 'Sliding window',
                        link: 'sliding-window',
                        icon: '🪟',  
                    },
                    {
                        title: 'Two pointers/iterators',
                        link: 'two-pointers',
                        icon: '2️',  
                    },
                    {
                        title: 'Fast and slow pointers',
                        link: 'fast-and-slow-pointers',
                        icon: '💾',  
                    },
                    {
                        title: 'Merge intervals',
                        link: 'merge-intervals',
                        icon: '💾',  
                    },
                    {
                        title: 'Cyclic sort',
                        link: 'cyclic-sort',
                        icon: '💾',  
                    },
                    {
                        title: 'In-place reversal of linked list',
                        link: 'in-place-reversal-of-linked-list',
                        icon: '💾',  
                    },
                    {
                        title: 'Tree BFS',
                        link: 'tree-bfs',
                        icon: '🌲',  
                    },
                    {
                        title: 'Tree DFS',
                        link: 'tree-dfs',
                        icon: '🌲',  
                    },
                    {
                        title: 'Two heaps',
                        link: 'two-heaps',
                        icon: '💾',  
                    },
                    {
                        title: 'Subsets',
                        link: 'subsets',
                        icon: '💾',  
                    },
                    {
                        title: 'Modified binary search',
                        link: 'modified-binary-search',
                        icon: '💾',  
                    },
                    {
                        title: 'Top K elements',
                        link: 'top-k-elements',
                        icon: '💾',  
                    },
                    {
                        title: 'K-way Merge',
                        link: 'k-way-merge',
                        icon: '💾',  
                    },
                    {
                        title: 'Topological sort',
                        link: 'topological-sort',
                        icon: '💾',  
                    },
                ]
            },
            {
                title: 'Leetcode exercises',
                link: 'leet-code-exercises',
                icon: '📝',
            }
        ]
    },
    {
        title: 'Data Structures',
        link: 'data-structures',
        icon: '💾',
        subContent: [
            {
                title: 'Introduction',
                link: 'data-structures',
                icon: '💡',
            },
            {
                title: 'Array',
                link: 'array',
                icon: '💾',
                subContent: [
                    {
                        title: 'Introduction',
                        link: 'array',
                        icon: '💡',  
                    },
                    {
                        title: 'Longest Common Prefix Array',
                        link: 'longest-common-prefix-array',
                        icon: '💾',  
                    },
                    {
                        title: 'Suffix Arrays',
                        link: 'suffix-arrays',
                        icon: '💾',  
                    },
                ]
            },
            {
                title: 'List',
                link: 'list',
                icon: '💾',
            },
            {
                title: 'Linked List',
                link: 'linked-list',
                icon: '💾',
            },
            {
                title: 'Set',
                link: 'set',
                icon: '💾',
            },
            {
                title: 'Stack',
                link: 'stack',
                icon: '💾',
            },
            {
                title: 'Queue',
                link: 'queue',
                icon: '💾',
                subContent: [
                    {
                        title: 'Introduction',
                        link: 'queue',
                        icon: '💡',  
                    },
                    {
                        title: 'Priority Queue',
                        link: 'priority-queue',
                        icon: '💾',  
                    },
                ]
            },
            {
                title: 'Map',
                link: 'map',
                icon: '🗺️',
                subContent: [
                    {
                        title: 'Introduction',
                        link: 'map',
                        icon: '💡',  
                    },
                    {
                        title: 'HashMap',
                        link: 'hash-map',
                        icon: '🗺️',  
                    },
                    {
                        title: 'Hash collision resolution',
                        link: 'hash-collision-resolution',
                        icon: '🗺️',  
                    },
                ]
            },
            {
                title: 'Tree',
                link: 'tree',
                icon: '🌲',
                subContent: [
                    {
                        title: 'Introduction',
                        link: 'tree',
                        icon: '💡',  
                    },
                    {
                        title: 'Binary Tree',
                        link: 'binary-tree',
                        icon: '🌲',  
                    },
                    {
                        title: 'Fenwick Tree',
                        link: 'fenwick-tree',
                        icon: '🌲',  
                    },
                    {
                        title: 'Heap',
                        link: 'heap',
                        icon: '🌲',  
                    }
                ]
            },
            {
                title: 'Union Find',
                link: 'union-find',
                icon: '🔗',
            }
        ]
    },
    {
        title: 'Java',
        link: 'java',
        icon: '☕',
        subContent: [
            {
                title: 'Introduction',
                link: 'java',
                icon: '💡',
            },
            {
                title: 'Collections',
                link: 'java-collections',
                icon: '💾',
            },
            {
                title: 'Cheat sheets',
                link: 'java-cheat-sheets',
                icon: '📝',
            },
            {
                title: 'Date API',
                link: 'java-date-api',
                icon: '📅',
            },
            {
                title: 'Memory Management',
                link: 'java-memory-management',
                icon: '💾',
            },
            {
                title: 'Unit Testing',
                link: 'java-unit-testing',
                icon: '🧪',
            },
            {
                title: 'Beans',
                link: 'java-beans',
                icon: '🫘',
            },
            {
                title: 'How to',
                link: 'java',
                icon: '⁉️',
                subContent: [
                    {
                        title: 'Create a good HashCode',
                        link: 'java-create-a-good-hash-code',
                        icon: '⁉️',
                    }, 
                    {
                        title: 'Create a library',
                        link: 'java-creating-libs',
                        icon: '⁉️',
                    }, 
                ]
            },
            {
                title: 'Spring',
                link: 'spring',
                icon: '🍃',
                subContent: [
                    {
                        title: 'Introduction',
                        link: 'spring',
                        icon: '💡',
                    },
                    {
                        title: 'Security',
                        link: 'spring-security',
                        icon: '🔒',
                    },
                    {
                        title: 'JPA',
                        link: 'spring-jpa',
                        icon: '💾',
                    },
                    {
                        title: 'Caching',
                        link: 'spring-caching',
                        icon: '💾',
                    },
                    {
                        title: 'Interview Questions',
                        link: 'spring-interview-questions',
                        icon: '❓',
                        subContent: [
                            {
                                title: 'Spring Core',
                                link: 'spring-core-interview-questions',
                                icon: '❓',  
                            },
                            {
                                title: 'Spring 5',
                                link: 'spring-5-interview-questions',
                                icon: '❓',  
                            },
                            {
                                title: 'Spring Data Access',
                                link: 'spring-data-access-interview-questions',
                                icon: '❓',  
                            },
                            {
                                title: 'Spring Web MVC',
                                link: 'springs-web-mvc-interview-questions',
                                icon: '❓',  
                            },
                            {
                                title: 'Spring Aspect Oriented Programming',
                                link: 'spring-aspect-oriented-interview-questions',
                                icon: '❓',  
                            }
                        ]
                    }
                ]
            },
            {
                title: 'Interview questions',
                link: 'java-interview-questions',
                icon: '❓',
                subContent: [
                    {
                        title: 'Collections',
                        link: 'java-collections-interview-questions',
                        icon: '❓',
                    }, 
                    {
                        title: 'Memory Management',
                        link: 'java-memory-management-interview-questions',
                        icon: '❓',
                    }, 
                    {
                        title: 'Concurrency',
                        link: 'java-concurrency-interview-questions',
                        icon: '❓',
                    }, 
                    {
                        title: 'Type System',
                        link: 'java-type-system-interview-questions',
                        icon: '❓',
                    }, 
                    {
                        title: 'Class structure and initialization',
                        link: 'java-class-structure-and-initialization-interview-questions',
                        icon: '❓',
                    }, 
                    {
                        title: 'Java 8',
                        link: 'java-8-interview-questions',
                        icon: '❓',
                    },
                    {
                        title: 'Generics',
                        link: 'java-generics-interview-questions',
                        icon: '❓',
                    }, 
                    {
                        title: 'Flow control',
                        link: 'java-flow-control-interview-questions',
                        icon: '❓',
                    }, 
                    {
                        title: 'Exceptions',
                        link: 'java-exceptions-interview-questions',
                        icon: '❓',
                    },
                    {
                        title: 'Annotations',
                        link: 'java-annotations-interview-questions',
                        icon: '❓',
                    },
                    {
                        title: 'Streams',
                        link: 'java-streams-interview-questions',
                        icon: '❓',
                    }, 
                    {
                        title: 'Kafka',
                        link: 'java-kafka-interview-questions',
                        icon: '❓',
                    }, 
                    {
                        title: 'Tests',
                        link: 'java-tests-interview-questions',
                        icon: '❓',
                    }, 
                    {
                        title: 'Multidisciplinary questions',
                        link: 'java-multidisciplinary-interview-questions',
                        icon: '❓',
                    }, 
                ]
            },
        ]
    },
    {
        title: 'APIs',
        link: 'apis',
        icon: '🧩',
        subContent: [
            {
                title: 'Introduction',
                link: 'apis',
                icon: '💡',
            },
            {
                title: 'Spring APIs',
                link: 'spring-apis',
                icon: '🍃',
            }
        ]
    },
    {
        title: 'Design Patterns',
        link: 'design-patterns',
        icon: '🌍'
    },
    {
        title: 'Microservices',
        link: 'microservices',
        icon: '🗺️'
    },
    {
        title: 'System Design',
        link: 'system-design',
        icon: '🗺️',
        subContent: [
            {
                title: 'Introduction',
                link: 'system-design',
                icon: '💡'
            },
            {
                title: 'Distributed Systems',
                link: 'distributed-systems',
                icon: '🌍'
            },
            {
                title: 'Caching',
                link: 'caching',
                icon: '💾'
            },
            {
                title: 'Load Balancer',
                link: 'load-balancer',
                icon: '⚖️'
            },
            {
                title: 'Scaling',
                link: 'scaling',
                icon: '⬆️'
            },
            {
                title: 'CDN',
                link: 'cdn',
                icon: '🌍'
            },
            {
                title: 'Message Queues',
                link: 'message-queues',
                icon: '📥'
            },
            {
                title: 'Processing Queues',
                link: 'processing-queues',
                icon: '📥'
            },
            {
                title: 'Storage',
                link: 'storage',
                icon: '💾'
            },
            {
                title: 'Distributed file system',
                link: 'distributed-file-system',
                icon: '🌍'
            },
            {
                title: 'Communication',
                link: 'communication',
                icon: '☎️',
                subContent: [
                    {
                        title: 'HTTP',
                        link: 'http',
                        icon: '🌍',
                    },
                    {
                        title: 'Web Sockets',
                        link: 'web-sockets',
                        icon: '🌍',
                    },
                ]
            },
            {
                title: 'Interview Questions',
                link: 'system-design-interview-questions',
                icon: '❓'
            },
        ]
    },
    {
        title: 'Databases',
        link: 'databases',
        icon: '💾',
        subContent: [
            {
                title: 'Introduction',
                link: 'databases',
                icon: '💡'
            },
            {
                title: 'SQL',
                link: 'sql',
                icon: '💾',
                subContent: [
                    {
                        title: 'Introduction',
                        link: 'sql',
                        icon: '💡'
                    },
                    {
                        title: 'Oracle',
                        link: 'oracle',
                        icon: '⭕'
                    },
                ]
            },
        ]
    },
    {
        title: 'OOP',
        link: 'oop',
        icon: '🚙'
    },
    {
        title: 'Blockchain',
        link: 'blockchain',
        icon: '🔗',
        subContent: [
            {
                title: 'Introduction',
                link: 'blockchain',
                icon: '💡',
            },
            {
                title: 'Bitcoin',
                link: 'bitcoin',
                icon: '🪙',
            },
            {
                title: 'Ethereum',
                link: 'ethereum',
                icon: '🪙',
            }
        ]
    },
    {
        title: 'Cryptography',
        link: 'cryptography',
        icon: '🔐'
    },
    {
        title: 'IT Books Summarized',
        link: 'it-books',
        icon: '📚',
        subContent: [
            {
                title: 'Clean code',
                link: 'clean-code',
                icon: '🧹',
            },
            {
                title: 'Clean Architecture',
                link: 'clean-architecture',
                icon: '🧹',
            },
        ]
    },
    {
        title: 'Misc',
        link: 'misc',
        icon: '🗺️',
        subContent: [
            {
                title: 'TDD',
                link: 'tdd',
                icon: '🗺️'
            },
            {
                title: 'DDD',
                link: 'ddd',
                icon: '🗺️'
            },
            {
                title: 'MVC',
                link: 'mvc',
                icon: '🗺️'
            },
            {
                title: 'Three tier architecture',
                link: 'three-tier-architecture',
                icon: '🗺️'
            },
            {
                title: 'Unit tests',
                link: 'unit-tests',
                icon: '🗺️'
            }
        ]
    }
]