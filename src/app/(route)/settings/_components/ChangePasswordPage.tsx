'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import SettingHeader from '@/components/app/settings/SettingHeader';
import { PasswordStrengthMeter } from '@/components/shared/PasswordStrengthMeter';
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
import { ChangePasswordSchema, changePasswordSchema } from '@/services/auth/forgot-password.api';
import { useChangePasswordMutation } from '@/services/auth/forgot-password.api';
import { zodResolver } from '@hookform/resolvers/zod';

import { CheckCircle, Eye, EyeOff, KeyRound, Lock } from 'lucide-react';
import { toast } from 'sonner';

const ChangePasswordPage = () => {
  const [isShowNewPassword, setIsShowNewPassword] = useState<boolean>(false);
  const { mutate: changePassword, isPending } = useChangePasswordMutation();

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
    },
  });

  const onSubmit = (data: ChangePasswordSchema) => {
    changePassword(data, {
      onSuccess: () => {
        toast.success('Mật khẩu đã được thay đổi thành công');
        form.reset();
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra';
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="w-full">
      <div className="bg-card overflow-hidden">
        {/* Header */}
        <SettingHeader
          title="Thay đổi mật khẩu"
          description="Cập nhật mật khẩu để bảo mật tài khoản"
          src={'/settingIcon/lock.png'}
        />

        {/* Form Content */}
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Current Password Field */}
              <div>
                <FormField
                  control={form.control}
                  name="current_password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-foreground flex items-center gap-2 text-sm font-medium">
                        <Lock size={16} className="text-muted-foreground" />
                        Mật khẩu hiện tại
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Nhập mật khẩu hiện tại của bạn"
                          {...field}
                          disabled={isPending}
                          className="border-border focus:border-primary h-12 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              {/* New Password Field */}
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-foreground text-sm font-medium">
                      Mật khẩu mới
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isShowNewPassword ? 'text' : 'password'}
                          placeholder="Nhập mật khẩu mới"
                          {...field}
                          disabled={isPending}
                          className="border-border focus:border-primary h-12 rounded-xl"
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setIsShowNewPassword((prev) => !prev)}
                          className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                        >
                          {isShowNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-destructive text-sm" />
                    <PasswordStrengthMeter
                      passwordFieldName="new_password"
                      control={form.control}
                    />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit" disabled={isPending} className="h-12 w-full rounded-xl">
                <CheckCircle className="h-5 w-5" />
                Cập nhật mật khẩu
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
