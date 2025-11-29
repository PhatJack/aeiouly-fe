import React, { useCallback } from 'react';

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

const scenarios: SpeakingScenario[] = [
  {
    id: 1,
    icon: <Coffee className="h-6 w-6" />,
    my_character: 'Khách hàng',
    ai_character: 'Nhân viên pha chế',
    scenario: 'Bạn bước vào quán cà phê đông đúc giờ cao điểm và gọi đồ uống yêu thích của mình.',
    level: 'A2',
    ai_gender: 'female',
  },
  {
    id: 2,
    icon: <Briefcase className="h-6 w-6" />,
    my_character: 'Ứng viên',
    ai_character: 'Người phỏng vấn',
    scenario:
      'Bạn tham gia buổi phỏng vấn chuyên nghiệp cho vị trí mong muốn, được hỏi về kinh nghiệm và mục tiêu.',
    level: 'B2',
    ai_gender: 'male',
  },
  {
    id: 3,
    icon: <Heart className="h-6 w-6" />,
    my_character: 'Người tham gia hẹn hò',
    ai_character: 'Đối phương',
    scenario:
      'Buổi hẹn đầu tiên tại nhà hàng ấm cúng, hai bên tìm hiểu sở thích và câu chuyện cá nhân.',
    level: 'B1',
    ai_gender: 'female',
  },
  {
    id: 4,
    icon: <GraduationCap className="h-6 w-6" />,
    my_character: 'Sinh viên thuyết trình',
    ai_character: 'Giáo sư',
    scenario: 'Bạn thuyết trình nghiên cứu trước lớp và trả lời câu hỏi từ giáo sư.',
    level: 'C1',
    ai_gender: 'male',
  },
  {
    id: 5,
    icon: <Plane className="h-6 w-6" />,
    my_character: 'Hành khách',
    ai_character: 'Nhân viên check-in',
    scenario: 'Bạn làm thủ tục tại sân bay quốc tế và hỏi về hành lý cũng như thay đổi chỗ ngồi.',
    level: 'B1',
    ai_gender: 'female',
  },
  {
    id: 6,
    icon: <Users className="h-6 w-6" />,
    my_character: 'Thành viên nhóm',
    ai_character: 'Quản lý dự án',
    scenario: 'Cuộc họp nhóm hàng tuần để báo cáo tiến độ và thảo luận giải pháp cho vấn đề mới.',
    level: 'B2',
    ai_gender: 'male',
  },
  {
    id: 7,
    icon: <ShoppingCart className="h-6 w-6" />,
    my_character: 'Khách mua sắm',
    ai_character: 'Nhân viên bán hàng',
    scenario: 'Bạn tìm kiếm một sản phẩm cụ thể và hỏi về các lựa chọn thay thế hoặc bảo hành.',
    level: 'A2',
    ai_gender: 'female',
  },
  {
    id: 8,
    icon: <MessageCircle className="h-6 w-6" />,
    my_character: 'Bệnh nhân',
    ai_character: 'Bác sĩ',
    scenario: 'Bạn mô tả triệu chứng trong buổi tái khám và hỏi về lựa chọn điều trị.',
    level: 'B1',
    ai_gender: 'male',
  },
];

export const SpeakingSampleScenarios: React.FC<SpeakingSampleScenariosProps> = ({ onSelect }) => {
  const handleSelect = useCallback(
    (scenario: SpeakingScenario) => {
      onSelect(scenario);
    },
    [onSelect]
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold lg:text-2xl">Tình huống mẫu</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                Cấp độ:{' '}
                <Badge
                  variant="outline"
                  className={cn('border font-semibold', getLevelColor(s.level))}
                >
                  {s.level}
                </Badge>
              </div>
              <div className="text-xs opacity-70">
                Giới tính:{' '}
                <Badge variant="outline" className="border font-semibold">
                  {s.ai_gender === 'male' ? 'Nam' : 'Nữ'}
                </Badge>
              </div>
            </div>
            <Button size="sm" onClick={() => handleSelect(s)} className="w-full">
              Chọn
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
