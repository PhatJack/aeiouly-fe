'use client';

import React, { useState } from 'react';

import { FeatureCard } from '@/components/app/onion/FeatureCard';
import { PracticePrompt } from '@/components/app/onion/PracticePrompt';
import { SituationCard } from '@/components/app/onion/SituationCard';
import { StatCard } from '@/components/app/onion/StatCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  ArrowLeft,
  Briefcase,
  Clock,
  Coffee,
  GraduationCap,
  Heart,
  MessageCircle,
  Mic,
  Plane,
  Play,
  ShoppingCart,
  Star,
  Target,
  Users,
} from 'lucide-react';

// Component: Bảng điều khiển luyện tập
const PracticeControls = ({ isRecording, onToggleRecording }) => (
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

// Component chính
const OnionPage = () => {
  const [selectedSituation, setSelectedSituation] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

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

  const startPractice = (situation) => {
    setSelectedSituation(situation);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  // Trang chi tiết tình huống
  if (selectedSituation) {
    return (
      <div className="size-full">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => setSelectedSituation(null)}
            className="hover:bg-muted mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách tình huống
          </Button>

          <div className="mb-6 flex items-start gap-6">
            <div className="bg-primary/10 shrink-0 rounded-xl p-4">{selectedSituation.icon}</div>
            <div className="flex-1">
              <h1 className="text-foreground mb-3 text-4xl font-bold">{selectedSituation.title}</h1>
              <p className="text-muted-foreground mb-4 text-lg leading-relaxed">
                {selectedSituation.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge
                  className={
                    selectedSituation.difficulty === 'Người mới'
                      ? 'border-green-200 bg-green-100 text-green-800'
                      : selectedSituation.difficulty === 'Trung bình'
                        ? 'border-yellow-200 bg-yellow-100 text-yellow-800'
                        : 'border-red-200 bg-red-100 text-red-800'
                  }
                >
                  {selectedSituation.difficulty}
                </Badge>
                <Badge
                  className={
                    selectedSituation.category === 'Cuộc sống'
                      ? 'border-blue-200 bg-blue-100 text-blue-800'
                      : selectedSituation.category === 'Công việc'
                        ? 'border-purple-200 bg-purple-100 text-purple-800'
                        : selectedSituation.category === 'Xã hội'
                          ? 'border-pink-200 bg-pink-100 text-pink-800'
                          : selectedSituation.category === 'Học tập'
                            ? 'border-indigo-200 bg-indigo-100 text-indigo-800'
                            : selectedSituation.category === 'Du lịch'
                              ? 'border-orange-200 bg-orange-100 text-orange-800'
                              : 'border-teal-200 bg-teal-100 text-teal-800'
                  }
                >
                  {selectedSituation.category}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {selectedSituation.duration}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Bối cảnh tình huống */}
          <div className="bg-background border-border rounded-lg border p-6 lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-foreground mb-4 flex items-center gap-2 text-2xl font-semibold">
                <Target className="text-primary h-6 w-6" />
                Bối cảnh tình huống
              </h2>
              <p className="text-foreground bg-muted/30 rounded-lg p-4 text-lg leading-relaxed">
                {selectedSituation.scenario}
              </p>
            </div>

            <div>
              <h3 className="text-foreground mb-4 text-xl font-semibold">Gợi ý luyện tập:</h3>
              <div className="space-y-4">
                {selectedSituation.prompts.map((prompt, index) => (
                  <PracticePrompt key={index} prompt={prompt} index={index} />
                ))}
              </div>
            </div>
          </div>

          {/* Điều khiển luyện tập */}
          <PracticeControls isRecording={isRecording} onToggleRecording={toggleRecording} />
        </div>
      </div>
    );
  }

  // Trang chính
  return (
    <div className="size-full">
      <div className="">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-foreground mb-6 text-5xl font-bold">Luyện Nói Theo Tình Huống</h1>
          <p className="text-muted-foreground mx-auto max-w-4xl text-xl leading-relaxed">
            Nâng cao kỹ năng nói với AI Coach thông qua các tình huống thực tế. Chọn từ những kịch
            bản đời thường và nhận phản hồi tức thì từ huấn luyện viên ảo của bạn.
          </p>
        </div>

        {/* Thống kê */}
        <div className="mb-16 grid grid-cols-2 gap-6 md:grid-cols-4">
          <StatCard value="8" label="Tình huống có sẵn" />
          <StatCard value="6" label="Danh mục" />
          <StatCard value="3" label="Cấp độ khó" />
          <StatCard value="AI" label="Huấn luyện viên" />
        </div>

        {/* Lưới tình huống */}
        <div className="mb-16">
          <h2 className="text-foreground mb-8 text-center text-3xl font-bold">
            Chọn tình huống luyện tập
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {situations.map((situation) => (
              <SituationCard key={situation.id} situation={situation} onStart={startPractice} />
            ))}
          </div>
        </div>

        {/* Phần tính năng */}
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
    </div>
  );
};

export default OnionPage;
