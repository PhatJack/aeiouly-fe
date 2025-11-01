import React from 'react';

import { MenuButton } from '../menu-button';
import { useTiptapEditor } from '../provider';
import { DropdownMenuItem } from '../ui/dropdown';

const InsertDropdown = () => {
  const { editor } = useTiptapEditor();

  const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();

  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();

  const insertYoutube = () => {
    const src = prompt('Embed Youtube Video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    if (src) {
      editor.chain().focus().setYoutubeVideo({ src }).run();
    }
  };

  return (
    <MenuButton
      type="dropdown"
      tooltip="Insert"
      disabled={!editor?.isEditable}
      icon="plus"
      dropdownStyle={{ minWidth: '8rem' }}
    >
      <DropdownMenuItem asChild>
        <MenuButton
          text="Blockquote"
          hideText={false}
          tooltip={false}
          icon="quote"
          onClick={toggleBlockquote}
        />
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <MenuButton
          text="Code block"
          hideText={false}
          tooltip={false}
          icon="code"
          onClick={toggleCodeBlock}
        />
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <MenuButton
          text="Youtube"
          hideText={false}
          tooltip={false}
          icon="youtube"
          onClick={insertYoutube}
        />
      </DropdownMenuItem>
    </MenuButton>
  );
};

export default InsertDropdown;
