'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type Position = {
  left: number;
  top: number;
};

export type TextSelection = {
  selectedText: string | null;
  position: Position | null;
  selectionStart: number | null;
  selectionEnd: number | null;
  isSelected: boolean;
  element: HTMLElement | null;
  persistedText: string | null;
  saveSelection: () => void;
  clearPersistedText: () => void;
};

type UseTextSelectionOptions = {
  onSelectionChange?: (selection: TextSelection) => void;
  offsetLeft?: number;
  offsetTop?: number;
  ref?: React.RefObject<HTMLElement | null>;
  tooltipRef?: React.RefObject<HTMLDivElement | null>;
};

const useTextSelection = (options?: UseTextSelectionOptions): TextSelection => {
  const [selection, setSelection] = useState<
    Omit<TextSelection, 'persistedText' | 'saveSelection' | 'clearPersistedText'>
  >({
    selectedText: null,
    position: null,
    selectionStart: null,
    selectionEnd: null,
    isSelected: false,
    element: null,
  });

  const [persistedText, setPersistedText] = useState<string | null>(null);

  const scrollTimeoutRef = useRef<number | null>(null);
  const selectionRef = useRef<{
    start: number | null;
    end: number | null;
    text: string | null;
    element: HTMLElement | null;
  }>({
    start: null,
    end: null,
    text: null,
    element: null,
  });

  const getCaretPosition = useCallback((): Position | null => {
    const windowSelection = window.getSelection();
    if (!windowSelection || windowSelection.rangeCount === 0) {
      return null;
    }

    const range = windowSelection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    if (rect.width === 0 && rect.height === 0) {
      return null;
    }

    // Position at the center-top of the selection
    // Add scroll offsets to make it absolute positioning
    return {
      left: rect.left + window.scrollX + rect.width / 2 + (options?.offsetLeft ?? 0),
      top: rect.top + window.scrollY + (options?.offsetTop ?? 0),
    };
  }, [options?.offsetLeft, options?.offsetTop]);

  const saveSelection = useCallback(() => {
    if (selection.selectedText) {
      setPersistedText(selection.selectedText);
    }
  }, [selection.selectedText]);

  const clearPersistedText = useCallback(() => {
    setPersistedText(null);
  }, []);

  const clearSelection = useCallback(() => {
    const newSelection: Omit<
      TextSelection,
      'persistedText' | 'saveSelection' | 'clearPersistedText'
    > = {
      selectedText: null,
      position: null,
      selectionStart: null,
      selectionEnd: null,
      isSelected: false,
      element: null,
    };
    setSelection(newSelection);
    selectionRef.current = {
      start: null,
      end: null,
      text: null,
      element: null,
    };
    options?.onSelectionChange?.({
      ...newSelection,
      persistedText,
      saveSelection,
      clearPersistedText,
    });
  }, [options?.onSelectionChange, persistedText, saveSelection, clearPersistedText]);

  const isDialogOpen = useCallback((): boolean => {
    // Check if any dialog is currently open by looking for visible dialog content
    const dialogContent = document.querySelector('[data-slot="dialog-content"]');
    const dialogPortal = document.querySelector('[data-slot="dialog-portal"]');
    const activeElement = document.activeElement as HTMLElement;

    // Check if active element is inside a dialog or dialog trigger
    if (activeElement) {
      const isInDialog = !!(
        activeElement.closest('[data-slot="dialog"]') ||
        activeElement.closest('[data-slot="dialog-content"]') ||
        activeElement.closest('[data-slot="dialog-portal"]') ||
        activeElement.closest('[data-slot="dialog-trigger"]') ||
        activeElement.closest('[role="dialog"]')
      );
      if (isInDialog) return true;

      // Also check if active element is inside the tooltip (which contains the dialog trigger button)
      if (options?.tooltipRef?.current?.contains(activeElement)) {
        return true;
      }
    }

    // Check if dialog content/portal exists and is visible
    return !!(
      (dialogContent && dialogContent.getBoundingClientRect().width > 0) ||
      (dialogPortal && dialogPortal.getBoundingClientRect().width > 0)
    );
  }, [options?.tooltipRef]);

  const updateSelection = useCallback(() => {
    const windowSelection = window.getSelection();
    if (!windowSelection) {
      clearSelection();
      return;
    }

    const selectedText = windowSelection.toString().trim();
    if (!selectedText) {
      clearSelection();
      return;
    }

    const range = windowSelection.rangeCount > 0 ? windowSelection.getRangeAt(0) : null;
    if (!range) {
      clearSelection();
      return;
    }

    // Check if selection is within the ref container
    if (options?.ref?.current) {
      const container = options.ref.current;
      const startNode = range.startContainer;
      const endNode = range.endContainer;

      // Check if both start and end nodes are within the container
      const isStartInside = container.contains(startNode);
      const isEndInside = container.contains(endNode);

      if (!isStartInside || !isEndInside) {
        clearSelection();
        return;
      }
    }

    const activeElement = range.commonAncestorContainer.parentElement;
    const position = getCaretPosition();

    const start = range.startOffset;
    const end = range.endOffset;

    selectionRef.current = {
      start,
      end,
      text: selectedText,
      element: activeElement,
    };

    const newSelection: Omit<
      TextSelection,
      'persistedText' | 'saveSelection' | 'clearPersistedText'
    > = {
      selectedText,
      position,
      selectionStart: start,
      selectionEnd: end,
      isSelected: true,
      element: activeElement,
    };

    setSelection(newSelection);
    options?.onSelectionChange?.({
      ...newSelection,
      persistedText,
      saveSelection,
      clearPersistedText,
    });
  }, [getCaretPosition, clearSelection, options?.onSelectionChange, options?.ref]);

  const handleSelection = useCallback(() => {
    requestAnimationFrame(updateSelection);
  }, [updateSelection]);

  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current !== null) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    if (selectionRef.current.text) {
      updateSelection();
    }
  }, [updateSelection]);

  const handleResize = useCallback(() => {
    if (scrollTimeoutRef.current !== null) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    if (selectionRef.current.text) {
      updateSelection();
    }
  }, [updateSelection]);

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        target.closest('[data-slot="dialog"]') ||
        target.closest('[data-slot="dialog-portal"]') ||
        target.closest('[data-slot="dialog-content"]') ||
        target.closest('[data-slot="dialog-overlay"]') ||
        target.closest('[data-slot="dialog-trigger"]') ||
        target.closest('[data-slot="dialog-close"]') ||
        target.closest('[role="dialog"]') ||
        target.closest('[data-radix-portal]')
      ) {
        return;
      }

      if (options?.ref?.current?.contains(target)) return;
      if (options?.tooltipRef?.current?.contains(target)) return;

      clearSelection();
    },
    [clearSelection, options?.ref, options?.tooltipRef]
  );

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelection);
    document.addEventListener('click', handleMouseDown);
    document.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      document.removeEventListener('selectionchange', handleSelection);
      document.removeEventListener('click', handleMouseDown);
      document.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleSelection]);

  return {
    ...selection,
    persistedText,
    saveSelection,
    clearPersistedText,
  };
};

export default useTextSelection;
