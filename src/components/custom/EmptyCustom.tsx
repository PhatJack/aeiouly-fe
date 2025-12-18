import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { cn } from '@/lib/utils';

interface EmptyCustomProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  content?: React.ReactNode;
  className?: string;
}

const EmptyCustom = ({ icon, title, description, content, className }: EmptyCustomProps) => {
  return (
    <Empty className={cn('border border-dashed', className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{content}</EmptyContent>
    </Empty>
  );
};
export default EmptyCustom;
