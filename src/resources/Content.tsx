import { IconType } from "react-icons";
import { FaGem } from "react-icons/fa";

interface ContentItem {
    title: string;
    link: string;
    icon: IconType;
    subContent?: ContentItem[]
}

// Declare all subjects here
export const Content: Array<ContentItem> = [
    {
        title: 'Home',
        link: '/',
        icon: FaGem
    },
    {
        title: 'Algorithms',
        link: 'algorithms',
        icon: FaGem,
        subContent: [{
            title: 'Sort',
            link: 'sort-algorithm',
            icon: FaGem,
            subContent: []
        }]
    },
    {
        title: 'Data Structures',
        link: 'data-structures',
        icon: FaGem,
        subContent: [{
            title: 'tree',
            link: 'ds-tree',
            icon: FaGem,
            subContent: []
        }]
    },
    {
        title: 'Cryptography',
        link: 'crypto',
        icon: FaGem
    }
]