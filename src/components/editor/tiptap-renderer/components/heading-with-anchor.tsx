import React, { type JSX, type ReactNode } from 'react';

import Link from 'next/link';

interface HeadingWithAnchorProps {
  level: number;
  id?: string;
  children?: ReactNode;
}

const HeadingWithAnchor = ({ level, children, id }: HeadingWithAnchorProps) => {
  const Heading = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Heading id={id}>
      <Link
        href={`#${id}`}
        className="not-prose group font-inherit relative hover:before:absolute hover:before:top-1/2 hover:before:-left-6 hover:before:-translate-y-1/2 hover:before:text-[1em] hover:before:opacity-70 hover:before:content-['#']"
      >
        {children}
      </Link>
    </Heading>
  );
};

export default HeadingWithAnchor;
