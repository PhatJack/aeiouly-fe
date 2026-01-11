'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'nextjs-toploader/app';

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
import { cn } from '@/lib/utils';
import {
  RequestPasswordResetSchema,
  requestPasswordResetSchema,
  useRequestPasswordResetMutation,
} from '@/services/auth/forgot-password.api';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

const ForgotPWForm = () => {
  const router = useRouter();
  const forgotPWForm = useForm<RequestPasswordResetSchema>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const requestPWMutate = useRequestPasswordResetMutation();

  const onSubmit = (data: RequestPasswordResetSchema) => {
    requestPWMutate.mutate(data, {
      onSuccess: () => {
        toast.success('Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu!');
      },
      onError: (error) => {
        toast.error((error as any).detail || 'Đăng nhập thất bại!');
      },
    });
  };

  return (
    <Form {...forgotPWForm}>
      <form onSubmit={forgotPWForm.handleSubmit(onSubmit)} className={cn('space-y-6')}>
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Quên mật khẩu</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Nhập email của bạn vào bên dưới để nhận được email đặt lại mật khẩu
          </p>
        </div>

        {/* Fields */}
        <div className="grid gap-4">
          {/* Email Field */}
          <FormField
            control={forgotPWForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="m@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Gửi yêu cầu đặt lại mật khẩu
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => router.push('/login')}
          >
            Trở lại trang đăng nhập
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { ForgotPWForm };
