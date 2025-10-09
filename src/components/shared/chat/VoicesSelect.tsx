import React from 'react';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSpeechContext } from '@/contexts/SpeechContext';

const VoicesSelect = () => {
  const { voices, selectedVoice, setSelectedVoice } = useSpeechContext();

  return voices.length < 1 ? null : (
    <div className="invisible w-1/2 space-y-4 pl-4 md:visible">
      <Label className="text-foreground">Giọng nói</Label>
      <Select
        value={selectedVoice || ''}
        onValueChange={(voiceName) => {
          console.log(voiceName);
          setSelectedVoice(voiceName);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {voices.map((voice, i) => (
            <SelectItem key={`voice-${i}`} value={voice.name}>
              {voice.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default React.memo(VoicesSelect);
