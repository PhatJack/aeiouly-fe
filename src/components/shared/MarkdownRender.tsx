import React from 'react';
import ReactMarkdown from 'react-markdown';
import ReactMarkdownTyper, { MarkdownTyperProps } from 'react-markdown-typer';

import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

interface MarkdownRenderProps {
  children?: string;
  autoStartTyping?: boolean;
  disableTyping?: boolean;
}

const MarkdownRender: React.FC<MarkdownRenderProps> = ({
  children,
  autoStartTyping = true,
  disableTyping = false,
}) => {
  return (
    <ReactMarkdownTyper
      reactMarkdownProps={{
        remarkPlugins: [remarkGfm, remarkBreaks],
      }}
      autoStartTyping={autoStartTyping}
      disableTyping={disableTyping}
      interval={30}
    >
      {children}
    </ReactMarkdownTyper>
  );
};

export default MarkdownRender;
