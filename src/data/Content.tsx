import { ReactNode } from "react";
import { FaSortAmountDown, FaTree } from "react-icons/fa";

export interface ContentItem {
    title: string;
    link: string;
    icon: ReactNode | string;
    subContent?: ContentItem[]
}

// Declare all subjects here
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
        subContent: [{
            title: 'Sort',
            link: 'algorithms/sort-algorithm',
            icon: '📊',
            subContent: [{
                title: 'Sortiiiiiiii',
                link: 'test/algo/sort-algorithmiiiiiiiii',
                icon: '📊',
            }]
        }]
    },
    {
        title: 'Data Structures',
        link: 'data-structures',
        icon: '🌲',
        subContent: [{
            title: 'Trees',
            link: 'data-structures/ds-tree',
            icon: '🌲',
            subContent: []
        }]
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