'use client';

import React, { useCallback, useState } from 'react';

import BackgroundOptionsList from './background-options-list';
import BackgroundTypesList from './background-types-list';

const BackgroundContainer = () => {
  const [activeTab, setActiveTab] = useState<number>(1);

  const handleTabChange = useCallback((tab: number) => {
    setActiveTab(tab);
  }, []);

  return (
    <>
      <BackgroundTypesList activeTab={activeTab} setActiveTab={handleTabChange} />
      <BackgroundOptionsList activeTab={activeTab} />
    </>
  );
};

export default BackgroundContainer;
