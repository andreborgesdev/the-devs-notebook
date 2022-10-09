import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { PageLayout } from './pages/PageLayout';
import { NotFound } from './pages/NotFound';
import { MarkdownRender } from './components/MarkdownRender';
import { Content, ContentItem } from './data/Content';
import parse, { HTMLReactParserOptions, domToReact }  from 'html-react-parser';
import { ReactNode } from 'react';

export const MyCustomRouter = () => {

    function getAllContent(contentItem: ContentItem[]): string {
        let result: string = ""
    
        contentItem.forEach(it => {
            if (it.subContent !== undefined && it.subContent.length > 0) {
                result += `<Route path='${it.link}'> 
                                <MarkdownRender contentTitle='${it.title}' contentLink='${it.link}' contentIcon='${it.icon}' /> 
                            </Route>`
                result += getAllContent(it.subContent)
            } else {
                result += `<Route path='${it.link}'> 
                                <MarkdownRender contentTitle='${it.title}' contentLink='${it.link}' contentIcon='${it.icon}' />
                            </Route>`
            }
        })
        
        return result;
    }

    const options: HTMLReactParserOptions = {
        replace: ({ name, attribs, children }: any) => {
            if (!name) return;
    
            if (name === "route") {
                return (
                    <Route  path={`${attribs.path}`} 
                            element={domToReact(children, options)}
                    />
                )
            }

            if (name === "markdownrender") {
                return <MarkdownRender  
                    contentTitle={`${attribs.contenttitle}`} 
                    contentLink={`${attribs.contentlink}`} 
                    contentIcon={`${attribs.contenticon}`}
                />
            }
        }
    }

  return (
    <Router>
        <Routes>
            <Route path="/" element={<PageLayout />}>
                <Route path="" element={<Home />} />
                {
                    parse(getAllContent(Content), options)
                }
                <Route path='*' element={<NotFound />} />
            </Route>
        </Routes>
    </Router>
  )
}