import { Metadata } from 'next';

import SettingHeader from '@/components/app/settings/SettingHeader';

import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Điều khoản dịch vụ',
  description: 'Điều khoản và điều kiện sử dụng dịch vụ',
};

export default function TermsPage() {
  return (
    <div className="space-y-6">
      <SettingHeader
        title="Điều khoản dịch vụ"
        description="Có hiệu lực từ ngày 13/09/2024"
        Icon={FileText}
      />

      <div className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">1. Giới thiệu</h2>
          <p className="text-foreground/80">
            Chào mừng bạn đến với AEIOULY. Bằng cách truy cập hoặc sử dụng dịch vụ của chúng tôi,
            bạn đồng ý tuân thủ các điều khoản và điều kiện sau đây.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">2. Đăng ký tài khoản</h2>
          <p className="text-foreground/80">
            Để sử dụng một số tính năng của dịch vụ, bạn cần đăng ký tài khoản. Bạn cam kết cung cấp
            thông tin chính xác và cập nhật đầy đủ.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">3. Quyền sở hữu trí tuệ</h2>
          <p className="text-foreground/80">
            Mọi nội dung trên nền tảng này đều thuộc quyền sở hữu của AEIOULY hoặc các bên cấp phép.
            Bạn không được phép sao chép, phân phối hoặc tạo ra các tác phẩm phái sinh mà không có
            sự cho phép bằng văn bản.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">4. Giới hạn trách nhiệm</h2>
          <p className="text-foreground/80">
            Dịch vụ được cung cấp &quot;nguyên trạng&quot; và &quot;theo khả năng hiện có&quot;.
            Chúng tôi không đảm bảo rằng:
          </p>
          <ul className="text-foreground/80 list-disc space-y-2 pl-6">
            <li>Dịch vụ sẽ không bị gián đoạn hoặc không có lỗi</li>
            <li>Kết quả nhận được từ việc sử dụng dịch vụ là chính xác hoặc đáng tin cậy</li>
            <li>Chất lượng của sản phẩm, dịch vụ, thông tin đáp ứng mong đợi của bạn</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">5. Thay đổi điều khoản</h2>
          <p className="text-foreground/80">
            Chúng tôi có quyền cập nhật các điều khoản này bất cứ lúc nào. Chúng tôi sẽ thông báo
            cho bạn về những thay đổi quan trọng qua email hoặc thông báo trên trang web.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">6. Liên hệ</h2>
          <p className="text-foreground/80">
            Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi qua
            email: support@aeiouly.com
          </p>
        </section>
      </div>
    </div>
  );
}
