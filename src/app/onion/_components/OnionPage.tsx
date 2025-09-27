'use client';

import React from 'react';

import { useRouter } from 'nextjs-toploader/app';

import { FeatureCard } from '@/components/app/onion/FeatureCard';
import { SituationCard } from '@/components/app/onion/SituationCard';
import { StatCard } from '@/components/app/onion/StatCard';

import {
  Briefcase,
  Coffee,
  GraduationCap,
  Heart,
  MessageCircle,
  Plane,
  ShoppingCart,
  Star,
  Target,
  Users,
} from 'lucide-react';

// Component chính
const OnionPage = () => {
  const router = useRouter();

  const situations = [
    {
      id: 1,
      title: 'Gọi cà phê',
      description: 'Luyện tập đặt đồ uống yêu thích và trò chuyện với nhân viên pha chế',
      icon: <Coffee className="h-6 w-6" />,
      difficulty: 'Người mới',
      duration: '3-5 phút',
      category: 'Cuộc sống',
      scenario:
        'Bạn đang ở một quán cà phê đông khách vào giờ cao điểm buổi sáng. Nhân viên pha chế chào bạn một cách thân thiện.',
      prompts: [
        'Gọi đồ uống thường dùng với một yêu cầu thay đổi',
        'Hỏi về món đặc biệt trong ngày',
        'Bình luận về thời tiết hoặc ngày hôm nay',
      ],
    },
    {
      id: 2,
      title: 'Phỏng vấn xin việc',
      description: 'Chuẩn bị cho các câu hỏi phỏng vấn thường gặp và luyện giao tiếp chuyên nghiệp',
      icon: <Briefcase className="h-6 w-6" />,
      difficulty: 'Nâng cao',
      duration: '10-15 phút',
      category: 'Công việc',
      scenario:
        'Bạn đang trong buổi phỏng vấn chính thức cho công việc mơ ước. Người phỏng vấn thân thiện nhưng chuyên nghiệp.',
      prompts: [
        'Hãy kể về bản thân bạn',
        'Tại sao bạn muốn làm việc ở đây?',
        'Mô tả một tình huống khó khăn bạn đã vượt qua',
      ],
    },
    {
      id: 3,
      title: 'Buổi hẹn đầu tiên',
      description: 'Điều hướng sự phấn khích và lo lắng khi tìm hiểu về ai đó đặc biệt',
      icon: <Heart className="h-6 w-6" />,
      difficulty: 'Trung bình',
      duration: '8-12 phút',
      category: 'Xã hội',
      scenario:
        'Bạn đang trong buổi hẹn đầu tiên tại một nhà hàng ấm cúng. Không khí thoải mái và lãng mạn.',
      prompts: [
        'Chia sẻ về một sở thích hoặc đam mê thú vị',
        'Hỏi về những trải nghiệm du lịch của họ',
        'Thảo luận về phim hoặc sách yêu thích',
      ],
    },
    {
      id: 4,
      title: 'Thuyết trình đại học',
      description: 'Trình bày nghiên cứu hoặc dự án của bạn trước bạn học và giáo sư',
      icon: <GraduationCap className="h-6 w-6" />,
      difficulty: 'Nâng cao',
      duration: '12-20 phút',
      category: 'Học tập',
      scenario:
        'Bạn đang thuyết trình trước lớp 30 sinh viên và giáo sư của bạn. Mọi người đều chú ý lắng nghe.',
      prompts: [
        'Giới thiệu chủ đề và lý do tại sao nó quan trọng',
        'Giải thích phương pháp hoặc cách tiếp cận của bạn',
        'Xử lý câu hỏi từ khán giả',
      ],
    },
    {
      id: 5,
      title: 'Check-in sân bay',
      description: 'Xử lý thủ tục du lịch, đặt câu hỏi và giải quyết các vấn đề có thể xảy ra',
      icon: <Plane className="h-6 w-6" />,
      difficulty: 'Trung bình',
      duration: '5-8 phút',
      category: 'Du lịch',
      scenario:
        'Bạn đang ở sân bay quốc tế đông đúc. Nhân viên check-in hỗ trợ nhiệt tình nhưng hiệu quả.',
      prompts: [
        'Check-in cho chuyến bay của bạn',
        'Hỏi về nâng cấp hoặc thay đổi chỗ ngồi',
        'Tìm hiểu về quy định hành lý',
      ],
    },
    {
      id: 6,
      title: 'Họp nhóm',
      description: 'Đóng góp ý tưởng, đặt câu hỏi và hợp tác hiệu quả với đồng nghiệp',
      icon: <Users className="h-6 w-6" />,
      difficulty: 'Trung bình',
      duration: '10-15 phút',
      category: 'Công việc',
      scenario:
        'Bạn đang trong cuộc họp nhóm hàng tuần với 6 đồng nghiệp thảo luận về các dự án sắp tới.',
      prompts: [
        'Trình bày tiến độ trong tuần của bạn',
        'Đề xuất ý tưởng hoặc giải pháp mới',
        'Đặt câu hỏi làm rõ về nhiệm vụ',
      ],
    },
    {
      id: 7,
      title: 'Mua sắm',
      description: 'Yêu cầu trợ giúp tìm sản phẩm, so sánh hàng hóa và đưa ra quyết định',
      icon: <ShoppingCart className="h-6 w-6" />,
      difficulty: 'Người mới',
      duration: '4-6 phút',
      category: 'Cuộc sống',
      scenario:
        'Bạn đang ở cửa hàng bách hóa tìm kiếm một món hàng cụ thể. Nhân viên bán hàng thân thiện tiếp cận.',
      prompts: [
        'Mô tả những gì bạn đang tìm kiếm',
        'Yêu cầu gợi ý hoặc lựa chọn thay thế',
        'Hỏi về chính sách đổi trả hoặc bảo hành',
      ],
    },
    {
      id: 8,
      title: 'Khám bác sĩ',
      description: 'Thảo luận triệu chứng, hiểu lời khuyên y tế và đặt câu hỏi quan trọng',
      icon: <MessageCircle className="h-6 w-6" />,
      difficulty: 'Trung bình',
      duration: '8-10 phút',
      category: 'Y tế',
      scenario:
        'Bạn đang ở phòng khám bác sĩ để kiểm tra sức khỏe định kỳ. Bác sĩ chu đáo và quan tâm.',
      prompts: [
        'Mô tả triệu chứng hoặc mối quan tâm của bạn',
        'Hỏi về các lựa chọn điều trị',
        'Làm rõ hướng dẫn hoặc thuốc',
      ],
    },
  ];

  const handleStartPractice = (situationId: number) => {
    router.push(`/onion/${situationId}`);
  };

  return (
    <div className="size-full">
      <div className="mb-16">
        <h2 className="text-foreground mb-8 text-lg font-bold md:text-2xl">
          Các tình huống cá nhân hoá được yêu thích nhất
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {situations.map((situation) => (
            <SituationCard
              key={situation.id}
              situation={situation}
              onStart={() => handleStartPractice(situation.id)}
            />
          ))}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-foreground mb-12 text-3xl font-bold">
          Tại sao luyện tập với AI Coach?
        </h2>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <FeatureCard
            icon={<MessageCircle className="text-primary h-8 w-8" />}
            title="Phản hồi thời gian thực"
            description="Nhận phản hồi tức thì về cách phát âm, độ trôi chảy và kỹ năng hội thoại của bạn."
          />
          <FeatureCard
            icon={<Target className="text-primary h-8 w-8" />}
            title="Luyện tập cá nhân hóa"
            description="Các tình huống thích ứng điều chỉnh theo trình độ kỹ năng và tốc độ học của bạn."
          />
          <FeatureCard
            icon={<Star className="text-primary h-8 w-8" />}
            title="Theo dõi tiến độ"
            description="Giám sát sự cải thiện của bạn qua các tình huống và kỹ năng khác nhau."
          />
        </div>
      </div>
    </div>
  );
};

export default OnionPage;
