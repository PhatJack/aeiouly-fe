'use client';

import { useForm } from 'react-hook-form';

import SettingHeader from '@/components/app/settings/SettingHeader';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';

import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { toast } from 'sonner';
import * as z from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự' }),
  email: z.email({ message: 'Email không hợp lệ' }),
  subject: z.string().min(5, { message: 'Tiêu đề quá ngắn' }),
  message: z.string().min(10, { message: 'Nội dung phải có ít nhất 10 ký tự' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
      form.reset();
    } catch (error) {
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="space-y-8">
      <SettingHeader
        title="Liên hệ hỗ trợ"
        description="Chúng tôi luôn sẵn sàng hỗ trợ bạn"
        Icon={MessageCircle}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Contact Form */}
        <div className="bg-card border-border rounded-lg border p-6">
          <h2 className="mb-6 text-xl font-semibold">Gửi tin nhắn cho chúng tôi</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ và tên của bạn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input placeholder="Tiêu đề liên hệ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nội dung</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả chi tiết vấn đề của bạn..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="mt-4 w-full">
                Gửi tin nhắn
              </Button>
            </form>
          </Form>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="bg-card border-border rounded-lg border p-6">
            <h2 className="mb-6 text-xl font-semibold">Thông tin liên hệ</h2>

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

          <div className="bg-card border-border rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Câu hỏi thường gặp</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Thời gian phản hồi là bao lâu?</h3>
                <p className="text-muted-foreground text-sm">
                  Chúng tôi thường phản hồi trong vòng 24 giờ làm việc.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Tôi có thể gặp trực tiếp không?</h3>
                <p className="text-muted-foreground text-sm">
                  Vui lòng đặt lịch hẹn trước qua email hoặc điện thoại.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
