import { IconType } from 'react-icons';
import { FaGem } from 'react-icons/fa';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { PageLayout } from './pages/PageLayout';
import { MarkdownRender } from './pages/MarkdownRender';
import { NotFound } from './pages/NotFound';

export const MyCustomRouter = () => {
    interface SidebarItem {
        title: string;
        name: string;
        icon: IconType;
        subContent: SidebarItem[]
    }

    // Declare all subjects here
    const subjects: Array<SidebarItem> = [{
            title: 'Algorithms',
            name: 'algorithms',
            icon: FaGem,
            subContent: [{
                title: 'Sort',
                name: 'sort-algorithm',
                icon: FaGem,
                subContent: []
            }]
        },
        {
            title: 'Data Structures',
            name: 'crypto',
            icon: FaGem,
            subContent: [{
                title: 'tree',
                name: 'ds-tree',
                icon: FaGem,
                subContent: []
            }]
        }
    ]

  return (
    <Router>
        <Routes>
            <Route path="/" element={<PageLayout />}>
                <Route path="" element={<Home />} />
                {
                    subjects.flatMap(test => {
                        return <Route path={`${test.name}`} element={<MarkdownRender />} />
                    })
                }
                <Route path='*' element={<NotFound />} />
            </Route>
        </Routes>
    </Router>
  )
}