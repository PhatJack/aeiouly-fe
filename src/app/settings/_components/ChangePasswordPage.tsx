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
import { changePasswordSchema } from '@/services/auth/forgot-password.api';
import { useChangePasswordMutation } from '@/services/auth/forgot-password.api';
import { zodResolver } from '@hookform/resolvers/zod';

import { CheckCircle, CheckIcon, Eye, EyeOff, KeyRound, Lock, XIcon } from 'lucide-react';
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

  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-border';
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score === 3) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

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
                      <div
                        className="bg-border mt-3 mb-4 h-1 w-full overflow-hidden rounded-full"
                        role="progressbar"
                        aria-valuenow={strengthScore}
                        aria-valuemin={0}
                        aria-valuemax={4}
                        aria-label="Password strength"
                      >
                        <div
                          className={`h-full ${getStrengthColor(
                            strengthScore
                          )} transition-all duration-500 ease-out`}
                          style={{ width: `${(strengthScore / 4) * 100}%` }}
                        ></div>
                      </div>

                      {/* Password requirements list */}
                      <ul className="space-y-1.5" aria-label="Password requirements">
                        {strength.map((req, index) => (
                          <li key={index} className="flex items-center gap-2">
                            {req.met ? (
                              <CheckIcon
                                size={16}
                                className="text-emerald-500"
                                aria-hidden="true"
                              />
                            ) : (
                              <XIcon
                                size={16}
                                className="text-muted-foreground/80"
                                aria-hidden="true"
                              />
                            )}
                            <span
                              className={`text-xs ${
                                req.met ? 'text-emerald-600' : 'text-muted-foreground'
                              }`}
                            >
                              {req.text}
                              <span className="sr-only">
                                {req.met ? ' - Đạt yêu cầu' : ' - Không đạt yêu cầu'}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
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
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
