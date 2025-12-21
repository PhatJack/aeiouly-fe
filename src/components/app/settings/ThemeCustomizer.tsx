'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useThemeCustom } from '@/contexts/ThemeCustomContext';

import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const ThemeCustomizer = () => {
  const { currentPreset, presets, applyPreset, resetTheme } = useThemeCustom();

  const handlePresetChange = (presetName: string) => {
    applyPreset(presetName);
    toast.success('Đã áp dụng theme preset');
  };

  const handleReset = () => {
    resetTheme();
    toast.success('Đã reset về theme mặc định');
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold">Chủ đề</Label>

      <div className="space-y-4">
        <RadioGroup
          value={currentPreset}
          onValueChange={handlePresetChange}
          className="grid grid-cols-2 gap-4"
        >
          {Object.keys(presets).map((presetName) => {
            const preset = presets[presetName];

            return (
              <div
                key={presetName}
                className="hover:bg-muted flex items-center gap-3 rounded-lg border p-3 transition"
              >
                <RadioGroupItem value={presetName} id={presetName} />

                <Label htmlFor={presetName} className="flex-1 cursor-pointer">
                  <div className="font-medium">{preset.label || presetName}</div>
                  {preset.label && (
                    <div className="text-muted-foreground text-sm">{preset.label}</div>
                  )}
                </Label>
              </div>
            );
          })}
        </RadioGroup>

        <Button variant="outline" size="lg" onClick={handleReset} className="w-full gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset về mặc định
        </Button>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
