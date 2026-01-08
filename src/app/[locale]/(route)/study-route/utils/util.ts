import { IconName } from 'lucide-react/dynamic';

export const getSkillIcon = (skillType: string): IconName => {
  switch (skillType) {
    case 'reading':
      return 'book-open';
    case 'listening':
      return 'headphones';
    case 'speaking':
      return 'mic';
    case 'writing':
      return 'pen-tool';
    default:
      return 'book-open';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'done':
      return 'Hoàn thành';
    case 'in_progress':
      return 'Tiếp tục';
    default:
      return 'Bắt đầu';
  }
};

export const getGenderText = (gender: string) => {
  switch (gender) {
    case 'male':
      return 'Nam';
    case 'female':
      return 'Nữ';
    default:
      return 'Không xác định';
  }
};
