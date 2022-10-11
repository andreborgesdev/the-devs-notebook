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
        icon: '💾',
        subContent: [{
            title: 'Trees',
            link: 'data-structures/ds-tree',
            icon: '🌲',
            subContent: []
        }]
    },
    {
        title: 'API',
        link: 'api',
        icon: '🧩'
    },
    {
        title: 'Design Patterns',
        link: 'design-patterns',
        icon: '🌍'
    },
    {
        title: 'OOP',
        link: 'oop',
        icon: '🚙'
    },
    {
        title: 'Clean Code',
        link: 'clean-code',
        icon: '📚'
    },
    {
        title: 'Cryptography',
        link: 'crypto',
        icon: '🔐'
    }
]