import React from 'react';
import type { ReactElement } from 'react';

import { type Components } from 'rehype-react';

import CopyButton from './copy-button';
import HeadingWithAnchor from './heading-with-anchor';

interface PreProps {
  children?: React.ReactNode;
  [key: string]: any;
}

interface CodeProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

interface ImageProps {
  src: string;
  alt?: string;
  width: string | number;
  'data-width': string | number;
  'data-height': string | number;
  [key: string]: any;
}

export const components: Partial<Components> = {
  h2: (props) => <HeadingWithAnchor level={2} {...props} />,
  h3: (props) => <HeadingWithAnchor level={3} {...props} />,
  h4: (props) => <HeadingWithAnchor level={4} {...props} />,
  iframe: ({ ...props }) => (
    <iframe className="mx-auto aspect-video h-full w-full rounded-lg" />
    //  <div className="relative pt-[56.25%] rounded-lg overflow-hidden">
    //    <div className="absolute inset-0">
    //      <iframe {...props} allowFullScreen={true} className="w-full h-full" />
    //    </div>
    //  </div>
  ),
  pre: ({ children, ...props }: PreProps) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const code = (children as ReactElement).props.children;
    return (
      <div className="group not-prose relative overflow-hidden rounded-lg border border-[#d1d9e0] dark:border-[#3d444d]">
        <CopyButton code={String(code)} />
        <pre {...(props as any)}>{children}</pre>
      </div>
    );
  },
  table: (props: any) => (
    <table className="not-prose mx-auto w-full table-auto border-collapse text-sm" {...props} />
  ),
  tr: (props: any) => (
    <tr
      className="border-b border-b-[#d1d9e0] last:border-b-0 dark:border-b-[#3d444d]"
      {...props}
    />
  ),
  td: (props: any) => <td className="px-2.5 py-3.5" {...props} />,
  th: (props: any) => <td className="px-2.5 py-3.5 font-bold" {...props} />,
};
