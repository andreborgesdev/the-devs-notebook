import { ReactNode } from "react";
import { IconType } from "react-icons";
import { FaBrain, FaDatabase, FaGem, FaHome, FaSortAmountDown, FaTree, FaUnlockAlt } from "react-icons/fa";

interface ContentItem {
    title: string;
    link: string;
    icon: ReactNode | string;
    subContent?: ContentItem[]
}

// Declare all subjects here
export const Content: Array<ContentItem> = [
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
            link: 'sort-algorithm',
            icon: <FaSortAmountDown />,
            subContent: []
        }]
    },
    {
        title: 'Data Structures',
        link: 'data-structures',
        icon: '💾',
        subContent: [{
            title: 'tree',
            link: 'ds-tree',
            icon: <FaTree />,
            subContent: []
        }]
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