import React from 'react';

import { DynamicIcon, IconName } from 'lucide-react/dynamic';

import { CellAlign } from '../../../hooks/use-table';
import { MenuButton } from '../../menu-button';
import Button from '../../ui/button';
import { PopoverClose } from '../../ui/popover';

interface AlignmentDropdownProps {
  toggleCellAlign: (align: CellAlign) => void;
}

export const AlignmentDropdown = ({ toggleCellAlign }: AlignmentDropdownProps) => {
  const alignments: {
    value: CellAlign;
    label: string;
    icon: IconName;
  }[] = [
    { value: 'top-left', label: 'Top Left', icon: 'align-start-vertical' },
    { value: 'top', label: 'Top', icon: 'align-vertical-justify-start' },
    { value: 'top-right', label: 'Top Right', icon: 'align-end-vertical' },
    { value: 'middle-left', label: 'Middle Left', icon: 'align-start-horizontal' },
    { value: 'middle', label: 'Middle', icon: 'align-vertical-justify-center' },
    { value: 'middle-right', label: 'Middle Right', icon: 'align-end-horizontal' },
    // { value: 'bottom-left', label: 'Bottom Left', icon: 'align-bottom-left' },
    // { value: 'bottom', label: 'Bottom', icon: 'align-vertical-justify-end' },
    // { value: 'bottom-right', label: 'Bottom Right', icon: 'align-bottom-right' },
  ] as const;

  return (
    <MenuButton
      type="popover"
      icon="align-center"
      dropdownClass="rte-table-align-dropdown"
      dropdownStyle={{}}
    >
      <div className="grid aspect-square grid-cols-3 grid-rows-3 gap-1.5 p-1.5">
        {alignments.map((alignment) => (
          <PopoverClose asChild key={`h-${alignment.value}`}>
            <Button
              variant="ghost"
              iconOnly={true}
              onClick={() => toggleCellAlign(alignment.value)}
            >
              <DynamicIcon name={alignment.icon} size={20} />
            </Button>
          </PopoverClose>
        ))}
      </div>
    </MenuButton>
  );
};

export default AlignmentDropdown;
