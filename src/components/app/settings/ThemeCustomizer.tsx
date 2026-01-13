'use client';

import React from 'react';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useThemeCustom } from '@/contexts/ThemeCustomContext';

import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const ThemeCustomizer = () => {
  const t = useTranslations('setting');

  const { currentPreset, presets, applyPreset, resetTheme } = useThemeCustom();

  const handlePresetChange = (presetName: string) => {
    applyPreset(presetName);
    toast.success(t('themeCustomizer.presetApplied'));
  };

  const handleReset = () => {
    resetTheme();
    toast.success(t('themeCustomizer.themeReset'));
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold">{t('themeCustomizer.title')}</Label>

      <div className="space-y-4">
        <RadioGroup
          value={currentPreset}
          onValueChange={handlePresetChange}
          className="grid grid-cols-2 gap-4"
        >
          {Object.keys(presets).map((presetName) => {
            const preset = presets[presetName];

            return (
              <Label
                key={presetName}
                htmlFor={presetName}
                className="hover:bg-muted has-[[data-state=checked]]:border-primary flex flex-1 cursor-pointer items-center gap-3 rounded-lg border p-3 transition"
              >
                <RadioGroupItem value={presetName} id={presetName} />
                <div className="font-medium">{preset.label || presetName}</div>
              </Label>
            );
          })}
        </RadioGroup>

        <Button variant="outline" size="lg" onClick={handleReset} className="w-full gap-2">
          <RotateCcw className="h-4 w-4" />
          {t('themeCustomizer.resetToDefault')}
        </Button>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
