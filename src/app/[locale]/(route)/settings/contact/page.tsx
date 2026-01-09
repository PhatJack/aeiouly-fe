import { Metadata } from 'next';

import SettingHeader from '@/components/app/settings/SettingHeader';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FAQ } from '@/constants/faq';

import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Liên hệ hỗ trợ',
  description: 'Liên hệ hỗ trợ',
};

export default function ContactPage() {
  return (
    <div className="space-y-4">
      <SettingHeader
        title="Liên hệ hỗ trợ"
        description="Chúng tôi luôn sẵn sàng hỗ trợ bạn"
        icon={MessageCircle}
      />

      <div className="grid grid-cols-1 gap-4">
        {/* Contact Information */}
        <div className="space-y-4">
          <div className="rounded-xl border p-4">
            <h2 className="mb-4 text-xl font-semibold">Thông tin liên hệ</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary rounded-lg p-2">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground text-sm">support@aeiouly.com</p>
                  <p className="text-muted-foreground text-sm">info@aeiouly.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary rounded-lg p-2">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Điện thoại</h3>
                  <p className="text-muted-foreground text-sm">+84 123 456 789</p>
                  <p className="text-muted-foreground text-sm">Thứ 2 - Thứ 6: 8:00 - 17:00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary rounded-lg p-2">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Địa chỉ</h3>
                  <p className="text-muted-foreground text-sm">
                    Số 1, Đường ABC, Phường XYZ, Quận 1,
                    <br />
                    Thành phố Hồ Chí Minh, Việt Nam
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border">
            <h2 className="px-4 pt-4 text-xl font-semibold">Câu hỏi thường gặp</h2>
            <Accordion type="single" collapsible>
              {FAQ.map((item, index) => (
                <AccordionItem key={index} value={item.question}>
                  <AccordionTrigger className="px-4">{item.question}</AccordionTrigger>
                  <AccordionContent className="px-4">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
