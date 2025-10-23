import React from 'react';
import ReactMarkdown from 'react-markdown';

import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

interface MarkdownRenderProps {
  children?: string;
}

const MarkdownRender: React.FC<MarkdownRenderProps> = ({ children }) => {
  return <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{children}</ReactMarkdown>;
};

export default MarkdownRender;
