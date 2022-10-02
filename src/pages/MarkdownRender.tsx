import { useEffect, useState } from "react";
import 'react-pro-sidebar/dist/css/styles.css';
import ReactMarkdown from 'react-markdown'

interface MarkdownRenderProps {
    subjectToFetch: string
}

export const MarkdownRender = ({subjectToFetch}: MarkdownRenderProps) => {
    const [markdown, setMarkdown] = useState("")

    useEffect(() => {
        import(`../resources/${subjectToFetch}.md`)
        .then(res => {
            fetch(res.default)
                .then(response => response.text())
                .then(text => setMarkdown(text))
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }, [])

    return (
        <>
            <ReactMarkdown children={markdown} />
        </>
    );
}