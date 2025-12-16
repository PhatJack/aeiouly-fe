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
      stagePadding: 4,
      stageRadius: 20,
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
          element: '#app',
          popover: {
            title: '🏠 Trang chủ',
            description:
              'Điểm khởi đầu của bạn! Xem tổng quan về các hoạt động và khám phá nội dung mới nhất trên Aeiouly.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#self-study-space',
          popover: {
            title: '🌌 Không gian tự học',
            description:
              'Không gian học tập cá nhân của bạn với video nền thư giãn, âm thanh tập trung, bộ đếm thời gian Pomodoro và nhiều công cụ hữu ích khác giúp bạn tối ưu hiệu quả học tập.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#speaking-practice',
          popover: {
            title: '🎙️ Luyện nói',
            description:
              'Môi trường luyện nói trực tuyến với AI giúp bạn cải thiện kỹ năng giao tiếp và tự tin hơn trong các tình huống thực tế, với hơn 100+ tình huống nhập vai.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#writing-practice',
          popover: {
            title: '📝 Luyện viết',
            description:
              'Nhấn vào đây để luyện tập kỹ năng viết tiếng Anh và cải thiện khả năng diễn đạt ý tưởng của bạn.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#listening-practice',
          popover: {
            title: '🏋️ Luyện nghe',
            description:
              'Tham gia luyện nghe, ngữ âm, tra cứu từ điển phát âm, và vô vàn hoạt động thú vị khác để nâng cao kỹ năng tiếng Anh của bạn.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#reading-practice',
          popover: {
            title: '📚 Luyện đọc',
            description:
              'Khám phá kho bài đọc đa dạng với các chủ đề hấp dẫn, giúp bạn nâng cao kỹ năng đọc hiểu và mở rộng vốn từ vựng một cách hiệu quả.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#saved-vocabulary',
          popover: {
            title: '📰 Từ vựng đã lưu',
            description:
              'Xem và ôn tập các từ vựng bạn đã lưu để củng cố kiến thức và cải thiện khả năng ghi nhớ.',
            side: 'left',
            align: 'start',
          },
        },
        {
          element: '#profile',
          popover: {
            title: '👤 Hồ sơ cá nhân',
            description:
              'Quản lý thông tin cá nhân, xem tiến độ học tập và điều chỉnh cài đặt tài khoản của bạn.',
            side: 'left',
            align: 'start',
          },
        },
        {
          element: '#settings',
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
