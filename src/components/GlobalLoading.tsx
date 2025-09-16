'use client';

import React from 'react';

import { useIsFetching, useIsMutating } from '@tanstack/react-query';

import Loading from './Loading';

const GlobalQueryLoading = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  if (!isFetching && !isMutating) return null;

  return <Loading />;
};

export default GlobalQueryLoading;
