import React from 'react';

import { useEditorState } from '@tiptap/react';

import { IconName } from 'lucide-react/dynamic';

import { type TextAlignType, canSetTextAlign, isTextAlignActive } from '../../hooks/use-text-align';
import { MenuButton } from '../menu-button';
import { useTiptapEditor } from '../provider';
import { PopoverClose } from '../ui/popover';
import { Toolbar } from '../ui/toolbar';
import AlignCenterButton from './align-center-button';
import AlignJustifyButton from './align-justify-button';
import AlignLeftButton from './align-left-button';
import AlignRightButton from './align-right-button';

const ALIGNMENTS: TextAlignType[] = ['left', 'center', 'right', 'justify'];

const ALIGN_ICONS: Record<TextAlignType, IconName> = {
  left: 'align-left',
  right: 'align-right',
  center: 'align-center',
  justify: 'align-justify',
};

const TextAlignPopover = () => {
  const { editor } = useTiptapEditor();

  const editorState = useEditorState({
    editor,
    selector({ editor }) {
      const current = ALIGNMENTS.find((align) => isTextAlignActive(editor, align)) ?? 'left';
      const canSetAny = ALIGNMENTS.some((align) => canSetTextAlign(editor, align));
      return { current, canSetAny };
    },
  });

  const { current, canSetAny } = editorState ?? {
    current: 'left',
    canSetAny: false,
  };

  return (
    <MenuButton
      type="popover"
      icon={ALIGN_ICONS[current]}
      tooltip="Alignment"
      disabled={!canSetAny}
    >
      <PopoverClose asChild>
        <Toolbar dense>
          <AlignLeftButton />
          <AlignCenterButton />
          <AlignRightButton />
          <AlignJustifyButton />
        </Toolbar>
      </PopoverClose>
    </MenuButton>
  );
};

export default TextAlignPopover;
