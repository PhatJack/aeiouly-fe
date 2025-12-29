import React from 'react';

import TooltipCustom from '@/components/custom/TooltipCustom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { formatTime, usePomodoroStore } from '@/hooks/use-pomodoro-store';
import { useSoloStore } from '@/hooks/use-solo-store';

import { Clock, Minus, OctagonAlert, Plus, X } from 'lucide-react';

import PomodoroPiP from './pomodoro-pip';

const Pomodoro: React.FC = () => {
  const {
    focusTime,
    breakTime,
    isRunning,
    isFocusMode,
    remainingTime,
    isLoopMode,
    isPaused,
    handleTimeChange,
    toggleTimer,
    resetTimer,
    setIsLoopMode,
    togglePause,
  } = usePomodoroStore();
  const { toggleButton } = useSoloStore();
  const { hours, minutes, seconds } = formatTime(remainingTime);

  return (
    <>
      {isRunning ? (
        <title>{` ${hours}:${minutes}:${seconds} - Không gian tự học | Aeiouly`}</title>
      ) : null}
      <div className="bg-background flex w-full flex-col space-y-3 rounded-md p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs">
            <Clock size={14} />
            <strong>Personal Timer</strong>
          </span>
          <div className="flex items-center gap-2">
            <TooltipCustom
              content={
                <p>
                  Tăng cường <strong>năng suất</strong> với một <strong>phiên tập trung</strong>,
                  sau đó là <strong>thời gian nghỉ</strong>. Bật chế độ{' '}
                  <strong>Vòng lặp (Loop)</strong> để tự động lặp lại chu trình.
                </p>
              }
            >
              <span className="cursor-pointer">
                <OctagonAlert size={16} />
              </span>
            </TooltipCustom>
            <span onClick={() => toggleButton('isOpenPomodoro')} className="cursor-pointer">
              <X size={16} />
            </span>
          </div>
        </div>
        {!isRunning ? (
          <div className="">
            <p className="mb-1 text-center text-xs">
              <strong>Focus time(min)</strong>
            </p>
            <div className="flex w-full items-center gap-2">
              <Button
                size={'icon'}
                variant={'ghost'}
                className="hover:text-primary aspect-square hover:bg-transparent"
                onClick={() => handleTimeChange({ type: 'focus', operation: 'subtract' })}
                disabled={isRunning}
              >
                <Minus size={26} />
              </Button>
              <div className="bg-secondary text-secondary-foreground flex w-full items-center justify-center space-x-1 rounded-full px-2 py-1 text-2xl font-semibold antialiased">
                <span>{formatTime(focusTime).hours}</span>
                <span className="mb-1">:</span>
                <span>{formatTime(focusTime).minutes}</span>
                <span className="mb-1">:</span>
                <span>{formatTime(focusTime).seconds}</span>
              </div>
              <Button
                size={'icon'}
                variant={'ghost'}
                className="hover:text-primary aspect-square hover:bg-transparent"
                onClick={() => handleTimeChange({ type: 'focus', operation: 'add' })}
                disabled={isRunning}
              >
                <Plus size={26} />
              </Button>
            </div>
            <p className="mt-3 mb-1 text-center text-xs">
              <strong>Break time(min)</strong>
            </p>
            <div className="flex w-full items-center gap-2">
              <Button
                size={'icon'}
                variant={'ghost'}
                className="hover:text-primary aspect-square hover:bg-transparent"
                onClick={() => handleTimeChange({ type: 'break', operation: 'subtract' })}
                disabled={isRunning}
              >
                <Minus size={26} />
              </Button>
              <div className="bg-secondary text-secondary-foreground flex w-full items-center justify-center space-x-1 rounded-full px-2 py-1 text-2xl font-semibold antialiased">
                <span>{formatTime(breakTime).hours}</span>
                <span className="mb-1">:</span>
                <span>{formatTime(breakTime).minutes}</span>
                <span className="mb-1">:</span>
                <span>{formatTime(breakTime).seconds}</span>
              </div>
              <Button
                size={'icon'}
                variant={'ghost'}
                className="hover:text-primary aspect-square hover:bg-transparent"
                onClick={() => handleTimeChange({ type: 'break', operation: 'add' })}
                disabled={isRunning}
              >
                <Plus size={26} />
              </Button>
            </div>
          </div>
        ) : null}
        {!isRunning ? (
          <div className="!mt-4 flex items-center space-x-2">
            <Switch
              id="loop-mode"
              className="data-[state=unchecked]:bg-gray-500"
              checked={isLoopMode}
              onCheckedChange={setIsLoopMode}
            />
            <Label htmlFor="loop-mode">Vòng lặp</Label>
          </div>
        ) : null}
        <div className="flex flex-col gap-2">
          {isRunning ? (
            <div className="mt-4">
              <div className="text-center text-sm font-bold">
                {isFocusMode ? 'Focus Time' : 'Break Time'}
              </div>
              <div className="text-center text-3xl font-bold">
                {hours}:{minutes}:{seconds}
              </div>
            </div>
          ) : null}
          {!isRunning ? (
            <Button className="font-semibold" onClick={toggleTimer}>
              Bắt đầu
            </Button>
          ) : (
            <Button
              className="font-semibold"
              variant={isPaused ? 'default' : 'secondary'}
              onClick={togglePause}
            >
              {isPaused ? 'Tiếp tục' : 'Tạm dừng'}
            </Button>
          )}
          {isRunning && (
            <Button variant="outline" className="font-semibold" onClick={resetTimer}>
              Reset thời gian
            </Button>
          )}
          <PomodoroPiP />
        </div>
      </div>
    </>
  );
};

export default React.memo(Pomodoro);
