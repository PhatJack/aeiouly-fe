import React from 'react';
import ReactMarkdown from 'react-markdown';
import ReactMarkdownTyper from 'react-markdown-typer';

import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

interface MarkdownRenderProps {
  children?: string;
}

const MarkdownRender: React.FC<MarkdownRenderProps> = ({ children }) => {
  return (
    <ReactMarkdownTyper
      reactMarkdownProps={{
        remarkPlugins: [remarkGfm, remarkBreaks],
      }}
      autoStartTyping={true}
      interval={30}
    >
      {children}
    </ReactMarkdownTyper>
  );
};

export default MarkdownRender;
