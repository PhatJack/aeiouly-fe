import React from 'react';

import { useEditorState } from '@tiptap/react';

import { type MarkType, canToggleMark, isMarkActive } from '../../hooks/use-mark';
import { MenuButton } from '../menu-button';
import { useTiptapEditor } from '../provider';
import { PopoverClose } from '../ui/popover';
import { Toolbar } from '../ui/toolbar';
import CodeButton from './code-button';
import StrikeButton from './strike-button';
import SubscriptButton from './subscript-button';
import SuperscriptButton from './superscript-button';

const MORE_MARKS: MarkType[] = ['strike', 'superscript', 'subscript', 'code'];

const MoreFormatPopover = () => {
  const { editor } = useTiptapEditor();

  const editorState = useEditorState({
    editor,
    selector({ editor }) {
      const isAnyActive = MORE_MARKS.some((mark) => isMarkActive(editor, mark));
      const canToggleAny = MORE_MARKS.some((mark) => canToggleMark(editor, mark));

      return {
        isAnyActive,
        canToggleAny,
      };
    },
  });

  return (
    <MenuButton
      type="popover"
      icon="more-horizontal"
      tooltip="More format"
      active={editorState?.isAnyActive}
      disabled={!editorState?.canToggleAny}
    >
      <PopoverClose asChild>
        <Toolbar dense>
          <StrikeButton />
          <SuperscriptButton />
          <SubscriptButton />
          <CodeButton />
        </Toolbar>
      </PopoverClose>
    </MenuButton>
  );
};

export default MoreFormatPopover;
