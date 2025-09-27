import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Clock } from 'lucide-react';

export interface SituationCardProps {
  situation: {
    icon: React.ReactNode;
    title: string;
    description: string;
    difficulty: string;
    category: string;
    duration: string;
  };
  onStart: (situation: SituationCardProps['situation']) => void;
}

export const SituationCard = ({ situation, onStart }: SituationCardProps) => {
  const difficultyColors = {
    'Người mới': 'bg-green-100 text-green-800 border-green-200',
    'Trung bình': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Nâng cao': 'bg-red-100 text-red-800 border-red-200',
  };

  const categoryColors = {
    'Cuộc sống': 'bg-blue-100 text-blue-800 border-blue-200',
    'Công việc': 'bg-purple-100 text-purple-800 border-purple-200',
    'Xã hội': 'bg-pink-100 text-pink-800 border-pink-200',
    'Học tập': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Du lịch': 'bg-orange-100 text-orange-800 border-orange-200',
    'Y tế': 'bg-teal-100 text-teal-800 border-teal-200',
  };

  return (
    <div className="border-border group hover:border-primary/30 cursor-pointer rounded-lg border p-6 transition-all duration-300 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <div className="bg-primary/10 group-hover:bg-primary/20 rounded-lg p-3 transition-colors">
          {situation.icon}
        </div>
        {/* <Badge className={difficultyColors[situation.difficulty]} variant="outline">
          {situation.difficulty}
        </Badge> */}
      </div>

      <h3 className="text-foreground mb-2 text-xl font-semibold">{situation.title}</h3>
      <p className="text-muted-foreground mb-4 leading-relaxed">{situation.description}</p>

      <div className="mb-4 flex items-center justify-between text-sm">
        {/* <Badge className={categoryColors[situation.category]} variant="outline">
          {situation.category}
        </Badge> */}
        <span className="text-muted-foreground flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {situation.duration}
        </span>
      </div>

      <Button
        onClick={() => onStart(situation)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
      >
        Bắt đầu luyện tập
      </Button>
    </div>
  );
};
