'use client';

import React, { memo } from 'react';

import { TextSelection } from '@/hooks/use-text-selection';

import { Languages } from 'lucide-react';

import TooltipCustom from '../custom/TooltipCustom';
import { Button } from '../ui/button';

interface TextSelectionModalProps {
  selection: TextSelection;
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  setOpen: (value: boolean) => void;
}

const TextSelectionModal = ({ selection, tooltipRef, setOpen }: TextSelectionModalProps) => {
  if (!selection.position) {
    return null;
  }

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    selection.saveSelection(); // Lưu text trước khi mở modal
    setOpen(true);
  };

  return (
    <div
      ref={tooltipRef}
      data-state={selection.isSelected ? 'visible' : 'hidden'}
      style={{
        position: 'absolute',
        left: `${selection.position.left}px`,
        top: `${selection.position.top}px`,
        transform: 'translate(-100%, -100%)',
      }}
    >
      <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-lg">
        <TooltipCustom content="Dịch từ và lưu vào list từ" side="top">
          <Button size={'sm'} variant={'primary-outline'} type="button" onClick={handleOpenModal}>
            <Languages />
            <span>Dịch</span>
          </Button>
        </TooltipCustom>
      </div>
    </div>
  );
};

export default memo(TextSelectionModal);
