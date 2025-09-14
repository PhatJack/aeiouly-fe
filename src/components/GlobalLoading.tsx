'use client';

import React from 'react';

import { useIsFetching, useIsMutating } from '@tanstack/react-query';

import { LoaderPinwheel } from 'lucide-react';

const GlobalLoading = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  if (!isFetching && !isMutating) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <LoaderPinwheel className="animate-spin text-white" size={30} />
    </div>
  );
};

export default GlobalLoading;
