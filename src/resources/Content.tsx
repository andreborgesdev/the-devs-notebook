import { ReactNode } from "react";
import { IconType } from "react-icons";
import { FaBrain, FaDatabase, FaGem, FaHome, FaSortAmountDown, FaTree, FaUnlockAlt } from "react-icons/fa";

interface ContentItem {
    title: string;
    link: string;
    icon: ReactNode;
    subContent?: ContentItem[]
}

// Declare all subjects here
export const Content: Array<ContentItem> = [
    {
        title: 'Home',
        link: '/',
        icon: <FaHome />
    },
    {
        title: 'Algorithms',
        link: 'algorithms',
        icon: <FaBrain />,
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
        icon: <FaDatabase />,
        subContent: [{
            title: 'tree',
            link: 'ds-tree',
            icon: <FaTree />,
            subContent: []
        }]
    },
    {
        title: 'Cryptography',
        link: 'crypto',
        icon: <FaUnlockAlt />
    }
]