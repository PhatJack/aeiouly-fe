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
          element: '#onion',
          popover: {
            title: '🎙️ Onion luyện nói',
            description:
              'Môi trường luyện nói trực tuyến với AI giúp bạn cải thiện kỹ năng giao tiếp và tự tin hơn trong các tình huống thực tế, với hơn 100+ tình huống nhập vai.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#gym',
          popover: {
            title: '🎓 Gym',
            description:
              'Tham gia luyện nghe, ngữ âm, tra cứu từ điển phát âm, và vô vàn hoạt động thú vị khác để nâng cao kỹ năng tiếng Anh của bạn.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#reading',
          popover: {
            title: '📚 Luyện đọc',
            description:
              'Khám phá kho bài đọc đa dạng với các chủ đề hấp dẫn, giúp bạn nâng cao kỹ năng đọc hiểu và mở rộng vốn từ vựng một cách hiệu quả.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#news',
          popover: {
            title: '📰 Bảng tin',
            description:
              'Cập nhật những tin tức mới nhất và các bài viết thú vị từ cộng đồng Aeiouly.',
            side: 'left',
            align: 'start',
          },
        },
        {
          element: '#setting',
          popover: {
            title: '⚙️ Cài đặt',
            description:
              'Tại đây bạn có thể điều chỉnh các cài đặt cá nhân, bao gồm thông báo, quyền riêng tư và nhiều tùy chọn khác.',
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
