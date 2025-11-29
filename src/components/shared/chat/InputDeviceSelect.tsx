import React from 'react';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRecorder } from '@/hooks/use-recorder';

const InputDeviceSelect = () => {
  const { devices, stream, selectedDeviceId, setSelectedDeviceId } = useRecorder();

  const audioTrack = stream?.getAudioTracks()[0];
  const settings = audioTrack?.getSettings();

  const deviceOptions = devices.filter((device) => !!device.id);

  return deviceOptions.length < 1 ? null : (
    <div className="invisible w-1/2 space-y-4 border-r px-4 py-2 md:visible">
      <Label className="text-foreground">Thiết bị đầu vào</Label>
      <Select
        onValueChange={(e) => setSelectedDeviceId(e)}
        value={selectedDeviceId || settings?.deviceId || 'preferred'}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="preferred">Thiết bị mặc định</SelectItem>
          {deviceOptions.map((device) => (
            <SelectItem key={device.id} value={device.id}>
              {device.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default React.memo(InputDeviceSelect);
