'use client';

import React from 'react';

import { useIsFetching, useIsMutating } from '@tanstack/react-query';

import Loading from './Loading';

const GlobalQueryLoading = () => {
  const isFetching = useIsFetching({
    predicate: (query) => {
      return query.state.fetchStatus === 'fetching' && !query.meta?.ignoreGlobal;
    },
  });
  const isMutating = useIsMutating({
    predicate: (mutation) => {
      return !mutation.meta?.ignoreGlobal;
    },
  });

  if (!isFetching && !isMutating) return null;

  return <Loading />;
};

export default GlobalQueryLoading;
