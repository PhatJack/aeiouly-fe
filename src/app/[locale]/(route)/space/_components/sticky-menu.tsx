'use client';

import React, { useCallback } from 'react';

import { useTranslations } from 'next-intl';

import TooltipCustom from '@/components/custom/TooltipCustom';
import { Button } from '@/components/ui/button';
import { getMenuButton } from '@/constants/solo-button-menu';
import { formatTime, usePomodoroStore } from '@/hooks/use-pomodoro-store';
import { PanelType } from '@/hooks/use-solo-store';
import { useSoloStore } from '@/hooks/use-solo-store';
import { cn } from '@/lib/utils';

import { Clock, Expand, Minimize, Target } from 'lucide-react';

const StickyMenu = () => {
  const t = useTranslations('space');
  const { remainingTime } = usePomodoroStore();
  const { hours, minutes, seconds } = formatTime(remainingTime);
  const {
    activePanel,
    completedGoals,
    totalOpenGoals,
    isOpenFullScreen,
    toggleButton,
    setActivePanel,
    toggleFullScreen,
  } = useSoloStore();

  const toggleFullscreenHandler = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        toggleFullScreen(true);
      });
    } else if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        toggleFullScreen(false);
      });
    }
  };

  const handleClick = useCallback(
    (variable: PanelType) => {
      setActivePanel(variable);
    },
    [setActivePanel]
  );

  return (
    <div className="bg-background/95 border-border fixed right-0 bottom-0 left-0 z-50 flex w-full flex-col items-center justify-between gap-4 border-t p-4 md:relative md:flex-row md:border-t-0 md:bg-transparent md:p-0">
      {/* Timer and Goals */}
      <div className="flex w-full justify-between gap-4 md:w-auto md:justify-start md:gap-4">
        {/* Pomodoro */}
        <div
          onClick={() => toggleButton('isOpenPomodoro')}
          className="bg-background hover:bg-background/90 text-foreground flex h-full flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md px-3 py-1 shadow-lg md:flex-none md:px-4"
        >
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              <Clock size={14} />
            </div>
            <span className="text-xs leading-[1.15rem] font-medium">{t('buttons.pomodoro')}</span>
          </div>
          <p className="text-sm font-bold">
            <span>{hours}</span>
            <span className="mb-1">:</span>
            <span>{minutes}</span>
            <span className="mb-1">:</span>
            <span>{seconds}</span>
          </p>
        </div>

        {/* Study Goal */}
        <div
          onClick={() => toggleButton('isOpenSessionGoal')}
          className="bg-background hover:bg-background/90 text-foreground flex h-full flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md px-3 py-1 shadow-lg md:flex-none md:px-4"
        >
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              <Target size={14} />
            </div>
            <span className="text-xs leading-[1.15rem] font-medium">
              {t('buttons.sessionGoal')}
            </span>
          </div>
          <p className="text-sm">
            <strong>
              {completedGoals.length} / {totalOpenGoals}
            </strong>
          </p>
        </div>
      </div>

      {/* Menu Buttons */}
      <div className="flex w-full justify-between gap-4 md:w-auto md:justify-start md:gap-4">
        {getMenuButton(t).map((item, index) => (
          <TooltipCustom side="bottom" content={item.label} key={index}>
            <Button
              type="button"
              onClick={() => handleClick(item.variable)}
              className={cn(
                `bg-background h-10 w-10 shadow-lg md:h-12 md:w-12 md:[&_svg:not([class*='size-'])]:size-5`,
                activePanel === item.variable && 'bg-primary text-primary-foreground'
              )}
              variant={activePanel === item.variable ? 'default' : 'ghost'}
              size={'icon'}
            >
              <span className="text-lg md:text-xl">
                <item.icon />
              </span>
            </Button>
          </TooltipCustom>
        ))}
        <TooltipCustom side="bottom" content={t('buttons.fullscreen')}>
          <Button
            type="button"
            onClick={toggleFullscreenHandler}
            className="bg-background hover:bg-background/90 hover:text-foreground h-10 w-10 shadow-lg md:h-12 md:w-12 [&_svg]:size-4 md:[&_svg]:size-5"
            variant={'ghost'}
            size={'icon'}
          >
            <span className="text-lg md:text-xl">
              {!isOpenFullScreen ? <Expand /> : <Minimize />}
            </span>
          </Button>
        </TooltipCustom>
      </div>
    </div>
  );
};

export default React.memo(StickyMenu);
