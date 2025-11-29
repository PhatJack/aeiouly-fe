import React from 'react';
import ReactMarkdownTyper from 'react-markdown-typer';

import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

interface MarkdownRenderProps {
  children?: string;
  autoStartTyping?: boolean;
  disableTyping?: boolean;
  interval?: number;
}

const MarkdownRender: React.FC<MarkdownRenderProps> = ({
  children,
  autoStartTyping = true,
  disableTyping = false,
  interval = 30,
}) => {
  return (
    <ReactMarkdownTyper
      reactMarkdownProps={{
        remarkPlugins: [remarkGfm, remarkBreaks],
      }}
      autoStartTyping={autoStartTyping}
      disableTyping={disableTyping}
      interval={interval}
    >
      {children}
    </ReactMarkdownTyper>
  );
};

export default MarkdownRender;
