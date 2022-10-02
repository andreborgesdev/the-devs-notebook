import { IconType } from 'react-icons';
import { FaGem } from 'react-icons/fa';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { PageLayout } from './pages/PageLayout';
import { NotFound } from './pages/NotFound';
import { MarkdownRender } from './pages/MarkdownRender';
import { Content } from './resources/Content';

export const MyCustomRouter = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<PageLayout />}>
                <Route path="" element={<Home />} />
                {
                    Content.flatMap(content => {
                        return <Route path={`${content.link}`} element={<MarkdownRender subjectToFetch={`${content.link}`} />} />
                    })
                }
                <Route path='*' element={<NotFound />} />
            </Route>
        </Routes>
    </Router>
  )
}