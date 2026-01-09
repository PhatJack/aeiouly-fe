import React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DropdownCustomProps<T> {
  children: React.ReactNode;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}

function DropdownCustom<T>({ children, items, renderItem }: DropdownCustomProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent>
        {items.map((item, index) => (
          <DropdownMenuItem key={index}>{renderItem(item, index)}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DropdownCustom;
