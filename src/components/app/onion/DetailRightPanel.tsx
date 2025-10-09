'use client';

import React from 'react';

import BlockquoteCustom from '@/components/custom/BlockquoteCustom';
import VoicesSelect from '@/components/shared/chat/VoicesSelect';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRecorder } from '@/hooks/use-recorder';

const DetailRightPanel = () => {
  const { devices, stream, selectedDeviceId, setSelectedDeviceId } = useRecorder();

  const audioTrack = stream?.getAudioTracks()[0];
  const settings = audioTrack?.getSettings();

  const deviceOptions = devices.filter((device) => !!device.id);

  return (
    <div className="flex h-full w-full flex-col rounded-xl border bg-gray-50 p-4">
      {/* {audioBlob && <audio controls src={blobToAudio(audioBlob)} loop />} */}
      <div className="flex w-full items-center justify-between gap-2 border-b pb-4">
        {deviceOptions.length < 1 ? null : (
          <div className="invisible w-1/2 space-y-4 border-r pr-4 md:visible">
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
        )}
        <VoicesSelect />
      </div>
      <div className="flex flex-col gap-4 pt-4">
        <BlockquoteCustom
          variants="info"
          title="Tình huống"
          content="Bạn là một nhân viên chăm sóc khách hàng. Hãy giúp khách hàng giải quyết các vấn đề về sản phẩm và dịch vụ của công ty một cách nhanh chóng và hiệu quả."
        />
        <BlockquoteCustom
          variants="primary"
          title="Nhiệm vụ"
          content="Bạn là một nhân viên chăm sóc khách hàng. Hãy giúp khách hàng giải quyết các vấn đề về sản phẩm và dịch vụ của công ty một cách nhanh chóng và hiệu quả."
        />
      </div>
    </div>
  );
};

export default React.memo(DetailRightPanel);
