'use client';

import React, { useCallback, useState } from 'react';

import PageHeader from '@/components/PageHeader';
import {
  SpeakingSampleScenarios,
  SpeakingScenario,
} from '@/components/app/onion/SpeakingSampleScenarios';
import { SpeakingSessionForm } from '@/components/app/onion/SpeakingSessionForm';
import { SpeakingSessionList } from '@/components/app/onion/SpeakingSessionList';

const OnionPage = () => {
  const [selectedScenario, setSelectedScenario] = useState<SpeakingScenario | null>(null);

  const handleSelectScenario = useCallback((scenario: SpeakingScenario) => {
    setSelectedScenario(scenario);
  }, []);

  return (
    <div className="min-h-screen space-y-4">
      <PageHeader
        title="Luyện Nói"
        description="Thực hành giao tiếp tiếng Anh trong các tình huống thực tế với AI Coach thông minh"
        icon="/sidebarIcon/microphone.png"
        iconAlt="Microphone icon"
        ringColor="ring-green-600"
        stats={[
          { label: 'tình huống mẫu', value: 8, isLive: true },
          { label: '', value: 'CEFR A1 - C2' },
        ]}
      />

      {/* Content */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <SpeakingSampleScenarios onSelect={handleSelectScenario} />
          <SpeakingSessionList />
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold lg:text-2xl">Tự tạo tình huống</h2>
          <SpeakingSessionForm
            initialValues={
              selectedScenario
                ? {
                    my_character: selectedScenario.my_character,
                    ai_character: selectedScenario.ai_character,
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
