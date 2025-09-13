'use client';

import { useMemo, useState } from 'react';
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
import { cn } from '@/lib/utils';
import { changePasswordSchema } from '@/services/auth/forgot-password.api';
import { useChangePasswordMutation } from '@/services/auth/forgot-password.api';
import { zodResolver } from '@hookform/resolvers/zod';

import { CheckCircle, Eye, EyeOff, KeyRound, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

type FormValues = z.infer<typeof changePasswordSchema>;

const ChangePasswordPage = () => {
  const [isShowNewPassword, setIsShowNewPassword] = useState<boolean>(false);
  const { mutate: changePassword, isPending } = useChangePasswordMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
    },
  });

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: 'Ít nhất 8 ký tự' },
      { regex: /[0-9]/, text: 'Ít nhất 1 số' },
      { regex: /[a-z]/, text: 'Ít nhất 1 chữ cái thường' },
      { regex: /[A-Z]/, text: 'Ít nhất 1 chữ cái hoa' },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = useMemo(
    () => checkStrength(form.watch('new_password') || ''),
    [form.watch('new_password')]
  );

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const onSubmit = (data: FormValues) => {
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
          Icon={KeyRound}
        />

        {/* Form Content */}
        <div className="p-6">
          <Form {...form}>
            {!form.formState.isSubmitted && (
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
                      <>
                        <FormMessage className="text-destructive text-sm" />
                        <div className="mt-2 space-y-2">
                          <div className="text-muted-foreground flex justify-between text-xs">
                            <span>Độ mạnh mật khẩu:</span>
                            <span>{strengthScore} / 4 yêu cầu</span>
                          </div>
                          <div className="space-y-1">
                            {strength.map((req, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div
                                  className={cn(
                                    'h-1.5 w-1.5 rounded-full',
                                    req.met ? 'bg-emerald-500' : 'bg-border'
                                  )}
                                />
                                <span
                                  className={cn(
                                    'text-xs',
                                    req.met ? 'text-foreground' : 'text-muted-foreground'
                                  )}
                                >
                                  {req.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button type="submit" disabled={isPending} className="h-12 w-full rounded-xl">
                  <CheckCircle className="h-5 w-5" />
                  Cập nhật mật khẩu
                </Button>
              </form>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
