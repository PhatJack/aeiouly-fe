'use client';

import { useEffect, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { useBlockNavigation } from '@/stores/use-block-navigation';

import ConfirmLeavePopup from './ConfirmLeavePopup';

export default function NavigationBlocker() {
  const router = useRouter();
  const pathname = usePathname();
  const { hasUnsavedChanges, setUnsaved } = useBlockNavigation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  // Handle browser back/forward and refresh
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // Required for Chrome
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

  // Handle internal link clicks
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    // Handle button clicks that might navigate
    const handleButtonClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const navigationElement = target.closest('[data-navigation]');

      if (!navigationElement) return;

      e.preventDefault();
      e.stopPropagation();
      setShowConfirm(true);
    };

    document.addEventListener('click', handleButtonClick, true);

    return () => {
      document.removeEventListener('click', handleButtonClick, true);
    };
  }, [hasUnsavedChanges, pathname]);

  if (!showConfirm) return null;

  return (
    <ConfirmLeavePopup
      onStay={() => {
        setShowConfirm(false);
        setPendingUrl(null);
      }}
      onLeave={() => {
        setUnsaved(false);
        setShowConfirm(false);

        if (pendingUrl) {
          router.push(pendingUrl);
        } else {
          router.back();
        }
      }}
    />
  );
}
