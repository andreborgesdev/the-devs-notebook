import { ReactNode, useEffect, useState } from "react"
import 'react-pro-sidebar/dist/css/styles.css'
import ReactMarkdown from 'react-markdown'
import { Spinner, Text } from "@chakra-ui/react"
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'

interface MarkdownRenderProps {
    contentTitle: string,
    contentLink: string,
    contentIcon: ReactNode | string
}

export const MarkdownRender = ({contentTitle, contentLink, contentIcon}: MarkdownRenderProps) => {
    const [markdown, setMarkdown] = useState("")
    const [loading, setLoading] = useState(false)

    function changePageTitle(contentTitle: string) {
        document.title = contentTitle
    }
    
    function changePageFavicon(contentIcon: ReactNode | string) {
        let link: any = document.querySelector("link[rel~='icon']")

        if (!link) {
            link = document.createElement('link')
            link.rel = 'icon'
            document.getElementsByTagName('head')[0].appendChild(link)
        }
        
        link.href = `data:image/svg+xml,
                        <svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>
                        ${contentIcon}
                        </text></svg>`
    }

    useEffect(() => {
        changePageTitle(contentTitle)
        changePageFavicon(contentIcon)

        setLoading(true);
        import(`../resources/${contentLink}.md`)
        .then(res => {
            fetch(res.default)
                .then(response => response.text())
                .then(text => {
                    setLoading(false)
                    setMarkdown(text)
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }, [contentIcon, contentLink, contentTitle])

    return (
        <>
            {
                loading ? 
                    <Spinner className="spinner" /> :
                    <ReactMarkdown components={ChakraUIRenderer()} children={markdown} skipHtml />
            }
        </>
    );
}
