import React, { useCallback } from 'react';

import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn, getLevelColor } from '@/lib/utils';

import {
  Briefcase,
  Coffee,
  GraduationCap,
  Heart,
  MessageCircle,
  Plane,
  ShoppingCart,
  Users,
} from 'lucide-react';

export interface SpeakingScenario {
  id: number;
  icon: React.ReactNode;
  my_character: string;
  ai_character: string;
  scenario: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  ai_gender: 'male' | 'female';
}

interface SpeakingSampleScenariosProps {
  onSelect: (scenario: SpeakingScenario) => void;
}

export const SpeakingSampleScenarios: React.FC<SpeakingSampleScenariosProps> = ({ onSelect }) => {
  const t = useTranslations('speaking');
  const handleSelect = useCallback(
    (scenario: SpeakingScenario) => {
      onSelect(scenario);
    },
    [onSelect]
  );

  const scenarios: SpeakingScenario[] = [
    {
      id: 1,
      icon: <Coffee className="h-6 w-6" />,
      my_character: t('scenarios.coffeeShop.myCharacter'),
      ai_character: t('scenarios.coffeeShop.aiCharacter'),
      scenario: t('scenarios.coffeeShop.scenario'),
      level: 'A2',
      ai_gender: 'female',
    },
    {
      id: 2,
      icon: <Briefcase className="h-6 w-6" />,
      my_character: t('scenarios.jobInterview.myCharacter'),
      ai_character: t('scenarios.jobInterview.aiCharacter'),
      scenario: t('scenarios.jobInterview.scenario'),
      level: 'B2',
      ai_gender: 'male',
    },
    {
      id: 3,
      icon: <Heart className="h-6 w-6" />,
      my_character: t('scenarios.firstDate.myCharacter'),
      ai_character: t('scenarios.firstDate.aiCharacter'),
      scenario: t('scenarios.firstDate.scenario'),
      level: 'B1',
      ai_gender: 'female',
    },
    {
      id: 4,
      icon: <GraduationCap className="h-6 w-6" />,
      my_character: t('scenarios.presentation.myCharacter'),
      ai_character: t('scenarios.presentation.aiCharacter'),
      scenario: t('scenarios.presentation.scenario'),
      level: 'C1',
      ai_gender: 'male',
    },
    {
      id: 5,
      icon: <Plane className="h-6 w-6" />,
      my_character: t('scenarios.airport.myCharacter'),
      ai_character: t('scenarios.airport.aiCharacter'),
      scenario: t('scenarios.airport.scenario'),
      level: 'B1',
      ai_gender: 'female',
    },
    {
      id: 6,
      icon: <Users className="h-6 w-6" />,
      my_character: t('scenarios.teamMeeting.myCharacter'),
      ai_character: t('scenarios.teamMeeting.aiCharacter'),
      scenario: t('scenarios.teamMeeting.scenario'),
      level: 'B2',
      ai_gender: 'male',
    },
    {
      id: 7,
      icon: <ShoppingCart className="h-6 w-6" />,
      my_character: t('scenarios.shopping.myCharacter'),
      ai_character: t('scenarios.shopping.aiCharacter'),
      scenario: t('scenarios.shopping.scenario'),
      level: 'A2',
      ai_gender: 'female',
    },
    {
      id: 8,
      icon: <MessageCircle className="h-6 w-6" />,
      my_character: t('scenarios.doctorVisit.myCharacter'),
      ai_character: t('scenarios.doctorVisit.aiCharacter'),
      scenario: t('scenarios.doctorVisit.scenario'),
      level: 'B1',
      ai_gender: 'male',
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold lg:text-2xl">{t('sampleScenarios.title')}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {scenarios.map((s) => (
          <Card key={s.id} className="group flex flex-col justify-between p-4">
            <div className="flex items-start justify-between">
              <div className="bg-primary/10 group-hover:bg-primary/20 rounded-lg p-2 transition-colors">
                {s.icon}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground line-clamp-3 text-sm">{s.scenario}</p>
              <div className="text-xs opacity-70">
                {t('sampleScenarios.level')}{' '}
                <Badge
                  variant="outline"
                  className={cn('border font-semibold', getLevelColor(s.level))}
                >
                  {s.level}
                </Badge>
              </div>
              <div className="text-xs opacity-70">
                {t('sampleScenarios.gender')}{' '}
                <Badge variant="outline" className="border font-semibold">
                  {s.ai_gender === 'male' ? t('sampleScenarios.male') : t('sampleScenarios.female')}
                </Badge>
              </div>
            </div>
            <Button size="sm" onClick={() => handleSelect(s)} className="w-full">
              {t('sampleScenarios.select')}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
