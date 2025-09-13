import { Metadata } from 'next';

import SettingHeader from '@/components/app/settings/SettingHeader';

import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
  description: 'Chính sách bảo mật của chúng tôi',
};

export default function PolicyPage() {
  return (
    <div className="space-y-6">
      <SettingHeader
        title="Chính sách bảo mật"
        description="Cập nhật lần cuối: 13/09/2024"
        Icon={ShieldCheck}
      />

      <div className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">1. Thu thập thông tin</h2>
          <p className="text-foreground/80">
            Chúng tôi thu thập thông tin cá nhân khi bạn đăng ký tài khoản, đăng nhập, sử dụng dịch
            vụ hoặc liên hệ với chúng tôi. Các thông tin có thể bao gồm: tên, email, số điện thoại,
            địa chỉ và thông tin thanh toán.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">2. Sử dụng thông tin</h2>
          <p className="text-foreground/80">Chúng tôi sử dụng thông tin để:</p>
          <ul className="text-foreground/80 list-disc space-y-2 pl-6">
            <li>Cung cấp và duy trì dịch vụ</li>
            <li>Cải thiện trải nghiệm người dùng</li>
            <li>Xử lý giao dịch</li>
            <li>Gửi thông báo quan trọng</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">3. Bảo mật thông tin</h2>
          <p className="text-foreground/80">
            Chúng tôi áp dụng các biện pháp bảo mật để bảo vệ thông tin cá nhân của bạn khỏi truy
            cập trái phép, thay đổi, tiết lộ hoặc phá hủy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">4. Liên hệ</h2>
          <p className="text-foreground/80">
            Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ với chúng tôi
            qua email: support@aeiouly.com
          </p>
        </section>
      </div>
    </div>
  );
}
