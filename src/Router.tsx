import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { PageLayout } from './pages/PageLayout';
import { NotFound } from './pages/NotFound';
import { MarkdownRender } from './pages/MarkdownRender';
import { Content } from './data/Content';

export const MyCustomRouter = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<PageLayout />}>
                <Route path="" element={<Home />} />
                {
                    Content.flatMap(content => {
                        return <Route   path={`${content.link}`} 
                                        element={<MarkdownRender  
                                        contentTitle={`${content.title}`} 
                                        contentLink={`${content.link}`} 
                                        contentIcon={`${content.icon}`}
                                        />} 
                                />
                    })
                }
                <Route path='*' element={<NotFound />} />
            </Route>
        </Routes>
    </Router>
  )
}