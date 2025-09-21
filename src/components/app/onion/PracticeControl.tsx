import React from 'react';

import { Button } from '@/components/ui/button';

import { MessageCircle, Mic, Play, Star } from 'lucide-react';

interface PracticeControlsProps {
  isRecording: boolean;
  onToggleRecording: () => void;
}

export const PracticeControls = ({ isRecording, onToggleRecording }: PracticeControlsProps) => (
  <div className="bg-background border-border rounded-lg border p-6">
    <div className="mb-4">
      <h3 className="text-foreground mb-2 text-xl font-semibold">Phiên luyện tập</h3>
      <p className="text-muted-foreground">Sử dụng AI Coach để luyện tập tình huống này</p>
    </div>

    <div className="space-y-4">
      <Button
        onClick={onToggleRecording}
        className={`h-16 w-full text-lg font-medium ${
          isRecording
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-primary hover:bg-primary/90 text-primary-foreground'
        }`}
      >
        <Mic className="mr-2 h-6 w-6" />
        {isRecording ? 'Dừng ghi âm' : 'Bắt đầu nói'}
      </Button>

      <div className="grid gap-3">
        <Button variant="outline" className="w-full justify-start">
          <Play className="mr-2 h-4 w-4" />
          Nghe mẫu hội thoại
        </Button>

        <Button variant="outline" className="w-full justify-start">
          <MessageCircle className="mr-2 h-4 w-4" />
          Trò chuyện với AI Coach
        </Button>
      </div>

      <div className="border-border border-t pt-4">
        <h4 className="text-foreground mb-3 font-medium">Tiến độ của bạn</h4>
        <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
          <Star className="h-4 w-4 text-yellow-500" />
          <span>0/3 gợi ý đã hoàn thành</span>
        </div>
        <div className="bg-muted h-3 w-full rounded-full">
          <div className="bg-primary h-3 w-0 rounded-full transition-all duration-300"></div>
        </div>
        <div className="text-muted-foreground mt-1 text-xs">0% hoàn thành</div>
      </div>
    </div>
  </div>
);
