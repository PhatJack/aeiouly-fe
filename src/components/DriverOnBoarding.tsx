'use client';

import { useEffect } from 'react';

import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export default function DriverOnboarding() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasSeenTour = localStorage.getItem('onboarding_done');
    if (hasSeenTour) return;

    const driverObj = driver({
      nextBtnText: 'Tiếp tục →',
      prevBtnText: '← Quay lại',
      doneBtnText: '🎉 Hoàn tất',
      animate: true,
      smoothScroll: true,
      stagePadding: 8,
      stageRadius: 12,
      popoverClass: 'aeiouly-custom',
      onDestroyed: () => {
        // Lưu lại để tour không chạy lần nữa
        localStorage.setItem('onboarding_done', 'true');
      },
      steps: [
        {
          popover: {
            title: '👋 Xin chào! Chào mừng đến với Aeiouly',
            description:
              'Chào mừng bạn đến với Aeiouly - nền tảng chia sẻ và khám phá tuyệt vời! Hãy cùng mình khám phá nhanh các tính năng để bạn có thể sử dụng hiệu quả nhất nhé. ✨',
            side: 'over',
            align: 'center',
          },
        },
        {
          element: '#home',
          popover: {
            title: '🏠 Trang chủ',
            description:
              'Điểm khởi đầu của bạn! Xem tổng quan về các hoạt động và khám phá nội dung mới nhất trên Aeiouly.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#create-topic',
          popover: {
            title: '📝 Tạo chủ đề mới',
            description:
              'Nhấn vào đây để tạo một chủ đề mới và bắt đầu chia sẻ những ý tưởng, câu chuyện thú vị của bạn với cộng đồng.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#space',
          popover: {
            title: '🌌 Không gian tự học',
            description:
              'Không gian học tập cá nhân của bạn với video nền thư giãn, âm thanh tập trung, bộ đếm thời gian Pomodoro và nhiều công cụ hữu ích khác giúp bạn tối ưu hiệu quả học tập.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#onion',
          popover: {
            title: '🎙️ Onion luyện nói',
            description:
              'Môi trường luyện nói trực tuyến với AI giúp bạn cải thiện kỹ năng giao tiếp và tự tin hơn trong các tình huống thực tế, với hơn 100+ tình huống nhập vai.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#gym',
          popover: {
            title: '� Gym luyện nghe',
            description:
              'Tham gia luyện nghe, ngữ âm, tra cứu từ điển phát âm, và vô vàn hoạt động thú vị khác để nâng cao kỹ năng tiếng Anh của bạn.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#reading',
          popover: {
            title: '📚 Luyện đọc',
            description:
              'Khám phá kho bài đọc đa dạng với các chủ đề hấp dẫn, giúp bạn nâng cao kỹ năng đọc hiểu và mở rộng vốn từ vựng một cách hiệu quả.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#news',
          popover: {
            title: '📰 Bảng tin',
            description:
              'Cập nhật những tin tức mới nhất và các bài viết thú vị từ cộng đồng Aeiouly. Kết nối và chia sẻ với những người học cùng đam mê.',
            side: 'left',
            align: 'start',
          },
        },
        {
          element: '#setting',
          popover: {
            title: '⚙️ Cài đặt',
            description:
              'Tại đây bạn có thể điều chỉnh các cài đặt cá nhân, bao gồm thông tin tài khoản, thông báo, quyền riêng tư và nhiều tùy chọn khác.',
            side: 'left',
            align: 'start',
          },
        },
        {
          popover: {
            title: '🎉 Tới đây là xong rồi nè',
            description:
              'Tuyệt vời!.Giờ hãy bắt đầu khám phá và tạo ra những nội dung tuyệt vời trên Aeiouly nhé! 🚀',
            side: 'over',
            align: 'center',
          },
        },
      ],
    });

    driverObj.drive();
  }, []);

  return null;
}
