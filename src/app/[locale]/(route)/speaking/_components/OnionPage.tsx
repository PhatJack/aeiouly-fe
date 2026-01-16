'use client';

import React, { useCallback, useState } from 'react';

import { useTranslations } from 'next-intl';

import PageHeader from '@/components/PageHeader';
import {
  SpeakingSampleScenarios,
  SpeakingScenario,
} from '@/components/app/onion/SpeakingSampleScenarios';
import { SpeakingSessionForm } from '@/components/app/onion/SpeakingSessionForm';
import { SpeakingSessionList } from '@/components/app/onion/SpeakingSessionList';

const OnionPage = () => {
  const t = useTranslations('speaking');
  const [selectedScenario, setSelectedScenario] = useState<SpeakingScenario | null>(null);

  const handleSelectScenario = useCallback((scenario: SpeakingScenario) => {
    setSelectedScenario(scenario);
  }, []);

  return (
    <div className="min-h-screen space-y-4">
      <PageHeader
        title={t('page.title')}
        description={t('page.description')}
        icon="/sidebarIcon/microphone.png"
        iconAlt="Microphone icon"
        ringColor="ring-green-600"
        stats={[
          { label: t('page.stats.scenarios'), value: 8, isLive: true },
          { label: '', value: t('page.stats.levels') },
        ]}
      />

      {/* Content */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <SpeakingSessionList />
          <SpeakingSampleScenarios onSelect={handleSelectScenario} />
        </div>
        <div className="row-start-1 space-y-2 lg:col-span-1 lg:row-start-auto">
          <h2 className="text-xl font-bold lg:text-2xl">{t('page.customScenario')}</h2>
          <SpeakingSessionForm
            initialValues={
              selectedScenario
                ? {
                    my_character: selectedScenario.my_character,
                    ai_character: selectedScenario.ai_character,
                    ai_gender: selectedScenario.ai_gender,
                    scenario: selectedScenario.scenario,
                    level: selectedScenario.level,
                  }
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
};

export default OnionPage;
