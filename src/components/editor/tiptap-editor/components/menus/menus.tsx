import React, { useEffect, useState } from 'react';

import { Transaction } from '@tiptap/pm/state';
import { useEditorState } from '@tiptap/react';

import { getAncestorBoundingRect, getSelectionBoundingRect } from '../../helpers/tiptap';
import { isCodeBlockActive } from '../../hooks/use-code-block';
import { isLinkActive } from '../../hooks/use-link';
import { isTableActive } from '../../hooks/use-table';
import { BubbleMenu } from '../bubble-menu';
import { useTiptapEditor } from '../provider';
import { LinkMenu } from './link-menu';
import { TableMenu } from './table-menu';

export const Menus = () => {
  const { editor } = useTiptapEditor();
  const [hideBubbleMenu, setHideBubbleMenu] = useState(false);

  const activeMenu = useEditorState({
    editor,
    selector({ editor }) {
      if (isLinkActive(editor)) return 'link';
      if (isCodeBlockActive(editor)) return 'codeBlock';
      if (isTableActive(editor) && !editor.state.selection.empty) return 'table';

      return null;
    },
  });

  const menuConfig = React.useMemo(() => {
    switch (activeMenu) {
      case 'table':
      case 'codeBlock':
        return {
          placement: 'top' as const,
          getReferenceClientRect: getAncestorBoundingRect,
        };
      case 'link':
        return {
          placement: 'bottom-start' as const,
          getReferenceClientRect: getSelectionBoundingRect,
        };
      default:
        return null;
    }
  }, [activeMenu]);

  useEffect(() => {
    if (!editor) return;

    const onTransaction = ({ transaction }: { transaction: Transaction }) => {
      setHideBubbleMenu(transaction.getMeta('hideBubbleMenu'));
    };

    editor.on('transaction', onTransaction);
    return () => {
      editor.off('transaction', onTransaction);
    };
  }, [editor]);

  return (
    <BubbleMenu
      placement={menuConfig?.placement}
      shouldShow={!hideBubbleMenu && activeMenu !== null}
      getReferenceClientRect={menuConfig?.getReferenceClientRect}
    >
      {activeMenu === 'link' && <LinkMenu />}
      {activeMenu === 'table' && <TableMenu />}
    </BubbleMenu>
  );
};

export default Menus;
