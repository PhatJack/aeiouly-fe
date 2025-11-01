import { ReactNode, createContext, useContext, useMemo, useState } from 'react';

import { type Editor, EditorContent } from '@tiptap/react';

import { getEditorContent } from '../helpers/tiptap';
import { cn } from '../helpers/utils';

type TiptapContextType = {
  editor: Editor;
  isFullScreen: boolean;
  isSourceMode: boolean;
  toggleFullScreen: () => void;
  toggleSourceMode: () => void;
};

const TiptapContext = createContext<TiptapContextType>({} as TiptapContextType);
export const useTiptapEditor = () => useContext(TiptapContext);

type TiptapProviderProps = {
  editor: Editor;
  slotBefore?: ReactNode;
  slotAfter?: ReactNode;
  children?: ReactNode;
};

export const TiptapProvider = ({
  editor,
  children,
  slotBefore,
  slotAfter,
}: TiptapProviderProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSourceMode, setIsSourceMode] = useState(false);

  const providerValue = useMemo(
    () => ({
      editor,
      isFullScreen,
      isSourceMode,
      toggleFullScreen: () => setIsFullScreen((prev) => !prev),
      toggleSourceMode: () => setIsSourceMode((prev) => !prev),
    }),
    [editor, isFullScreen, isSourceMode]
  );

  return (
    <TiptapContext value={providerValue}>
      <div className={cn('rte-editor', { 'rte-editor--fullscreen': isFullScreen })}>
        {slotBefore}
        <EditorContent editor={editor} className="rte-editor__container" />
        {slotAfter}
        {children}
      </div>
    </TiptapContext>
  );
};

export default TiptapProvider;
